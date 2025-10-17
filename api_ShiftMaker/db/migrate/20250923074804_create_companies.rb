class CreateCompanies < ActiveRecord::Migration[7.0]
  def change
    create_table :companies do |t|
      t.string :name, null: false
      t.string :public_id, null: false
      t.string :status, default: "pending"
      t.decimal :contract_fee, precision: 10, scale: 2, default: 0.0
      t.datetime :contract_start_at
      t.datetime :contract_end_at
      t.string :logo_url

      t.timestamps
    end

    add_index :companies, :public_id, unique: true
  end
end