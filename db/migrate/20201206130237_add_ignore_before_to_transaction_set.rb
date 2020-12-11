class AddIgnoreBeforeToTransactionSet < ActiveRecord::Migration[5.2]
  def change
    add_column :transaction_sets, :ignore_before, :date
  end
end
