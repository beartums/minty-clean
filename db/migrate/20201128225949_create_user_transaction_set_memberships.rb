class CreateUserTransactionSetMemberships < ActiveRecord::Migration[5.2]
  def change
    create_table :user_transaction_set_memberships do |t|
      t.references :transaction_set, foreign_key: true
      t.references :user, foreign_key: true
      t.boolean :is_owner

      t.timestamps
    end
  end
end
