class ExpenseGroup < ApplicationRecord
  belongs_to :transaction_set, optional: true
  has_many :expense_categories
end
