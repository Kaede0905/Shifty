class FixShiftForeignKeys < ActiveRecord::Migration[7.2]
  def change
    # stores外部キーがあれば削除
    remove_foreign_key :shifts, :stores, if_exists: true

    # employee_store_assignments外部キーがなければ追加
    add_foreign_key :shifts, :employee_store_assignments, column: :store_connect_id, if_not_exists: true
  end
end