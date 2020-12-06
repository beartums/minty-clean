class UserTransactionSetMembership < ApplicationRecord
  belongs_to :user
  belongs_to :transaction_set
end
