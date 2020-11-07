class FixEmailConfirmationColumnsForUsers < ActiveRecord::Migration[5.2]
  def change
    rename_column :users, :email_verification_digest, :email_confirmation_digest
  end
end
