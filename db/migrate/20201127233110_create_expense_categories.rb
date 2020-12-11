class CreateExpenseCategories < ActiveRecord::Migration[5.2]
  def change
    create_table :expense_categories do |t|
      t.string :name
      t.references :expense_group, foreign_key: true

      t.timestamps
    end
  end
end
