class Shift < ApplicationRecord
  belongs_to :store_connect, class_name: "EmployeeStoreAssignment"
  belongs_to :employee_account
end