class DropImport < ActiveRecord::Migration[5.2]
  def change
    drop_table :imports
    drop_table :import_batches
  end
end
