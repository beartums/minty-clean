class CreateCategoryGroupMemberships < ActiveRecord::Migration[5.2]
  def change
    create_table :category_group_memberships do |t|
      t.string :category
      t.integer :category_group_id
      t.integer :profile_id

      t.timestamps
    end
    add_index :category_group_memberships, [:category]
    add_index :category_group_memberships, [:category_group_id]
  end
end
