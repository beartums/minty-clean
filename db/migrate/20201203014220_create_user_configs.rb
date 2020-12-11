class CreateUserConfigs < ActiveRecord::Migration[5.2]
  def change
    create_table :user_configs do |t|
      t.references :user, foreign_key: true
      t.integer :default_transaction_id

      t.timestamps
    end
  end
end
