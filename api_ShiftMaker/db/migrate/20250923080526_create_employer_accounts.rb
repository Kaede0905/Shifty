class CreateEmployerAccounts < ActiveRecord::Migration[7.2]
  def change
    create_table :employer_accounts do |t|
      t.references :company, null: false, foreign_key: true
      t.string :name, null: false
      t.string :email, null: false
      t.string :password_digest, null: false
      t.string :role, default: "manager"
      t.string :status, default: "active"
      t.string :image_url

      t.timestamps
    end
    add_index :employer_accounts, :email, unique: true
  end
end