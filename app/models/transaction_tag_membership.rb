class TransactionTagMembership < ApplicationRecord
  belongs_to :transaxion, class_name: "Transaction", foreign_key: "transaction_id"
  belongs_to :tag
end
