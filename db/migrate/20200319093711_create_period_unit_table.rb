class CreatePeriodUnitTable < ActiveRecord::Migration[5.2]
  def change
    create_table :period_unit_tables do |t|
      t.string :name
      t.integer :period_length
      t.string :unit_type
    end
  end
end
