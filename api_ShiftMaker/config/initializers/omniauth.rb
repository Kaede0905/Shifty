# config/initializers/omniauth.rb

# 開発環境で GET /auth/line を許可
# if Rails.env.development?
#   OmniAuth.config.allowed_request_methods = [:get, :post]
# end
OmniAuth.config.allowed_request_methods = [:get, :post]
OmniAuth.config.request_validation_phase = nil


# LINEログイン設定
Rails.application.config.middleware.use OmniAuth::Builder do
  provider :line, ENV['LINE_CHANNEL_ID'], ENV['LINE_CHANNEL_SECRET'], 
           { scope: 'profile openid email' }
end