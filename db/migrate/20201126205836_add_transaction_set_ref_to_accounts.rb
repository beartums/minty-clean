class AddTransactionSetRefToAccounts < ActiveRecord::Migration[5.2]
  def change
    add_reference :accounts, :transaction_set, foreign_key: true
  end
end
