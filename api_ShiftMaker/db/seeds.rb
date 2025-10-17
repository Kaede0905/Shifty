# This file should ensure the existence of records required to run the application in every environment (production,
# development, test). The code here should be idempotent so that it can be executed at any point in every environment.
# The data can then be loaded with the bin/rails db:seed command (or created alongside the database with db:setup).
#
# Example:
#
#   ["Action", "Comedy", "Drama", "Horror"].each do |genre_name|
#     MovieGenre.find_or_create_by!(name: genre_name)
#   end

company = Company.create!(
  name: "テスト会社",
  # public_id: SecureRandom.hex(8),
  public_id: 0,
  status: "active",
  contract_fee: 10000,
  contract_start_at: Time.now,
  contract_end_at: Time.now + 1.year,
  logo_url: "https://placehold.co/100x100?text=Logo"
)

# Store 作成
store = Store.create!(
  company: company,
  name: "テスト店舗",
  # invite_code: SecureRandom.hex(4),
  invite_code: 29,
  address: "東京都渋谷区1-2-3",
  phone_number: "03-1234-5678",
  status: "active",
  logo_url: "https://placehold.co/80x80?text=Store"
)

employee_store_assignment = EmployeeStoreAssignment.create!(
  employee_account_id: 31,
  store_id: 2,
  created_at: Time.now,
  updated_at: Time.now,
)
