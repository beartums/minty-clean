require 'csv'

class TransactionSet < ApplicationRecord
  has_many :transactions, dependent: :destroy
  has_many :accounts, dependent: :destroy
  has_many :account_mappings, dependent: :destroy
  has_many :expense_groups, dependent: :destroy
  has_many :expense_mappings, dependent: :destroy
  has_many :tags, dependent: :destroy

  has_many  :user_settings, class_name: "UserTransactionSetMembership", dependent: :destroy
  has_many  :users, through: :user_settings

  validates :name, presence: true

  def active_transactions
    return self.transactions.where('date < ?', self.ignore_before) unless self.ignore_before.blank?
    return self.transactions
  end

  def transactions_count
    self.active_transactions.count
  end
  def accounts_count
    self.accounts.count
  end
  def first_transaction_at
    self.active_transactions.minimum(:date)
  end
  def last_transaction_at
    self.active_transactions.maximum(:date)
  end
  
  def unmapped_account_names(transactions = nil)
    transactions ||= self.active_transactions
    transactions.where(account_id: nil).distinct.pluck(:account_name).select {|an| !AccountMapping.exists?(inbound_string:an)}
  end

  def new_accounts_and_mappings(mappings = [], default_account_type = nil)
    default_account_type ||= AccountType.first
    mappings.map do |mapping|
      a = self.accounts.create(name: mapping, account_type_id: default_account_type.id)
      a.account_mappings << self.account_mappings.create(inbound_string: mapping)
      [mapping, a.id]
    end
  end

  def map_transaction_accounts(remap = false)
    transactions = remap ? self.active_transactions : self.active_transactions.where(account_id: nil)
    self.account_mappings.all.each do |mapping|
      mapping.account.transactions << transactions.where(account_name: mapping.inbound_string)
    end
  end

  def import_csv(file, overwrite = false, auto_accounts = false)
    
    overwrite = [true, 'true'].include?(overwrite)
    auto_accounts = [true, 'true'].include?(auto_accounts)
    rows = CSV.read(file, headers:true)
    rows = rows.select {|row| Time.strptime(row["Date"],'%m/%d/%Y') >= self.ignore_before} unless self.ignore_before.blank?
    rows = overwrite ? rows.take(rows.length) : getNewTransactions(rows)
    

    mappings = incoming_account_mappings(rows)
    unmapped_accts = unmapped_accounts(mappings)
    unless (auto_accounts || unmapped_accts.blank?)
      raise StandardError.new('Unmapped acounts with auto_accounts = false')
    end
    unless unmapped_accts.blank?
      new_mappings = new_accounts_and_mappings(unmapped_accts).to_h
      mappings = mappings.merge(new_mappings)
    end

    db_columns = %i(description original_description transaction_type account_name
                    amount category labels notes transaction_set_id account_id date year month day)
    csv_columns = ["Description", "Original Description", "Transaction Type", "Account Name",
                    "Amount", "Category", "Labels", "Notes"]

    
    values = rows.reverse.map do |row, idx|
      date = Time.strptime(row["Date"],'%m/%d/%Y')
      additional_vals = [ self.id, mappings[row["Account Name"]], date, date.year, date.month, date.day]
      csv_columns.map { |col| row[col] } + additional_vals 
    end



    TransactionSet.transaction do
      if overwrite == 'true'
        memberships = TransactionTagMembership.joins(:transaxion).where(transactions: { transaction_set_id: self.id })
        memberships.delete_in_batches
        self.transactions.delete_in_batches
      end
      Transaction.import db_columns, values, validate: false
    end
  end

  def getNewTransactions(rows)
    # ONLY works if rows file has ALL the transactions in it
    transactions = self.transactions.all
    if transactions.length > rows.length
      throw "Bad Transaction file!  Not enough rows"
    end
    rows.take(rows.length-transactions.length)
  end

  def incoming_account_mappings(rows = nil)
    row ||= @rows
    account_names = rows.uniq { |row| row["Account Name"] }.pluck("Account Name")
    mappings = account_names.map do |name|
      mapping = self.account_mappings.find_by(inbound_string: name)
      [ name, mapping.try(:account_id) ]
    end
    mappings.to_h
  end

  def unmapped_accounts(mappings)
    unmapped = mappings.select { |_k, v| v.blank? }
    unmapped.map { |k, _v| k }
  end

end
