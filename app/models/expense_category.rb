class ExpenseCategory < ApplicationRecord
  belongs_to :expense_group
  has_many :transactions
end
