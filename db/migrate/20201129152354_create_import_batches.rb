class CreateImportBatches < ActiveRecord::Migration[5.2]
  def change
    create_table :import_batches do |t|
      t.references :user, foreign_key: true
      t.references :transaction_set, foreign_key: true

      t.timestamps
    end
  end
end
