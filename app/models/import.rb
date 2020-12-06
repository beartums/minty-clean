class Import < ApplicationRecord
  belongs_to :import_batch
  belongs_to :user
end
