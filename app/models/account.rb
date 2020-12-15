class Account < ApplicationRecord
  belongs_to :account_type, optional: true
  belongs_to :transaction_set
  has_many :account_mappings, dependent: :destroy
  has_many :transactions, dependent: :nullify
  has_many :account_balances, dependent: :destroy
end
