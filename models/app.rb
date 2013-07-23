
module TeaLeaves
  class App
    include Mongoid::Document
  
    embeds_many :leafs
  
    field :name,       type: String
    field :app_key,    type: String
    field :app_secret, type: String
    
    validates_presence_of :name
    
    attr_protected :app_key, :app_secret
  
    def generate_credentials
      self[:app_key], self[:app_secret] = SecureRandom.hex, SecureRandom.hex
      
      { app_key: self[:app_key], app_secret: self[:app_secret] }
    end
  
    def check_signature(signature, message)
      if signature.nil? or message.nil? then raise UnauthorizedApiAccess, 'A request signature is required' end
      
      raise UnauthorizedApiAccess, 'Signature invalid' unless signature.eql? make_signature(message)
    end
  
    def make_signature(message)
      OpenSSL::HMAC.hexdigest('sha256', self[:app_secret], message)
    end
    
    def unread_leafs
      self.leafs.select { |leaf| leaf.unread? }
    end
  end
end