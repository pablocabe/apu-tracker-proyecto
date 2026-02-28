class Materia < ApplicationRecord
  self.primary_key = "codigo"
  self.table_name = "materias"

  belongs_to :user

  ESTADOS_VALIDOS = %w[pendiente regular aprobada].freeze

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

  validates :codigo, presence: true, inclusion: { in: CODIGOS_VALIDOS }
  validates :estado, inclusion: { in: ESTADOS_VALIDOS }
end
