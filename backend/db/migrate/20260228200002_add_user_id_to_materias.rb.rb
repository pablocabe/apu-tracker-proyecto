class AddUserIdToMaterias < ActiveRecord::Migration[8.1]
  def change
    # Primero borramos todos los registros existentes porque
    # no tienen usuario asignado y romperían la restricción
    execute "DELETE FROM materias"

    add_column :materias, :user_id, :integer, null: false
    add_index :materias, [:user_id, :codigo], unique: true
  end
end
