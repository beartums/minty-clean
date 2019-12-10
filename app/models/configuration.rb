class Configuration < ApplicationRecord

  has_many :category_group, dependent: :destroy
  validates :name, uniqueness: true, presence: true
end
