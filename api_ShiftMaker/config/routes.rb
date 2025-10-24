Rails.application.routes.draw do
  # Define your application routes per the DSL in https://guides.rubyonrails.org/routing.html

  # Reveal health status on /up that returns 200 if the app boots with no exceptions, otherwise 500.
  # Can be used by load balancers and uptime monitors to verify that the app is live.
  get "up" => "rails/health#show", as: :rails_health_check

   # OmniAuth用
  # post '/auth/:provider/callback', to: 'sessions#create'
  get '/auth/:provider/callback', to: 'sessions#create'
  get '/auth/failure', to: 'sessions#failure'    

  # Defines the root path route ("/")
  # root "posts#index"
  namespace :api do
    namespace :v1 do
      # ログイン、アカウント作成
      post '/auth', to: 'employee_accounts#auth'
      post '/employee_accounts', to: 'employee_accounts#create'
      post '/employer_accounts', to: 'employer_accounts#create'
      
      # アカウント認証、user情報
      get "employee/authenticated", to: "employee_accounts#authenticated"

      # 情報取得
      get '/employee/store_info', to: 'employee_accounts#store_info'
      post '/employee/employer/detail_edit', to: 'employee_accounts#employer_detail_edit'

      # 店舗作成
      post '/stores/employee_create', to: 'stores#employee_create'
      get "/stores/pull", to: "stores#pull"
      get "/stores/:id/employees", to: "stores#employees"
      post "/stores/create", "stores#create"
      get "/stores/delete", to:"stores#delete"
      patch "/stores/update/:id", to: "stores#update"
      patch "/stores/update_employee/:id", to: "stores#update_employee"

      # シフト
      post "/shift", to: "shift#create"
      get "/shift", to: "shift#pull"
      get "/shift/pull/employer", to: "shift#employer"
      post "/shift/submit", to: "shift#submit"
      post "/shift/calender", to: "shift#calender"
      post "/shift/month", to: "shift#month"
      post "/shift/delete", to: "shift#delete"
      post "/shift/employer/confirm", to: "shift#employer_comfirm"
      post "/shift/employer/delete", to: "shift#employer_delete"

      # 会社アカウント
      resources :companies
      
    end
  end
end
