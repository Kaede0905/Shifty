require "test_helper"

class Api::V1::StoresControllerTest < ActionDispatch::IntegrationTest
  test "should get employee_create" do
    get api_v1_stores_employee_create_url
    assert_response :success
  end
end
