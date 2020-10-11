class DropConfiguration < ActiveRecord::Migration[5.2]
  def up
    drop_table :configurations
  end
  def down
    raise ActiveRecord::IrreversibleMigration
  end
end
