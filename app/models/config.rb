class Configuration < ApplicationRecord
    validates :name, uniqueness: true, presence: true
end