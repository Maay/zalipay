class CreateVideos < ActiveRecord::Migration
  def self.up
    create_table :videos do |t|
      t.string :link
      t.boolean :published,  :default => false
      t.boolean :trash,  :default => false

      t.timestamps
    end
  end

  def self.down
    drop_table :videos
  end
end
