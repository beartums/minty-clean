require 'rails_helper'

RSpec.describe "ExpenseMappings", type: :request do

  let(:transaction_set) { user.transaction_sets.create!(name: 'test ts') }
  let(:user) { User.create!(username: 'test', password: 'test', email: 't@example.com') }
  let(:expense_group) { transaction_set.expense_groups.create!(name: 'House and Home') } 
  let(:category_1) { expense_group.expense_categories.create!(name: 'Maintenance') } 
  let(:category_2) { expense_group.expense_categories.create!(name: 'Housewares') } 

  before do
    txn_hash = {amount: 25.00, transaction_type: 'debit', date: '2020-10-10', account_name: 'Savor'}
    transaction_set.transactions.create(txn_hash.merge(original_description: 'Home Depot', category: 'Furnishings'))
    transaction_set.transactions.create(txn_hash.merge(original_description: 'the Home Depot branch *466934*', category: 'DIY'))
    transaction_set.transactions.create(txn_hash.merge(original_description: 'The Home Store', category: 'Houseware'))
    allow_any_instance_of(ApplicationController).to receive(:logged_in_user).and_return(user)
  end

  context "when listing expense mappings" do
    it "lists the user's mappings with hit count and expense_category, names" do
      map1 = transaction_set.expense_mappings.create!(original_description: '*Home Depot*', expense_category: category_1)
      map2 = transaction_set.expense_mappings.create!(original_description: '*Home Store', expense_category: category_2)
      get api_v1_expense_mappings_path
      res = JSON.parse(response.body)
      expect(res.count).to eq(2)
      expect(res).to include(
        hash_including(
          'category', 'account', 
          'hit_count'=> 2,
          'original_description'=> '*Home Depot*', 
          'expense_category'=> hash_including(
            'name'=> category_1.name,
            'breadcrumb_name'=> category_1.breadcrumb_name
          )
        )
      )
    end
  end

  context "when creating a mapping" do
    it "has no required fields" do
      
    end
  end

  context "when delesting a mapping" do
    it "has no trash to clean up" do
      
    end
  end

  context "when showing a mapping" do
    it "shows the same fields as listing" do
      
    end
  end

  context "when updating a mapping" do
    it "returns the updated values" do
      
    end
  end
end
