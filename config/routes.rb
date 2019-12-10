Rails.application.routes.draw do

  root 'home#index'

  namespace :api do
    namespace :v1 do
      resources :category_groups, only: [:index, :create, :destroy, :update]
      resources :category_group_memberships, only: [:index, :create, :destroy, :update]
      resources :transactions, only: [:index, :create, :destroy, :update]
      resources :configurations, only: [:index, :create, :destroy, :update, :show]
      resources :transactions do 
        collection do
          post :import
        end
      end
    end
  end

  get '*route', to: 'home#index'



  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  #test 
end
