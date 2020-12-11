class AccountMapping < ApplicationRecord
  belongs_to :account
  belongs_to :transaction_set
end
