class AddConfigurationIdToCategoryGroups < ActiveRecord::Migration[5.2]
  def change
    add_column :category_groups, :configuration_id, :integer
  end
end
