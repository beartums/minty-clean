class CreateAccountMappings < ActiveRecord::Migration[5.2]
  def change
    create_table :account_mappings do |t|
      t.string :inbound_string
      t.references :account, foreign_key: true
      t.references :transaction_set, foreign_key: true

      t.timestamps
    end
  end
end
