class AddTransactionSetRefToCategoryGroupMemberships < ActiveRecord::Migration[5.2]
  def change
    add_reference :category_group_memberships, :transaction_set, foreign_key: true
  end
end
