require 'rails_helper'

RSpec.describe "Accounts", type: :request do

  let(:user) { User.create(username: 'test', password: 'password', email: 'test@example.com')}
  let(:transaction_set) { user.transaction_sets.create(name: 'test', description: 'test description') }
  let(:account_type) { AccountType.create(name: 'credit card') }

  before do
    transaction_set.accounts.create(name: 'test account', description: 'test, dummy!', account_type: account_type)
    transaction_set.accounts.create(name: 'another test', description: 'still testing, dummy!', account_type: account_type)
    allow_any_instance_of(ApplicationController).to receive(:logged_in_user).and_return(user)
  end

  context 'when getting the full list' do
    it 'shows all account mappings' do
      get '/api/v1/accounts'
      res = JSON.parse(response.body)
      expect(res.count).to eq (2)
    end
  end

  context 'when getting a single account' do
    it 'shows all columns' do
      account = Account.first
      get "/api/v1/accounts/#{account.id}"
      res = JSON.parse(response.body)
      expect(res).to include('name', 'description', 'id', 'updated_at', 'created_at')
    end
  end

  context "when creating a new account" do
    it "adds the account to the transaction set" do
      expect {
        post '/api/v1/accounts', :params => { account: {name: 'jon snow', description: 'account for snow', account_type_id: account_type.id} }
      }.to change { transaction_set.accounts.count }.by(1)
      .and change { Account.count }.by(1)
      .and change { user.transaction_sets.first.accounts.count }.by(1)
      .and change { account_type.accounts.count }.by(1)
      res = JSON.parse(response.body)
      expect(res).to include('name' => 'jon snow', 'description' => 'account for snow')
    end
  end

  context "when deleteing an account" do
    it "removes the account" do
      account = Account.first
      expect {
        delete "/api/v1/accounts/#{account.id}"
      }.to change { Account.count }.by(-1)
      .and change { account_type.accounts.count }.by(-1)
      expect(JSON.parse(response.body)).to include('message'=> 'success')
    end
    it "doesn't delete anything if account is in another transaction set" do
      ts2 = user.transaction_sets.create(name: 'test2', description: 'test2 description')
      account2 = ts2.accounts.create(name: "another", account_type_id: account_type.id)
      expect {
        delete "/api/v1/accounts/#{account2.id}", :params => { transaction_set_id: transaction_set.id }
      }.to change { Account.count }.by(0)
      expect(JSON.parse(response.body)).to include('message'=> 'failed')
    end
  end

  context "when updating an account" do
    it "changes name, description, and account type" do
      account = Account.first
      account_type2 = AccountType.create(name: 'savings')
      params = { account: { name: 'changed name', description: 'changed description', account_type_id: account_type2.id}}
      patch "/api/v1/accounts/#{account.id}" , :params => params
      expectation = params[:account]
      expect(JSON.parse(response.body)).to include(expectation.stringify_keys)
    end
  end


end
