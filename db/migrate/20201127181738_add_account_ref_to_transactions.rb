class AddAccountRefToTransactions < ActiveRecord::Migration[5.2]
  def change
    add_reference :transactions, :account, foreign_key: true, null: true
  end
end
