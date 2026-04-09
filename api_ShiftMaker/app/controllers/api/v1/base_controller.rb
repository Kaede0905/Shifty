module Api
  module V1
    class BaseController < ActionController::API
      include ActionController::Cookies

      # セッション使うAPI向けに null_session を設定
      before_action :verify_authenticity_token, raise: false
    end
  end
end