
# Single leaf
object @leaf

attributes :id, :description, :details, :file, :line_number, :unread, :extra

node(:created_at) { |leaf| leaf.created_at.to_i }