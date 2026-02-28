Rails.application.config.middleware.insert_before 0, Rack::Cors do
    allow do
      # En desarrollo, permitimos peticiones desde React (puerto 5173)
      origins "http://localhost:5173"
  
      resource "*",
        headers: :any,
        methods: [:get, :post, :patch, :put, :delete, :options, :head]
    end
  end