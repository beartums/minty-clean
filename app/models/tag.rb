class Tag < ApplicationRecord
  belongs_to :transaction_set, optional: true
  has_many :transaction_tag_memberships
  has_many :transactions, through: :transaction_tag_memberships, source: "transaxion"

  before_save { name.downcase! }
end
