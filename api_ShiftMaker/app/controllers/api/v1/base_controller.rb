module Api
  module V1
    class BaseController < ActionController::API
      # API用なのでCSRFを無効化
      protect_from_forgery with: :null_session
    end
  end
end