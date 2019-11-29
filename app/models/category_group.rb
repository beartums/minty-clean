class CategoryGroup < ApplicationRecord

  has_many :category_group_membership, dependent: :destroy

  validates :name, uniqueness: true, presence: true
  
end
