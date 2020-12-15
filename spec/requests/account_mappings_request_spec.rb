require 'rails_helper'

RSpec.describe "AccountMappings", type: :request do

  let(:transaction_set) { user.transaction_sets.create(name: 'test ts') }
  let(:user) { User.create(username: 'test', password: 'test', email: 't@example.com') }
  let(:account_type) { name:'checking' }
  let(:account_1) { transaction_set.accounts.create(name: 'big bank checking') }
  let(:account_2) { transaction_set.accounts.create(name: 'little bank checking') }

  before do
    transaction_set.account_mappings.create(inbound_string: 'big bank checking', account_id: account_1.id)
    transaction_set.transactions.create(account_name: 'little bank checking', amount: 25.00, date: '2020-10-10', transaction_type: 'debit')
    transaction_set.transactions.create(account_name: 'big bank checking', amount: 2500.00, date: '2020-05-10', transaction_type: 'credit')
    transaction_set.transactions.create(account_name: 'little bank checking', amount: 10, date: '2019-01-10', transaction_type: 'debit')
    allow_any_instance_of(ApplicationController).to receive(:logged_in_user).and_return(user)
  end

  context "when creating a mapping" do
    it "returns the mapping with hit count" do
      params = { account_mapping: { inbound_string: 'little bank checking', account_id: account_2.id } }
      expect {
        post '/api/v1/account_mappings', :params => params
      }.to change { transaction_set.account_mappings.count }.by(1)
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)).to include("inbound_string", "account_id", "hit_count" => 2)
    end
  end

  context "when listing mappings" do
    it "returns the appropriate values" do
      transaction_set.account_mappings.create(inbound_string: 'little bank checking', account_id: account_2.id)
      get api_v1_account_mappings_path
      res = JSON.parse(response.body)
      expect(res.count).to eq(2)
      expect(res[1]).to include('id', 'created_at', 'updated_at', 'hit_count', 'inbound_string', 'account_id', 'account'=> hash_including("name"))
      expect(res[1]).to include('account'=> hash_not_including("description", "id", "updated_at", "created_at"))
    end
  end

  context "when querying a single mapping" do
    it "returns the mapping with hit count" do
      mapping = transaction_set.account_mappings.first
      get api_v1_account_mapping_path(mapping.id)
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)).to include(
        "inbound_string" => mapping.inbound_string, 
        "account_id" => mapping.account_id, 
        "hit_count" => a_kind_of(Integer),
        "account" => hash_including("name"))
    end
  end

  context "when updating a mapping" do
    it "updates the mapping and returns the new mapping" do
      mapping = transaction_set.account_mappings.first
      params = { account_mapping: { account_id: account_2.id } }
      patch api_v1_account_mapping_path(mapping.id), :params => params
      expect(response.status).to eq(200)
      expect(JSON.parse(response.body)).to include("inbound_string", "account_id" => account_2.id, "account" => hash_including("name" => account_2.name))
      mapping.reload
      expect(mapping.account_id).to eq(account_2.id)
    end
  end

  context "when deleting a mapping" do
    it "removes the single mapping" do
      mapping = transaction_set.account_mappings.first
      expect {
        delete api_v1_account_mapping_path(mapping.id)
      }.to change { AccountMapping.count }.by(-1)
    end
  end

end
