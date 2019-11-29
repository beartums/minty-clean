class AddIndicesToTransactions < ActiveRecord::Migration[5.2]
  def change
    add_index :transactions, :date
    add_index :transactions, [:date, :amount, :transaction_type]
  end
end
