class CreateConfig < ActiveRecord::Migration[5.2]
  def change
    create_table :configs do |t|
      t.string :name
      t.date :start_date
      t.string :period_unit
      t.integer :period_length
    end
  end
end
