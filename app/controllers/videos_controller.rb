class VideosController < ApplicationController
  before_filter :authenticate, :only => [:moderate, :all, :update, :edit, :destroy, :complete]

  def index
    @types = Type.all
    respond_to do |format|
      format.html 
    end
  end

  def show
    number = SecureRandom.random_number
    limit = 1
    now = DateTime.now.utc
    puts now
    from = now - limit.minutes
    videos = Video.where(:published => true, :trash => false, :random.gte => number, :last_played.lte => from).limit(1)
    if videos.empty?
      videos = Video.where(:published => true, :trash => false, :random.lte => number, :last_played.lte => from).limit(1)
      puts "less"
    end
    @video = videos.first
    puts number
    puts @video.random
    @video.random = SecureRandom.random_number
    @video.last_played = DateTime.now.utc
    @video.save!
    puts @video.random
    respond_to do |format|
      format.json {render :partial => "videos/show.json"}
    end
  end

  def create
    @type = Type.find(params[:type][:type])
    @type.videos.create(:link => params[:video][:link],  :random => SecureRandom.random_number )
    flash[:notice] = "Ok!"
    respond_to do |format|
      format.js
    end
  end

  def each
    @video = Video.find(params[:id])
    respond_to do |format|
      format.html   
    end
  end

  protected
  def authenticate
    authenticate_or_request_with_http_basic do |username, password|
      username == "putin" && password == "a1averda"
    end
  end


end