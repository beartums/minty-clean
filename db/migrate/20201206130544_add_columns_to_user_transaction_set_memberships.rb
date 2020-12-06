class AddColumnsToUserTransactionSetMemberships < ActiveRecord::Migration[5.2]
  def change
    add_column :user_transaction_set_memberships, :period_start_day, :integer
  end
end
