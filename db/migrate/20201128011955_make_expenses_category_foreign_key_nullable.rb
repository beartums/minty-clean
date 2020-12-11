class MakeExpensesCategoryForeignKeyNullable < ActiveRecord::Migration[5.2]
  def change
    remove_foreign_key :expense_groups, :transaction_sets
    add_foreign_key :expense_groups, :transaction_sets, null: true
  end
end
