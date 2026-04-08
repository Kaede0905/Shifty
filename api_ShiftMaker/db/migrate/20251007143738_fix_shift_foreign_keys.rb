class FixShiftForeignKeys < ActiveRecord::Migration[7.2]
  def change
    # 既存の外部キーがあれば削除
    remove_foreign_key :shifts, :stores, if_exists: true

    # 新しい外部キーを追加
    add_foreign_key :shifts, :employee_store_assignments, column: :store_connect_id
  end
end