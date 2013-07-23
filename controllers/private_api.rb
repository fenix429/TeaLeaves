
module TeaLeaves
  class Application < Sinatra::Base
    ## Private API ##
    set :views, settings.root + '/../views'
    
    # Check the requested format
    before %r{/brew/\w+\.(\w+)} do
      format = params[:captures].first
      
      halt 404 unless ['json', 'xml'].include? format
      
      if format == 'xml'
        content_type :xml
      else
        content_type :json
      end
    end
    
    ## Apps ##
    
    get '/brew/apps.?:format?' do
      @apps = App.all
      
      rabl :apps, :format => params[:format]
    end
    
    post '/brew/apps.?:format?' do
      @app = App.new(params[:app])
      @app.generate_credentials
      
      if @app.save
        rabl :app, :format => params[:format]
      else
        @status = { status: 'error', message: 'There was an error creating this app' }
        rabl :status, :format => params[:format]
      end
    end
    
    # Load the correct App
    before '/brew/apps/:id.?:format?' do
      @app = App.where(_id: params[:id]).first
      
      if @app.nil? then halt 404 end
    end
    
    get '/brew/apps/:id.?:format?' do
      rabl :app, :format => params[:format]
    end
    
    put '/brew/apps/:id.?:format?' do
      @app.name = params[:app][:name]
      
      if @app.save
        rabl :app, :format => params[:format]
      else
        @status = { status: 'error', message: 'There was an error saving this app' }
        rabl :status, :format => params[:format]
      end
    end
    
    delete '/brew/apps/:id.?:format?' do
      if @app.delete
        @status = { status: 'complete', message: '' }
      else
        @status = { status: 'error', message: 'Failed to remove app.'}
      end
      
      rabl :status, :format => params[:format]
    end
    
    ## Leafs ##

    get '/brew/leafs/:id.?:format?' do
      @app = App.where('leafs._id' => Moped::BSON::ObjectId(params[:id])).first
      @leaf = @app.leafs.where('_id' => params[:id]).first
      
      rabl :leaf, :format => params[:format]
    end
    
    put '/brew/leafs/touch/:id.?:format?' do
      @app = App.where('leafs._id' => Moped::BSON::ObjectId(params[:id])).first
      @leaf = @app.leafs.where(:_id => params[:id]).first
      
      @leaf.unread = (params[:view_state] == 'read')? false : true
      
      if @leaf.save
        rabl :leaf, :format => params[:format]
      else
        @status = { status: 'error', message: 'Could not update leaf' }
        rabl :status, :format => params[:format]
      end
    end
    
    put '/brew/leafs/:id.?:format?' do
      @app = App.where('leafs._id' => Moped::BSON::ObjectId(params[:id])).first
      @leaf = @app.leafs.where(:_id => params[:id]).first
      
      @leaf.attributes = params[:leaf]
      
      if @leaf.save
        rabl :leaf, :format => params[:format]
      else
        @status = { status: 'error', message: 'Could not update leaf' }
        rabl :status, :format => params[:format]
      end
    end
    
  end
end