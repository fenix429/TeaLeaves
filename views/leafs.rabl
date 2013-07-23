
# Array of leafs
collection @leafs, :root => 'leafs', :object_root => false

attributes :id, :description, :details, :file, :line_number, :unread, :extra

node(:created_at) { |leaf| leaf.created_at.to_i }