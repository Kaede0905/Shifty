# app/controllers/api/v1/base_controller.rb
module Api
  module V1
    class BaseController < ActionController::API
      include ActionController::Cookies  # sessionを使う

      # CSRFはスキップ（APIでは通常不要）
      skip_forgery_protection
    end
  end
end