class AddTransactionSetRefToCategoryGroups < ActiveRecord::Migration[5.2]
  def change
    add_reference :category_groups, :transaction_set, foreign_key: true
  end
end
