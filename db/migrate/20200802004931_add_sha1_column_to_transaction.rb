class AddSha1ColumnToTransaction < ActiveRecord::Migration[5.2]
  def change
    add_column :transactions, :sha1, :string, limit: 20
  end
end
