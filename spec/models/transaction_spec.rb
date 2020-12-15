require 'rails_helper'

RSpec.describe Transaction, type: :model do
  let(:ts)  {TransactionSet.create(name: 'test ts')}
  let(:acct_type) { AccountType.create(name: 'test account type')}
  let(:acct)  { Account.create(name: 'test acct', account_type: acct_type, transaction_set: ts)}
  let(:txn_hash) { {date: Date.new, amount: 1, transaction_type: 'credit', transaction_set: ts, account: acct} }

  context "When creating a transaction" do
    it "requires a date" do
      txn = Transaction.new(txn_hash.merge(date: nil))
      expect(txn.valid?).to eq(false)
    end
    
    it "rejects a bad date" do
      txn = Transaction.new(txn_hash.merge(date: '10/21/2020'))
      expect(txn.valid?).to eq(false)
    end
    
    it "accepts a string date in ISO format" do
      txn = Transaction.new(txn_hash.merge(date: '2020-10-20'))
      expect(txn.valid?).to eq(true)
    end
    
    it "requires a valid transaction_type" do
      txn = Transaction.new(txn_hash.merge(transaction_type: nil))
      expect(txn.valid?).to eq(false)
      txn = Transaction.new(txn_hash.merge(transaction_type: 'blah'))
      expect(txn.valid?).to eq(false)
    end
    
    it "requires an numeric amount" do
      txn = Transaction.new(txn_hash.merge(amount: nil))
      expect(txn.valid?).to eq(false)
      txn = Transaction.new(txn_hash.merge(amount: 'string'))
      expect(txn.valid?).to eq(false)
      txn = Transaction.new(txn_hash.merge(amount: '1.0'))
      expect(txn.valid?).to eq(true)
    end

    it "sets the day, month, and year columns for period retrieval" do
      txn = Transaction.create(txn_hash.merge(date: '2020-10-10'))
      expect(txn.year).to eq(2020)
      expect(txn.month).to eq(10)
      expect(txn.day).to eq(10)
    end
    
  end
  
  context "wehn updating a transaction" do
    it "updates the month, day, and year when the date changes" do
      txn = Transaction.create(txn_hash)
      expect(txn.year).to eq(Date.new.year)
      expect(txn.month).to eq(Date.new.month)
      expect(txn.day).to eq(Date.new.day)
      txn.date = '2020-10-10'
      txn.save
      txn.reload
      expect(txn.year).to eq(2020)
      expect(txn.month).to eq(10)
      expect(txn.day).to eq(10)
    end
  end
  
  context "when retrieving the signed amount" do
    it "returns a negative debit" do
      transaction = Transaction.create(txn_hash.merge(transaction_type: 'debit', amount: 1))
      expect(transaction.signed_amount).to be < 0
    end
    
    it "returns a positive credit" do
      transaction = Transaction.create(txn_hash.merge(transaction_type: 'credit', amount: 1))
      expect(transaction.signed_amount).to be > 0
    end
  end

  context "when managing tags" do
    let(:transaction) { Transaction.create(date: Date.new, amount: 10, transaction_type: 'debit', transaction_set: ts, account: acct) }

    it "creates tags" do
      tags = ["tag1", "tag2", "tag3"]
      transaction.set_tags(tags)
      expect(transaction.tags.count).to eq(3)
      expect(transaction.tags.pluck(:name)).to eq(tags)
      expect(ts.tags.count).to eq(3)
    end
    
    it "updates tags" do
      tags = ["tag1", "tag2", "tag3"]
      transaction.set_tags(tags)
      tags2 = ["tag1", "tag5"]
      transaction.set_tags(tags2)
      expect(transaction.tags.count).to eq(2)
      expect(transaction.tags.pluck(:name)).to eq(tags2)
      expect(ts.tags.count).to eq(4)
      expect(ts.tags.pluck(:name)).to eq(tags |= tags2)
    end

    it "deletes tags" do
      tags = ["tag1", "tag2", "tag3"]
      transaction.set_tags(tags)
      tags2 = []
      transaction.set_tags(tags2)
      expect(transaction.tags.count).to eq(0)
      expect(transaction.tags.pluck(:name)).to eq(tags2)
      expect(ts.tags.count).to eq(3)
    end

    it "requires an array of tag names" do
      expect{ transaction.set_tags }.to raise_error(ArgumentError)
    end

  end
end
