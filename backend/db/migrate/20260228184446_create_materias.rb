class CreateMaterias < ActiveRecord::Migration[8.1]
  def change
    create_table :materias, primary_key: :codigo, id: :string do |t|
      t.string :estado, default: "pendiente", null: false
      t.timestamps
    end
  end
end