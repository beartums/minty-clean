class TransactionSet < ApplicationRecord
  has_many :transactions
  has_many :accounts
  has_many :account_mappings
  has_many :tags
  has_many :import_batches

  has_many  :user_transaction_set_memberships
  has_many  :users, through: :user_transaction_set_memberships

  def assign_transaction_accounts(transactions)
    
  end
  
  def unmapped_account_names(transactions = nil)
    transactions ||= self.transactions
    transactions.where(account_id: nil).distinct.pluck(:account_name).select {|an| !AccountMapping.exists?(inbound_string:an)}
  end

  def new_accounts_and_mappings(mappings = [], default_account_type = nil)
    default_account_type ||= AccountType.first
    mappings.map do |mapping|
      a = Account.new(name: mapping, account_type_id: default_account_type.id, transaction_set_id: self.id)
      a.account_mappings << AccountMapping.new(inbound_string: mapping, transaction_set_id: self.id)
      a
    end
  end

  def map_transaction_accounts(remap = false)
    transactions = remap ? self.transactions : self.transactions.where(account_id: nil)
    self.account_mappings.all.each do |mapping|
      mapping.account.transactions << transactions.where(account_name: mapping.inbound_string)
    end
  end

  def import_csv(file, overwrite = false, auto_accounts = false)
    puts overwrite
    
    rows = CSV.read(file, headers:true)
    rows = overwrite == 'true' ? rows.take(rows.length) : getNewTransactions(rows)
    
    mappings = incoming_account_mappings(rows)
    unmapped_accts = unmapped_accounts(mappings)
    unless (auto_accounts == 'true' || unmapped_accts.blank?)
      raise StandardError.new('Unmapped acounts with auto_accounts = false')
    end
    new_accounts_and_mappings(unmapped_accts) unless unmapped_accts.blank?

    db_columns = %i(description original_description transaction_type account_name
                    amount category labels notes transaction_set_id account_id date year month day)
    csv_columns = ["Description", "Original Description", "Transaction Type", "Account Name",
                    "Amount", "Category", "Labels", "Notes"]
    
    values = rows.reverse.map.with_index do |row, idx|
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
