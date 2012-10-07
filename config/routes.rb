Zalipay::Application.routes.draw do

  resources :pages do
    collection do
      post :complete
    end
  end
  match 'moderate' => 'pages#moderate'
  match 'admin' => 'pages#moderate_page'
  match '/admin_create' => 'pages#admin_create'
  match '/admin_create_many' => 'pages#admin_create_many'
  match 'all' => 'pages#all'

  resources :types
  match '/destroy_type' => 'types#destroy'
  match 'category/:macros' => 'types#category', :as => :category

  resources :videos
  root :to => 'videos#index'
  match '/menu' => 'videos#menu'
  
  
end
