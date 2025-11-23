# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# This file is the source Rails uses to define your schema when running `bin/rails
# db:schema:load`. When creating a new database, `bin/rails db:schema:load` tends to
# be faster and is potentially less error prone than running all of your
# migrations from scratch. Old migrations may fail to apply correctly if those
# migrations use external dependencies or application code.
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema[7.2].define(version: 2025_10_24_202848) do
  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "companies", force: :cascade do |t|
    t.string "name", null: false
    t.string "public_id", null: false
    t.string "status", default: "pending"
    t.decimal "contract_fee", precision: 10, scale: 2, default: "0.0"
    t.datetime "contract_start_at"
    t.datetime "contract_end_at"
    t.string "logo_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["public_id"], name: "index_companies_on_public_id", unique: true
  end

  create_table "employee_accounts", force: :cascade do |t|
    t.string "name"
    t.string "email"
    t.string "password_digest"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "line_uid"
    t.string "image_url"
  end

  create_table "employee_store_assignments", force: :cascade do |t|
    t.bigint "employee_account_id", null: false
    t.bigint "store_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "store_name"
    t.integer "salary"
    t.string "logo_url"
    t.integer "night_salary"
    t.string "role"
    t.index ["employee_account_id", "store_id"], name: "index_employee_store_on_employee_and_store", unique: true
    t.index ["employee_account_id"], name: "index_employee_store_assignments_on_employee_account_id"
    t.index ["store_id"], name: "index_employee_store_assignments_on_store_id"
  end

  create_table "employer_accounts", force: :cascade do |t|
    t.bigint "company_id", null: false
    t.string "name", null: false
    t.string "email", null: false
    t.string "password_digest", null: false
    t.string "role", default: "manager"
    t.string "status", default: "active"
    t.string "image_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["company_id"], name: "index_employer_accounts_on_company_id"
    t.index ["email"], name: "index_employer_accounts_on_email", unique: true
  end

  create_table "shifts", force: :cascade do |t|
    t.bigint "employee_account_id", null: false
    t.bigint "store_connect_id", null: false
    t.date "work_date"
    t.time "start_time"
    t.time "end_time"
    t.string "status", default: "draft", null: false
    t.text "note"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["employee_account_id"], name: "index_shifts_on_employee_account_id"
    t.index ["store_connect_id"], name: "index_shifts_on_store_connect_id"
  end

  create_table "stores", force: :cascade do |t|
    t.bigint "company_id"
    t.string "name", null: false
    t.string "invite_code", null: false
    t.string "address"
    t.string "phone_number"
    t.string "status", default: "active"
    t.string "logo_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "store_type", default: "with_id", null: false
    t.index ["company_id"], name: "index_stores_on_company_id"
    t.index ["invite_code"], name: "index_stores_on_invite_code", unique: true
    t.index ["store_type"], name: "index_stores_on_store_type"
  end

  add_foreign_key "employee_store_assignments", "employee_accounts"
  add_foreign_key "employee_store_assignments", "stores"
  add_foreign_key "employer_accounts", "companies"
  add_foreign_key "shifts", "employee_accounts"
  add_foreign_key "shifts", "employee_store_assignments", column: "store_connect_id"
  add_foreign_key "stores", "companies"
end
