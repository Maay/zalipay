class Type
  include Mongoid::Document
  
  field :name
  field :macros

  has_many :videos
  
  validates_presence_of :name, :macros
  validates_uniqueness_of :name, :macros
  
end