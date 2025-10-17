class CreateEmployeeStoreAssignments < ActiveRecord::Migration[7.2]
  def change
    create_table :employee_store_assignments do |t|
      t.references :employee_account, null: false, foreign_key: true
      t.references :store, null: false, foreign_key: true

      t.timestamps
    end

    add_index :employee_store_assignments, [:employee_account_id, :store_id], unique: true, name: "index_employee_store_on_employee_and_store"
  end
end