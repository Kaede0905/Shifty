class CreateEmployeeAccounts < ActiveRecord::Migration[7.2]
  def change
    create_table :employee_accounts do |t|
      t.string :name
      t.integer :age
      t.string :gender
      t.string :email
      t.string :password_digest

      t.timestamps
    end
  end
end
