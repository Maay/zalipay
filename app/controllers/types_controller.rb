class TypesController < ApplicationController
respond_to :html, :json

  def create
    @video = Type.create(params[:type])
    redirect_to :admin
  end

  def destroy
    @type = Type.find(params[:format])
    @type.destroy
    redirect_to :admin
  end

  def category
    @types = Type.all()
    ty = Type.where(:macros => params[:macros])
    @typpe = ty.first
    puts @typpe.macros
    session[:id] = @typpe.id
    render :layout => 'types'
  end
  
  def show
    number = SecureRandom.random_number
    limit = 1
    now = DateTime.now.utc
    puts now
    from = now - limit.minutes
    @type = Type.find(session[:id])
    puts @type.macros
    videos = @type.videos.where(:published => true, :trash => false, :random.gte => number, :last_played.lte => from).limit(1)
    if videos.empty?
      videos = @type.videos.where(:published => true, :trash => false, :random.lte => number, :last_played.lte => from).limit(1)
    end
    @video = videos.first
    puts number
    puts @video.random
    @video.random = SecureRandom.random_number
    @video.last_played = DateTime.now.utc
    @video.save!
    puts @video.random
    respond_to do |format|
      format.json {render :partial => "types/show.json"}
    end
  end
  
  def update
    @type = Type.find(params[:id])
    @type.update_attributes(params[:type])
    respond_with @user
  end



end
