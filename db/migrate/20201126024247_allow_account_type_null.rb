class AllowAccountTypeNull < ActiveRecord::Migration[5.2]
  def change
    change_column :accounts, :account_type_id, :integer, null: true
  end
end
