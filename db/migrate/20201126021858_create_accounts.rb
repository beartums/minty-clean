class CreateAccounts < ActiveRecord::Migration[5.2]
  def change
    create_table :accounts do |t|
      t.string :name
      t.references :account_type, foreign_key: true
      t.string :description

      t.timestamps
    end
  end
end
