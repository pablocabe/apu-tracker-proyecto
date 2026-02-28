class UsersController < ApplicationController

  # POST /register
  def create
    user = User.new(email: params[:email], password: params[:password])

    if user.save
      token = encode_token({ user_id: user.id })
      render json: { token: token, email: user.email }, status: :created
    else
      render json: { error: user.errors.full_messages.join(", ") }, status: :unprocessable_entity
    end
  end

  # POST /login
  def login
    user = User.find_by(email: params[:email]&.downcase)

    if user&.authenticate(params[:password])
      token = encode_token({ user_id: user.id })
      render json: { token: token, email: user.email }
    else
      render json: { error: "Email o contraseña incorrectos." }, status: :unauthorized
    end
  end

  # GET /users - BORRAR DESPUES DE USAR
  def index
    render json: User.all.pluck(:email, :created_at)
  end
  
end
