class SessionsController < ApplicationController
  def create
    p 'デバッグ'
    p frontend_url
    auth = request.env['omniauth.auth']
    mode = request.env['omniauth.params']['mode']
    if mode == 'register'
      user_exist = EmployeeAccount.where(line_uid: auth.uid).first
      if user_exist
        error_message = "アカウントが存在します"
        redirect_to "#{frontend_url}/signin?#{URI.encode_www_form(info: error_message)}" 
      else
        user = EmployeeAccount.new(
          line_uid: auth.uid,
          name: auth.info.name,
          image_url: auth.info.image,
          password_digest: SecureRandom.hex(16)
        )
        if user.save
          session[:id] = user.id
          session[:userType] = "employee"
          success_message = "新規登録しました"
          redirect_to "#{frontend_url}/home/employee?#{URI.encode_www_form(info: success_message)}"
        else
          error_message = "不明なエラーです"
          redirect_to "#{frontend_url}/signin?#{URI.encode_www_form(info: error_message)}"
        end
      end
    end

    if mode == "login"
      user = EmployeeAccount.where(line_uid: auth.uid).first
      if user
        session[:id] = user.id
        session[:userType] = "employee"
        success_message = "ログインしました"
        redirect_to "#{frontend_url}/home/employee?#{URI.encode_www_form(info: success_message)}"
      else
        error_message = "アカウントが見つかりません"
        redirect_to "#{frontend_url}/login?#{URI.encode_www_form(info: error_message)}"
      end
    end
  end

  def failure
    render json: { error: "LINE login failed" }, status: :unauthorized
  end

  private
  def frontend_url
    ENV['FRONTEND_URL']
  end

end
