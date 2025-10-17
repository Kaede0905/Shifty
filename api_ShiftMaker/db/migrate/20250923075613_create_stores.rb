class CreateStores < ActiveRecord::Migration[7.2]
  def change
    create_table :stores do |t|
      t.references :company, null: false, foreign_key: true
      t.string :name, null: false
      t.string :invite_code, null: false, unique: true
      t.string :address
      t.string :phone_number
      t.string :status, default: "active"
      t.string :logo_url

      t.timestamps
    end
    add_index :stores, :invite_code, unique: true
  end
end
