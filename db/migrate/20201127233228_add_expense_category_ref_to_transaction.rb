class AddExpenseCategoryRefToTransaction < ActiveRecord::Migration[5.2]
  def change
    add_reference :transactions, :expense_category, foreign_key: true, null: true
  end
end
