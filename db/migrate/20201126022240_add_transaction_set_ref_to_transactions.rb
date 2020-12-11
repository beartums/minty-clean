class AddTransactionSetRefToTransactions < ActiveRecord::Migration[5.2]
  def change
    add_reference :transactions, :transaction_set, foreign_key: true
  end
end
