class ImportBatch < ApplicationRecord
  belongs_to :user
  belongs_to :transaction_set
  has_many :imports
end
