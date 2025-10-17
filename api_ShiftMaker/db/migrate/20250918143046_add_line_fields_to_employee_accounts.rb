class AddLineFieldsToEmployeeAccounts < ActiveRecord::Migration[7.2]
  def change
    add_column :employee_accounts, :line_uid, :string
    add_column :employee_accounts, :image_url, :string
  end
end
