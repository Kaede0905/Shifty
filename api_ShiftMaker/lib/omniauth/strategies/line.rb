# option :authorize_params, %i[scope]

# def authorize_params
#   super.tap do |params|
#     extra = request.params.slice("mode") # POSTのhidden fieldを拾う
#     params[:state] = extra.to_json if extra.present?
#   end
# end
# lib/omniauth/strategies/line.rb
module OmniAuth
  module Strategies
    class Line < OmniAuth::Strategies::OAuth2
      # option はクラス内で宣言
      option :authorize_params, %i[scope]

      # authorize_params メソッドも同じクラス内で
      def authorize_params
        super.tap do |params|
          extra = request.params.slice("mode") # POSTのhidden fieldを拾う
          params[:state] = extra.to_json if extra.present?
        end
      end
    end
  end
end
