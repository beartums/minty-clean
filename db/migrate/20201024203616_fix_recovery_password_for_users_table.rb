class FixRecoveryPasswordForUsersTable < ActiveRecord::Migration[5.2]
  def change
    rename_column :users, :recovery_password, :reset_password_digest
    add_column :users, :reset_password_created_at, :datetime
    add_column :users, :email_confirmation_created_at, :datetime
    add_column :users, :email_confirmed_at, :datetime
  end
end
