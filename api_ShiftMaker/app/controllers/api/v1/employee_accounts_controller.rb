module Api
  module V1
    class EmployeeAccountsController < ApplicationController

      def create
        user = EmployeeAccount.new(
          account_params.merge(
            image_url: "https://ui-avatars.com/api/?name=#{account_params[:name]}&background=random"
          )
        )
        if user.save
          session[:id] = user.id
          session[:userType] = "employee"
          render json: { message: "登録成功", user: user }, status: :created
        else
          render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def auth
        if account_params[:type] == "employee"
          user = EmployeeAccount.find_by(email: account_params[:email])
          if user
            if user.authenticate(account_params[:password])
              session[:id] = user.id
              session[:userType] = "employee"
              render json: { message: "ログイン成功", userType: session[:userType] }, status: :ok
            else
              render json: { errors: "パスワードが一致しません" }, status: :unprocessable_entity
            end
          else
            render json: { errors: "アカウントが存在しません" }, status: :unprocessable_entity
          end
        else
          user =EmployerAccount.find_by(email: account_params[:email])
          if user
            if user.authenticate(account_params[:password])
              company = Company.find_by(id: user.company_id)
              if company.public_id == account_params[:public_id]
                session[:id] = user.id
                session[:userType] = "employer"
                render json: { message: "ログイン成功", userType: session[:userType]}, status: :ok
              else
                render json: { errors: "会社公開idが間違っています" }, status: :unprocessable_entity
              end
            else
              render json: { errors: "パスワードが一致しません" }, status: :unprocessable_entity
            end
          else
            render json: { errors: "アカウントが存在しません" }, status: :unprocessable_entity
          end
        end
      end

      def authenticated
        user = EmployeeAccount.find_by(id: session[:id])
        if session[:userType] == "employee" && user
          render json: { authenticated: true, user: user }
        else
          render json: { authenticated: false }, status: :unauthorized
        end
      end

      def store_info
        stores_to_user = EmployeeStoreAssignment.where(employee_account_id: session[:id])
        stores=[]
        stores_to_user.each do |store_to_user|
          store = Store.find_by(id: store_to_user.store_id)
          stores << store
        end
        render json: { pullStoreInfo: true, stores: stores }
      end

      def employer_detail_edit
        employeeData = params["employee"]
        employee_store_assignment = EmployeeStoreAssignment.find_by(id:employeeData[:assign_id])
        if employee_store_assignment.nil?
          render json: { errors: "アカウントが見つかりません" }, status: :not_found
          return
        end
        if employee_store_assignment.update(
          salary: employeeData[:salary],
          night_salary: employeeData[:night_salary],
          role: employeeData[:role]
        )
          render json: { message: "アカウントを更新しました" }, status: :ok
        else
          render json: { errors: employee_store_assignment.errors.full_messages }, status: :unprocessable_entity
        end
      end

      private
      def account_params
        params.require(:employee_account).permit(:name, :age, :gender, :email, :password, :type, :public_id)
      end
      
    end
  end
end


