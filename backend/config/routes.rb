Rails.application.routes.draw do
  resources :materias, param: :codigo, only: [:index, :update, :destroy]
end