class EmployeeStoreAssignment < ApplicationRecord
  belongs_to :employee_account
  belongs_to :store
end
