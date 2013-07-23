
# Single app
object @app

attributes :id, :name, :app_key, :app_secret

node :unread_count do
  @app.unread_leafs.count
end

node :leafs do
  partial('leafs', :object => @app.leafs)
end