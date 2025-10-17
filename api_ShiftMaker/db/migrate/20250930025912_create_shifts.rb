class CreateShifts < ActiveRecord::Migration[7.2]
  def change
    create_table :shifts do |t|
      t.references :employee_account, null: false, foreign_key: true
      t.references :store, null: false, foreign_key: true
      t.date :work_date
      t.time :start_time
      t.time :end_time
      t.string :status, null: false, default: "draft"
      t.text :note

      t.timestamps
    end
  end
end
