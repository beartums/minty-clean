class EnlargeSha1ColumnInTransactions < ActiveRecord::Migration[5.2]
  def change
    change_column :transactions, :sha1, :string, limit: 40
  end
end
