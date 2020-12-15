require 'rails_helper'

RSpec.describe "TransactionSets", type: :request do

  context "creating a new transaction set" do

    let(:file) { fixture_file_upload('spec/fixtures/files/transactions_sample.csv') }
    let(:user) { User.create(username: 'test', password: 'password', email: 'test@example.com')}

    before do
      AccountType.create(name: "credit card")
      allow_any_instance_of(ApplicationController).to receive(:logged_in_user).and_return(user)
    end
    
    context "when valid" do

      it "creates with basic attributes" do
        params = { file: file, auto_accounts: true , transaction_set: { name: "test", ignore_before: "1/1/2016" } }
        post "/api/v1/transaction_sets", :params => params
        expect(response.status).to eq(200)
        expect(JSON.parse(response.body)). to satisfy { |b| b.one? { |o| o['name'] == 'test' && o['ignore_before'] = '2016-01-01'}}
      end

      it "Adds transactions, and transaction_set when successful" do
        params = { file: file, auto_accounts: true, transaction_set: { name:'test', ignore_before: "1/1/2016" } }
        expect {
          post "/api/v1/transaction_sets", :params => params
        }.to change { TransactionSet.count }.by(1)
        .and change { Transaction.count }.by(4)
        .and change { Account.count }.by(1)
        .and change { AccountMapping.count }.by(1)
        .and change { user.transaction_sets.count }.by(1)
      end

    end

    context "When not valid" do

      it "rejects transaction_set without a name value and removes all the added data" do
        allow(user).to receive(:save).and_raise(StandardError.new)
        params = { file: file, auto_accounts: true, transaction_set: { ignore_before: "1/1/2019" } }
        expect {
          post "/api/v1/transaction_sets", :params => params
        }.to change { TransactionSet.count }.by(0)
        .and change { Transaction.count }.by(0)
        .and change { user.transaction_sets.count }.by(0)
      end

    end
  end

  context "when updating a transaction set" do

    let(:file) { fixture_file_upload('spec/fixtures/files/transactions_sample.csv') }
    let(:user) { User.create(username: 'test', password: 'password', email: 'test@example.com') }
    let(:transaction_set) { TransactionSet.create(name: 'test', description: 'test description') }

    before do
      AccountType.create(name: "credit card")
      allow_any_instance_of(ApplicationController).to receive(:logged_in_user).and_return(user)
      user.transaction_sets << transaction_set
    end

    context "to change attribute values" do
      it "changes the changeable attributes" do
        patch "/api/v1/transaction_sets/#{transaction_set.id}", 
          :params => { transaction_set: { name: "new name", description: 'new description', ignore_before: "1/1/2019" } }
        expect(TransactionSet.find(transaction_set.id)).to have_attributes(name: 'new name', description: 'new description', ignore_before: Date.parse('2019-01-01'))
      end

      it "doesn't allow changing the transaction set of another user" do
        user2 = User.create(username: 'test', password: 'password', email: 'test@example.com')
        ts2 =  TransactionSet.create(name: "set2")
        user2.transaction_sets << ts2
        patch "/api/v1/transaction_sets/#{ts2.id}", 
          :params => { transaction_set: { name: "new name", description: 'new description', ignore_before: "1/1/2019" } }
        expect(response.status).not_to eq(200)
        ts2.reload
        transaction_set.reload
        expect(ts2).to have_attributes(name: 'set2', description: nil, ignore_before: nil)
        expect(transaction_set).to have_attributes(name: 'test', description: 'test description', ignore_before: nil)
      end
    end
    context "to upload new transactions" do
      it "adds transactions to the right transaction set, but does NTO update transaction_set details" do
        params = { file: file, auto_accounts: true, transaction_set: { name: "test blah", ignore_before: "1/1/2014" } }
        expect {
          patch "/api/v1/transaction_sets/#{transaction_set.id}", :params => params
        }.to change { TransactionSet.count }.by(0)
        .and change { Transaction.count }.by(7)
        .and change { user.transaction_sets.count }.by(0)
        .and change { transaction_set.transactions.count }.by(7)
        expect(TransactionSet.find(transaction_set.id)).to have_attributes( name: "test", ignore_before: nil)
      end
    end
  end

  context "When requesting a specific transaction set" do
    
    it "returns an error unless the requestor has access" do
    end

    it "returns the specified transaction set details" do
    end

  end

  context "When requesting all transactions sets" do
    let(:file_path) { 'spec/fixtures/files/transactions_sample.csv' }
    let(:user) { User.create(username: 'test', password: 'password', email: 'test@example.com')}
    let(:user2) { User.create(username: 'test2', password: 'password', email: 'test2@example.com')}

    before do
      AccountType.create(name: "credit card")
      allow_any_instance_of(ApplicationController).to receive(:logged_in_user).and_return(user)
      user.transaction_sets << TransactionSet.create(name:"1")
      user.transaction_sets.last.import_csv(file_path, false, true)
      user.transaction_sets << TransactionSet.create(name:"2")
      user.transaction_sets.last.import_csv(file_path, false, true)
      user2.transaction_sets << TransactionSet.create(name:"3")
      user2.transaction_sets.last.import_csv(file_path, false, true)
    end

    it "only returns transaction sets the user has access to" do
      get '/api/v1/transaction_sets'
      res = JSON.parse(response.body)
      expect(res.count).to eq(2)
      expect(res[0]).to include("transactions_count" => 7, "name" => '1', "last_transaction_at" => '2019-10-09')
      expect(res[1]).to include("transactions_count" => 7, "name" => '2', "accounts_count" => 1)
    end

  end

  context "When destroying a transaction set" do
    let(:file_path) { 'spec/fixtures/files/transactions_sample.csv' }
    let(:user) { User.create(username: 'test', password: 'password', email: 'test@example.com')}
    let(:user2) { User.create(username: 'test2', password: 'password', email: 'test2@example.com')}

    before do
      AccountType.create(name: "credit card")
      allow_any_instance_of(ApplicationController).to receive(:logged_in_user).and_return(user)

      user.transaction_sets << TransactionSet.create(name:"1")
      user.transaction_sets.last.import_csv(file_path, false, true)
      user2.transaction_sets << TransactionSet.create(name:"2")
      user2.transaction_sets.last.import_csv(file_path, false, true)
    end

    it "doesn't leave any trash" do
      ts = user.transaction_sets.first
      expect {
        delete api_v1_transaction_set_path(ts.id)
      }.to change(TransactionSet, :count).by(-1)
      .and change(Transaction, :count).by(-7)
      .and change(Account, :count).by(-1)
      .and change(AccountMapping, :count).by(-1)
    end
    
    it "doesn't delete unless part of the user's transaction_sets" do
      ts = user2.transaction_sets.first
      expect {
        delete api_v1_transaction_set_path(ts.id)
      }.to change(TransactionSet, :count).by(0)
      .and change(Transaction, :count).by(0)
      .and change(Account, :count).by(0)
      .and change(AccountMapping, :count).by(0)
      expect(response.status).to eq(405)
    end
  end

end
