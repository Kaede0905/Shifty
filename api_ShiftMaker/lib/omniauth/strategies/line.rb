# option :authorize_params, %i[scope]

# def authorize_params
#   super.tap do |params|
#     extra = request.params.slice("mode") # POSTのhidden fieldを拾う
#     params[:state] = extra.to_json if extra.present?
#   end
# end
# lib/omniauth/strategies/line.rb
require "omniauth/strategies/oauth2"

module OmniAuth
  module Strategies
    class Line < OmniAuth::Strategies::OAuth2
      # ここで option を設定
      option :name, "line"
      option :authorize_params, %i[scope]

      # authorize_params のオーバーライド
      def authorize_params
        super.tap do |params|
          extra = request.params.slice("mode") # POSTのhidden fieldを拾う
          params[:state] = extra.to_json if extra.present?
        end
      end
    end
  end
end