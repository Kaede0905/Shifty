# option :authorize_params, %i[scope]

# def authorize_params
#   super.tap do |params|
#     extra = request.params.slice("mode") # POSTのhidden fieldを拾う
#     params[:state] = extra.to_json if extra.present?
#   end
# end
# lib/omniauth/strategies/line.rb
# lib/omniauth/strategies/line.rb
module Omniauth
  module Strategies
    class Line < OmniAuth::Strategies::OAuth2
      option :authorize_params, %i[scope]

      def authorize_params
        super.tap do |params|
          extra = request.params.slice("mode")
          params[:state] = extra.to_json if extra.present?
        end
      end
    end
  end
end