module Api
  module V1
    class Api::V1::EmployerAccountsController < ApplicationController

      def create
        company = Company.find_by(public_id: employer_params[:company_public_id])
        if company
          user = EmployerAccount.new(
            company_id: company.id,
            name: employer_params[:name],
            email: employer_params[:email],
            password: employer_params[:password],
            role: employer_params[:role],
          )
          if user.save
            session[:id] = user.id
            session[:userType] = "employer"
            render json: { message: ["アカウント作成成功"]}, status: :ok
          else
            render json: { errors: user.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { errors: "public_id was not found" }, status: :unprocessable_entity
        end
      end

      private
      def employer_params
        params.require(:employer_account).permit(:name, :email, :password, :role, :company_public_id)
      end
    end
  end
end
