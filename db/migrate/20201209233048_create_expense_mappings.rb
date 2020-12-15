class CreateExpenseMappings < ActiveRecord::Migration[5.2]
  def change
    create_table :expense_mappings do |t|
      t.string :description
      t.string :account
      t.string :category
      t.references :expense_category, foreign_key: true
      t.references :transaction_set, foreign_key: true
      t.string :new_description

      t.timestamps
    end
  end
end
