class CategoryGroup < ApplicationRecord

  has_many :category_group_membership, dependent: :destroy
  belongs_to :configuration, optional: true

  validates :name, uniqueness: true, presence: true
  
end
