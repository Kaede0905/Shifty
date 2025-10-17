class AddNightSalaryAndRoleToEmployeeStoreAssignments < ActiveRecord::Migration[7.2]
  def change
    add_column :employee_store_assignments, :night_salary, :integer
    add_column :employee_store_assignments, :role, :string
  end
end
