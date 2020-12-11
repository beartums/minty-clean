class AddDatePartColumnsToTransactions < ActiveRecord::Migration[5.2]
  def change
    add_column :transactions, :day, :integer
    add_column :transactions, :month, :integer
    add_column :transactions, :year, :integer
  end
end
