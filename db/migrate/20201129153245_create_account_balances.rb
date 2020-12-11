class CreateAccountBalances < ActiveRecord::Migration[5.2]
  def change
    create_table :account_balances do |t|
      t.references :account, foreign_key: true
      t.date :balance_date
      t.decimal :balance, :precision => 11, :scale => 3

      t.timestamps
    end
  end
end
