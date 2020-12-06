class AddStartDayToTransactionSet < ActiveRecord::Migration[5.2]
  def change
    add_column :transaction_sets, :period_start_day, :integer
  end
end
