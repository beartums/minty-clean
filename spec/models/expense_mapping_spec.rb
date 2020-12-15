require 'rails_helper'

RSpec.describe ExpenseMapping, type: :model do

  let(:user) { User.create!(username: 'test', password: 'test', email: 'e@example.com') } 
  let(:transaction_set) { user.transaction_sets.create!(name: 'test ts') }
  let(:expense_group) { transaction_set.expense_groups.create!( name: 'test group') } 
  let(:expense_category) { expense_group.expense_categories.create!( name: 'test category' ) } 
  let(:mapping) { transaction_set.expense_mappings.create!(original_description: 'GREEN GOURMET', expense_category: expense_category) } 

  before do
    AccountType.create(name: 'credit_card')
    transaction_set.import_csv('spec/fixtures/files/transactions_sample.csv',false,true)
  end

  context 'when finding matched transactions' do
    
    it "provides a hit_count" do
      expect(mapping.hit_count).to eq(1)  
    end

    it 'finds without wildcards' do
      matched_transactions = mapping.matched_transactions
      expect(matched_transactions.count).to eq(1)
      matched_transactions.all.each {|mt| expect(mt.original_description).to eq(mapping.original_description)}
    end
    
    it 'finds with * wildcards' do
      mapping.update_attributes(original_description: '*ET*')
      matched_transactions = mapping.matched_transactions
      expect(matched_transactions.count).to eq(3)
      matched_transactions.all.each {|mt| expect(mt.original_description).to match(/ET/)}
    end
    
    it 'finds with ? wildcards' do
      mapping.update_attributes(original_description: '??EA*')
      matched_transactions = mapping.matched_transactions
      expect(matched_transactions.count).to eq(3)
      matched_transactions.all.each {|mt| expect(mt.original_description).to match(/.{0,2}EA/)}
    end
    
    it 'respects escaped wildcards' do
      mapping.update_attributes(original_description: '*\**\?\?')
      matched_transactions = mapping.matched_transactions
      expect(matched_transactions.count).to eq(1)
      matched_transactions.all.each {|mt| expect(mt.original_description).to match(/.*\*.*\?\?/)}
    end
    
    it 'searches multiple fields' do
      mapping.update_attributes(original_description: '*A*', category: 'Furnishings')
      matched_transactions = mapping.matched_transactions
      expect(matched_transactions.count).to eq(3)
      matched_transactions.all.each {|mt| expect(mt.original_description).to match(/A/)}
      matched_transactions.all.each {|mt| expect(mt.category).to eq('Furnishings')}
    end
    
    it 'returns nothing if no fields defined' do
      mapping.update_attributes(original_description: nil, category: nil)
      matched_transactions = mapping.matched_transactions
      expect(matched_transactions.count).to eq(0)
    end

  end
end
