class FixShiftForeignKeys < ActiveRecord::Migration[7.2]
  def up
    remove_foreign_key :shifts, :stores, if_exists: true
    add_foreign_key :shifts, :employee_store_assignments, column: :store_connect_id
  end

  def down
    remove_foreign_key :shifts, column: :store_connect_id
  end
end