class AddColumnsToEmployeeStoreAssignments < ActiveRecord::Migration[7.2]
  def change
    add_column :employee_store_assignments, :store_name, :string
    add_column :employee_store_assignments, :salary, :integer
    add_column :employee_store_assignments, :logo_url, :string
  end
end
