class AccountMapping < ApplicationRecord
  belongs_to :account
  belongs_to :transaction_set
  
  def hits
    self.transaction_set.transactions.where(account_name: self.inbound_string)
  end

  def hit_count
    hits.count
  end

end
