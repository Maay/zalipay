class Video
  include Mongoid::Document

  field :link
  field :published, type: Boolean, default: false
  field :trash, type: Boolean, default: false
  field :random
  field :last_played, type: DateTime
  
  belongs_to :type
  validates_presence_of :link
  validates_uniqueness_of :link, :random
  after_create :genereate_random, :timing
  
  def genereate_random
    if self.random == nil
      self.random = SecureRandom.random_number
      self.save!
    end
  end
  
  def timing
    self.last_played = DateTime.now.utc
    self.save!
  end

end