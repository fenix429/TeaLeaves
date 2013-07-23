
module TeaLeaves
  class Application < Sinatra::Base
  
    configure do
      # For Testing Error Handlers
      set :environment, :production
      
      # Register RABL
      Rabl.register!
      
      # Sessions
      set :sessions, false 
    
      use Rack::Session::Redis, {
        :url          => "redis://localhost:6379/0",
        :namespace    => "rack:session",
        :expire_after => 600
      }
      
      # Mongo Config
      Mongoid.load! "config/mongoid.yml"
      
      # Public Folder
      set :public_folder, ENV['RACK_ENV'] == 'production' ? 'frontend/dist' : 'frontend/app'
    end
  
    # Routes
    get '/' do
      send_file File.join(settings.public_folder, 'index.html')
    end
    
    # Development
    get '/styles/*.css' do
      content_type 'text/css', :charset => 'utf-8'
      filename = params[:splat].first
      scss filename.to_sym, :views => "#{settings.public_folder}/styles"
    end
    
  end
  
end
