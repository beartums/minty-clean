class ChangeColumnNameInUserConfigs < ActiveRecord::Migration[5.2]
  def change
    rename_column :user_configs, :default_transaction_id, :default_transaction_set_id
  end
end
