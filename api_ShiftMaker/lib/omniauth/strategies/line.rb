# option :authorize_params, %i[scope]

# def authorize_params
#   super.tap do |params|
#     extra = request.params.slice("mode") # POSTのhidden fieldを拾う
#     params[:state] = extra.to_json if extra.present?
#   end
# end
# lib/omniauth/strategies/line.rb
# lib/omniauth/strategies/line.rb

# OmniAuth モジュールの宣言（念のため）
module OmniAuth; end

module OmniAuth
  module Strategies
    class Line < OmniAuth::Strategies::OAuth2
      # OAuth2 authorize_params の設定
      option :authorize_params, %i[scope]

      # authorize_params を拡張
      def authorize_params
        super.tap do |params|
          # POST の hidden field から "mode" を取得
          extra = request.params.slice("mode")
          params[:state] = extra.to_json if extra.present?
        end
      end
    end
  end
end

