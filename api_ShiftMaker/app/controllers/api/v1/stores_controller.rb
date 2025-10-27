module Api
  module V1
    class StoresController < ApplicationController
      def employee_create
        mode = employee_store_params[:mode]
        if mode == "withId"
          store = Store.find_by(invite_code: employee_store_params[:publicId])
          if store
            made_store = EmployeeStoreAssignment.find_by(store_id: store.id, employee_account_id: session[:id])
            if made_store
              render json: { 
                errors: ["すでに店舗を作成しています"], 
                error_type: "with_id" 
              }, status: :unprocessable_entity
            else
              employee_store_assignment = EmployeeStoreAssignment.new(
                employee_account_id: session[:id],
                store_id: store.id
              )
              if employee_store_assignment.save
                render json: { message: ["#{store.name}を作成しました"]}, status: :ok
              else
                render json: { 
                  errors: employee_store_assignment.errors.full_messages, 
                  error_type: "with_id" 
                }, status: :unprocessable_entity
              end
            end
          else
            render json: { 
              errors: ["店舗公開IDが存在しないか、間違っています"], 
              error_type: "with_id" 
            }, status: :unprocessable_entity
          end
        else
          store_name = employee_store_params[:name]
          store = Store.new(name: store_name, store_type: "without_id")
          if store.save
            employee_store_assignment = EmployeeStoreAssignment.new(
              employee_account_id: session[:id],
              store_id: store.id
            )
            if employee_store_assignment.save
              render json: { message: ["#{store.name}を作成しました"]}, status: :ok
            else
              render json: { 
                errors: employee_store_assignment.errors.full_messages, 
                error_type: "without_id" 
              }, status: :unprocessable_entity
            end
          else
            render json: { 
                errors: store.errors.full_messages, 
                error_type: "without_id" 
            }, status: :unprocessable_entity
          end
        end
      end

      def pull
        if session[:userType] == "employer"
          userId = session[:id]
          user = EmployerAccount.find_by(id: userId)
          company_id = user.company_id
          stores = Store.where(company_id: company_id)
        else
          render json: { errors: ["雇用者アカウントではありません"] }, status: :unprocessable_entity
          return
        end
        render json: { user: user, stores: stores }, status: :ok 
      end

      def employees
        storeId = params["storeId"]
        users = []
        user_ids = []
        user_assigns = EmployeeStoreAssignment.where(store_id: storeId)
        user_assigns.each do |user_assign|
          user_id = user_assign[:employee_account_id]
          user = EmployeeAccount.find_by(id: user_id)
          next unless user
          users << user.as_json.merge(assign_id:user_assign.id , salary: user_assign.salary, night_salary: user_assign.night_salary, role: user_assign.role)
        end
        render json: { users: users }, status: :ok
      end

      def create
        if session[:userType] == "employer"
          user_id = session[:id]
          user = EmployerAccount.find_by(id: user_id)

          unless user
            render json: { errors: ["ユーザーが見つかりません"] }, status: :not_found
            return
          end

          store = Store.new(
            company_id: user.company_id,
            name: params[:name],
            invite_code: SecureRandom.hex(4),
            address: params[:address].presence || "",
            phone_number: params[:phone_number].presence || "",
            status: "active",
            logo_url: "https://ui-avatars.com/api/?name=#{params[:name]}&background=random",
            store_type: "with_id"
          )

          if store.save
            render json: { message: "店舗を作成しました", store: store }, status: :created
          else
            render json: { errors: store.errors.full_messages }, status: :unprocessable_entity
          end

        else
          render json: { errors: ["雇用者アカウントではありません"] }, status: :unprocessable_entity
        end
      end

      # def delete
      #   assign_id = params["assign_id"].to_i
      #   user_assign = EmployeeStoreAssignment.find_by(id: assign_id)
      #   p user_assign
      #   store = Store.find_by(id:user_assign[:store_id])
      #   if store.nil?
      #      render json: { error: "Employee assignment not found" }, status: :not_found
      #   end
      #   user_assign.destroy!
      #   if store.store_type != "with_id"
      #     store.destroy!
      #   end
      #   render json: { message: "Deleted successfully" }, status: :ok
      # end
      def delete
        assign_id = params["assign_id"].to_i
        user_assign = EmployeeStoreAssignment.find_by(id: assign_id)

        if user_assign.nil?
          render json: { error: "Employee assignment not found" }, status: :not_found
          return
        end

        store = Store.find_by(id: user_assign.store_id)
        if store.nil?
          render json: { error: "Store not found" }, status: :not_found
          return
        end

        begin
          ActiveRecord::Base.transaction do
            # ✅ まず関連するシフトを削除
            Shift.where(
              store_connect_id: user_assign.id,
              employee_account_id: user_assign.employee_account_id
            ).destroy_all
            # ✅ 次にEmployeeStoreAssignmentを削除
            user_assign.destroy!

            # ✅ store_typeがwith_idでないなら店舗も削除
            store.destroy! if store.store_type != "with_id"
          end

          render json: { message: "Deleted successfully" }, status: :ok
        rescue => e
          Rails.logger.error("🔥 Store delete failed: #{e.class} - #{e.message}")
          render json: { error: e.message }, status: :internal_server_error
        end
      end


      def update
        store = Store.find_by(id: params[:id])
        if store.nil?
          render json: { error: "店舗が見つかりません" }, status: :not_found
          return
        end
        logo_url = store.name != params[:name] ? "https://ui-avatars.com/api/?name=#{params[:name]}&background=random" : store.logo_url
        if store.update(
            name: params[:name],
            phone_number: params[:phone_number],
            address: params[:address],
            logo_url: logo_url
          )
          render json: { message: "店舗情報を更新しました", store: store }, status: :ok
        else
          render json: { errors: store.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def update_employee
        store = Store.find_by(id: params[:id])
        user_assign = EmployeeStoreAssignment.find_by(id: params[:assign_id])
        if store.nil?
          render json: { error: "店舗が見つかりません" }, status: :not_found
          return
        end
        if user_assign.nil?
          render json: { error: "従業員情報が見つかりません" }, status: :not_found
          return
        end
        logo_url = store.name != params[:name] ? "https://ui-avatars.com/api/?name=#{params[:name]}&background=random" : store.logo_url
        if store.update(
            name: params[:name],
            phone_number: params[:phone_number],
            address: params[:address],
            logo_url: logo_url
          )
          if user_assign.update(
            salary: params[:salary],
            night_salary: params[:night_salary],
            role: params[:role]
          )
            render json: { message: "店舗情報を更新しました", store: store }, status: :ok
          else
            render json: { errors: store.errors.full_messages }, status: :unprocessable_entity
          end
        else
          render json: { errors: store.errors.full_messages }, status: :unprocessable_entity
        end
      end

      def employee_store_params
        params.require(:employer_store).permit(:mode, :publicId, :name)
      end
    end
  end
end
