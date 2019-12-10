class AddConfigurationIdToCategoryGroupMemberships < ActiveRecord::Migration[5.2]
  def change
    add_column :category_group_memberships, :configuration_id, :integer
  end
end
