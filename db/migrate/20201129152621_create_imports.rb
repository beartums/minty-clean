class CreateImports < ActiveRecord::Migration[5.2]
  def change
    create_table :imports do |t|
      t.references :import_batch, foreign_key: true
      t.date :date
      t.string :description
      t.string :original_description
      t.float :amount
      t.string :transaction_type
      t.string :category
      t.string :account_name
      t.string :labels
      t.string :notes

      t.timestamps
    end
  end
end
