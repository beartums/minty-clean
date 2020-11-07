class UpdateUsersForEmailVerification < ActiveRecord::Migration[5.2]
  def change
    add_column :users, :email_verification_digest, :text
    rename_column :users, :email_confirmation_created_at, :email_confirmation_requested_at
  end
end
