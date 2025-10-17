class FixShiftForeignKey < ActiveRecord::Migration[7.2]
  def change
    remove_foreign_key :shifts, column: :store_connect_id rescue nil
    add_foreign_key :shifts, :employee_store_assignments, column: :store_connect_id
  end
end
