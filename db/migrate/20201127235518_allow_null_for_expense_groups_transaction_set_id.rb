class AllowNullForExpenseGroupsTransactionSetId < ActiveRecord::Migration[5.2]
  def change
    change_column :expense_groups, :transaction_set_id, :integer, null: true
  end
end
