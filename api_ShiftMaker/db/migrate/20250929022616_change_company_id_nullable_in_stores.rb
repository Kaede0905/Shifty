class ChangeCompanyIdNullableInStores < ActiveRecord::Migration[7.2]
  def change
    change_column_null :stores, :company_id, true
  end
end
