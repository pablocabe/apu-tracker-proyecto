module Authenticatable
  extend ActiveSupport::Concern

  SECRET = Rails.application.secret_key_base

  included do
    before_action :authenticate_user!, except: [:create] if self < UsersController rescue nil
  end

  def encode_token(payload)
    JWT.encode(payload, SECRET, "HS256")
  end

  def decode_token(token)
    JWT.decode(token, SECRET, true, algorithm: "HS256")[0]
  rescue JWT::DecodeError
    nil
  end

  def current_user
    header = request.headers["Authorization"]
    return nil unless header

    token = header.split(" ").last
    decoded = decode_token(token)
    return nil unless decoded

    @current_user ||= User.find_by(id: decoded["user_id"])
  end

  def authenticate_user!
    unless current_user
      render json: { error: "No autorizado. Iniciá sesión para continuar." }, status: :unauthorized
    end
  end
end
