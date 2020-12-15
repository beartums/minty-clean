require 'rails_helper'

RSpec.describe "AccountTypes", type: :request do

  let(:user) { User.create(username: 'test', password: 'password', email: 'test@example.com')}
  let(:transaction_set) { user.transaction_sets.create(name: 'test', description: 'test description') }

  before do
    AccountType.create(name: 'credit card')
    AccountType.create(name: 'savings')
    AccountType.create(name: 'checking')
    allow_any_instance_of(ApplicationController).to receive(:logged_in_user).and_return(user)
  end

  context 'when getting the full list' do
    it 'shows all account mappings' do
      get '/api/v1/account_types'
      res = JSON.parse(response.body)
      expect(res.count).to eq (3)
    end
  end

  context 'when getting a single account type' do
    it 'shows all columns' do
      account_type = AccountType.first
      get "/api/v1/account_types/#{account_type.id}"
      res = JSON.parse(response.body)
      expect(res).to include('name', 'id', 'updated_at', 'created_at')
    end
  end

end
