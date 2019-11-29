class CategoryGroupMembership < ApplicationRecord

  belongs_to :category_group

  validates :category, presence: true, uniqueness: true
  validates :category_group_id, presence: true

end
