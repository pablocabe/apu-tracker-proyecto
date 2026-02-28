Rails.application.routes.draw do
  post "/register", to: "users#create"
  post "/login",    to: "users#login"

  resources :materias, param: :codigo, only: [:index, :update, :destroy]
end
