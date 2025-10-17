class RenameStoreIdInShifts < ActiveRecord::Migration[7.2]
  def change
    rename_column :shifts, :store_id, :store_connect_id
  end
end
