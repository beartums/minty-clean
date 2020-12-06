class Account < ApplicationRecord
  belongs_to :account_type
  belongs_to :transaction_set
  has_many :account_mappings
  has_many :transactions
  has_many :account_balances
end
