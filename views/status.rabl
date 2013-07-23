
# Generic Status Response
object false

node(:status) { |m| @status[:status] }

node(:message) { |m| @status[:message] }
