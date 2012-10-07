class PagesController < ApplicationController
  
  def moderate_page
    @types = Type.all
    respond_to do |format|
      format.html { render :view => "moderate_page" }
    end
  end

  def complete
    @video = Video.find(params[:video_ids].keys)
    @video.each do |video|
      video.update_attributes!(params[:video_ids][video.id.to_s].reject { |k,v| v.blank? })
    end
    redirect_to :action => "moderate_page"
  end

  def admin_create
    @type = Type.find(params[:type][:type])
    @type.videos.create(params[:video])
    redirect_to :action => "moderate_page"
  end

  def admin_create_many
    file_param = params[:videos][:file]
    filedata = file_param.read
    filedata.each_line do |line|
      puts "THE LINE"
      puts "#{line}"
      line =~ /(\[[\w+\W+]+\])/
      inline_link = $1
      puts "THE LINK"
      puts inline_link
      inline_link.to_s
      inline_link.slice!("[")
      inline_link.slice!("]")
      puts inline_link
      line =~ /(\([\w+\W+]+\))/
      inline_type = $1
      puts "THE TYPE"
      puts inline_type
      inline_type.to_s
      inline_type.slice!("(")
      inline_type.slice!(")")
      puts inline_type
      @type = Type.first(conditions: {:macros => inline_type})
      if @type == nil
        @type = Type.first(conditions: {:name => inline_type})
      end
      @type.videos.create(:link => inline_link, :published => true, :random => SecureRandom.random_number)
      puts "created!"
    end
    redirect_to :action => "moderate_page"
  end

  def moderate
    @video = Video.all(:conditions => {:published => false, :trash => false})
    respond_to do |format|
      format.html { render :action => "moderate" }
    end
  end
  
  
  def all
    @video = Video.all(:conditions => {:published => true, :trash =>false})
    respond_to do |format|
      format.html { render :action => "all" }
    end
  end
  
  
end
