class MateriasController < ApplicationController
  before_action :authenticate_user!

  # GET /materias
  def index
    guardadas = current_user.materias.index_by(&:codigo)

    materias = Materia::CODIGOS_VALIDOS.map do |codigo|
      guardadas[codigo] || { codigo: codigo, estado: "pendiente" }
    end

    render json: materias
  end

  # PATCH /materias/:codigo
  def update
    codigo = params[:codigo]
    estado = params[:estado]

    unless Materia::ESTADOS_VALIDOS.include?(estado)
      return render json: { error: "Estado inválido." }, status: :unprocessable_entity
    end

    unless Materia::CODIGOS_VALIDOS.include?(codigo)
      return render json: { error: "Código no válido." }, status: :not_found
    end

    materia = current_user.materias.find_or_initialize_by(codigo: codigo)
    materia.estado = estado

    if materia.save
      render json: materia
    else
      render json: { error: materia.errors.full_messages }, status: :unprocessable_entity
    end
  end

  # DELETE /materias/:codigo
  def destroy
    materia = current_user.materias.find_by(codigo: params[:codigo])
    materia&.destroy
    render json: { codigo: params[:codigo], estado: "pendiente" }
  end

end
