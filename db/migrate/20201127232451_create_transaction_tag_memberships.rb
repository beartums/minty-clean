class CreateTransactionTagMemberships < ActiveRecord::Migration[5.2]
  def change
    create_table :transaction_tag_memberships do |t|
      t.references :transaction, foreign_key: true
      t.references :tag, foreign_key: true

      t.timestamps
    end
  end
end
