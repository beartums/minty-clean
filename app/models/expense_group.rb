class ExpenseGroup < ApplicationRecord
  belongs_to :transaction_set, optional: true
  has_many :expense_categories

  def category_count
    self.expense_categories.count
  end

  def transaction_count
    self.transaction_set.transactions.where(expense_category_id: self.expense_categories).count
  end
end
