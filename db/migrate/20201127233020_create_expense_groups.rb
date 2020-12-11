class CreateExpenseGroups < ActiveRecord::Migration[5.2]
  def change
    create_table :expense_groups do |t|
      t.string :name
      t.references :transaction_set, foreign_key: true

      t.timestamps
    end
  end
end
