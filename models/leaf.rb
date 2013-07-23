
module TeaLeaves
  class Leaf
    include Mongoid::Document
    include Mongoid::Timestamps
  
    embedded_in :app, :inverse_of => :leafs
  
    field :description, type: String # Human Readable
    field :details,     type: String # Stack Trace?
    field :file,        type: String
    field :line_number, type: String
    field :unread,      type: Boolean, default: true
    field :extra,       type: String # Misc
    
    validates_presence_of :description
    validates_presence_of :details
    validates_presence_of :file
    validates_presence_of :line_number
    validates_numericality_of :line_number, integer_only: true
    
    attr_readonly :file, :line_number
    
    default_scope order_by(:created_at.desc)
    
    def unread?
      self[:unread]
    end
  end
end