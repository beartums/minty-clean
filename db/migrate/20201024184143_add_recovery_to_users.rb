class AddRecoveryToUsers < ActiveRecord::Migration[5.2]
  def up
    add_column :users, :recovery_password, :string
  end
  def down
    remove_column :users, :recovery_password
  end
end
