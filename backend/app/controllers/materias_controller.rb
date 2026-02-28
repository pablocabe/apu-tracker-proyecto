class MateriasController < ApplicationController

    # GET /materias
    # Devuelve todas las materias con su estado actual.
    # Si una materia nunca fue tocada, devuelve "pendiente".
    def index
      # Traemos las que ya están en la BD
      guardadas = Materia.all.index_by(&:codigo)
  
      # Construimos la respuesta con TODOS los códigos del plan
      materias = Materia::CODIGOS_VALIDOS.map do |codigo|
        guardadas[codigo] || { codigo: codigo, estado: "pendiente" }
      end
  
      render json: materias
    end
  
    # PATCH /materias/:codigo
    # Actualiza el estado de una materia. La crea si no existía.
    def update
      codigo = params[:codigo]
      estado = params[:estado]
  
      unless Materia::ESTADOS_VALIDOS.include?(estado)
        return render json: { error: "Estado inválido. Usá: #{Materia::ESTADOS_VALIDOS.join(', ')}" }, status: :unprocessable_entity
      end
  
      unless Materia::CODIGOS_VALIDOS.include?(codigo)
        return render json: { error: "Código de materia no válido" }, status: :not_found
      end
  
      materia = Materia.find_or_initialize_by(codigo: codigo)
      materia.estado = estado
  
      if materia.save
        render json: materia
      else
        render json: { error: materia.errors.full_messages }, status: :unprocessable_entity
      end
    end
  
    # DELETE /materias/:codigo
    # Vuelve la materia a "pendiente" (la elimina de la BD)
    def destroy
      materia = Materia.find_by(codigo: params[:codigo])
      materia&.destroy
      render json: { codigo: params[:codigo], estado: "pendiente" }
    end
  
  end