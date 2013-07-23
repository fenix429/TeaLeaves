
module TeaLeaves
  class Application < Sinatra::Base
    ## Public API ##
    
    # Setup the Environment
    before %r{/api/v1/(\w+)/\w+\.(\w+)} do
      # Check the requested format
      app_key = params[:captures][0]
      @the_format = params[:captures][1]
      
      halt 409 unless ['json', 'xml'].include? @the_format

      if @the_format == 'xml'
        content_type :xml
      else
        content_type :json
      end
      
      # Load the correct App
      @the_app = App.where(:app_key => app_key).first
      
      if @the_app.nil? then halt 404 end
    end
    
    # Read the leafs back out
    get '/api/v1/:app_key/leafs.?:format?' do
      # Authenticate this call
      @the_app.check_signature params[:signature], params[:code]
      
      @leafs = @the_app.leafs
      rabl :leafs, :format => @the_format
    end
    
    # Post a new leaf
    post '/api/v1/:app_key/notify.?:format?' do
      # filter the input properties
      message = {
        :description => params[:message][:description],
        :details => params[:message][:details],
        :file => params[:message][:file],
        :line_number => params[:message][:line_number],
        :extra => params[:message][:extra]
      }
    
      # Authenticate this call
      @the_app.check_signature params[:signature], message.to_json
    
      # Push the new leaf onto the stack
      @the_app.leafs << Leaf.new(message)
      
      # Respond
      if @the_app.save
        @status = { status: 'complete', message: '' }
      else # Do better error msging
        @status = { status: 'error', message: 'Leaf could not be created' }
      end
      
      rabl :status, :format => @the_format
    end
    
    error UnauthorizedApiAccess do
      e = env['sinatra.error']
      
      content_type @the_format
      status 403
      
      @status = { :status => 'error', :message => e.message }
      rabl :status, :format => @the_format
    end
    
    error 404 do
      @status = { :status => 'error', :message => 'Requested Object Not Found' }
      rabl :status, :format => @the_format
    end
    
    error 409 do
      @status = { :status => 'error', :message => 'Bad Format Requested' }
      
      # format error - json is the preferred format
      content_type :json
      rabl :status, :format => :json
    end
  end
end