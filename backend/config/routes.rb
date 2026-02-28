Rails.application.routes.draw do
  post "/register", to: "users#create"
  post "/login",    to: "users#login"
  get "/users", to: "users#index"

  resources :materias, param: :codigo, only: [:index, :update, :destroy]
end
