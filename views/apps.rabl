
# Array of apps
collection @apps, :root => 'apps', :object_root => false

attributes :id, :name, :app_key, :app_secret

node :unread_count do |app|
  app.unread_leafs.count
end