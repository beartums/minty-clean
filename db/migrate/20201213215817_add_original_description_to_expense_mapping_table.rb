class AddOriginalDescriptionToExpenseMappingTable < ActiveRecord::Migration[5.2]
  def change
    add_column :expense_mappings, :original_description, :string
    add_column :expense_mappings, :application_order, :integer
  end
end
