class EmployeeAccount < ApplicationRecord
  has_secure_password
  validates :email, presence: true, uniqueness: true, unless: -> { line_uid.present? }
  validates :line_uid, uniqueness: true, allow_nil: true
end
