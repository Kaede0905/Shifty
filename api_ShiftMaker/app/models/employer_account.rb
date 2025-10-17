class EmployerAccount < ApplicationRecord
  belongs_to :company
  validates :email, presence: true, uniqueness: true
  has_secure_password
end
