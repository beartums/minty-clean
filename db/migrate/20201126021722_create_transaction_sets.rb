class CreateTransactionSets < ActiveRecord::Migration[5.2]
  def change
    create_table :transaction_sets do |t|
      t.string :name
      t.string :description

      t.timestamps
    end
  end
end
