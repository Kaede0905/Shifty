class RemoveAgeAndGenderFromEmployeeAccounts < ActiveRecord::Migration[7.2]
  def change
    remove_column :employee_accounts, :age, :integer
    remove_column :employee_accounts, :gender, :string
  end
end
