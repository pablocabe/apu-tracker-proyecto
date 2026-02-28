class Materia < ApplicationRecord
    self.primary_key = "codigo"
    self.table_name = "materias"
  
    ESTADOS_VALIDOS = %w[pendiente regular aprobada].freeze
  
    validates :codigo, presence: true
    validates :estado, inclusion: { in: ESTADOS_VALIDOS, message: "debe ser pendiente, regular o aprobada" }
  
    # Todos los códigos válidos del plan APU
    CODIGOS_VALIDOS = %w[
      CNE CNC CNM
      SI106 SI104 SI101
      SI107 SI105 SI102
      SI209 SI203 SI207
      SI210 SI202 SI206 SI204 SI208
      SI308 SI302 SI307
      SI301 SI305 07301
      SI306 SI304 S0303 S0410
    ].freeze
  
    validates :codigo, inclusion: { in: CODIGOS_VALIDOS, message: "no pertenece al plan APU" }
  end