Rails.application.routes.draw do

  root 'home#index'
  
  namespace :api do
    namespace :v1 do
      get "/auto_login", to: "auth#auto_login"
      post "/login", to: "auth#login"
      post "/refresh_mah_token", to: "auth#refresh_mah_token"
      get "/confirm_email", to: "auth#confirm_email"
      get "/reset_password", to: "auth#reset_password"
      post "/request_password_reset", to: "auth#request_password_reset"
      resources :category_groups, only: [:index, :create, :destroy, :update]
      resources :category_group_memberships, only: [:index, :create, :destroy, :update]
      resources :transactions, only: [:index, :create, :destroy, :update]
      resources :users, only: [:create, :update, :destroy, :index, :show]
      resources :transactions do 
        collection do
          post :import
          get :minmax
        end
      end
    end
  end

  get '*route', to: 'home#index'




  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  #test 
end
