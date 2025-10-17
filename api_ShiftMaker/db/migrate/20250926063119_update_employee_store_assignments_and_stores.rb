class UpdateEmployeeStoreAssignmentsAndStores < ActiveRecord::Migration[7.2]
  def change
    # employee_store_assignments.store_id の null 制約を外す
    change_column_null :employee_store_assignments, :store_id, true

    # stores.company_id の null 制約を外す
    change_column_null :stores, :company_id, true

    # stores に store_type を追加
    add_column :stores, :store_type, :string, default: "with_id", null: false
    add_index :stores, :store_type
  end
end
