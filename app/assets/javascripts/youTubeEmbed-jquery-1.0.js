(function($){
	
	$.fn.youTubeEmbed = function(settings){
		
		// Settings can be either a URL string,
		// or an object
		
		if(typeof settings == 'string'){
			settings = {'video' : settings}
		}
		
		// Default values
		 
		var def = {
			
			width		: ("window", $(window).width()),
			progressBar	: false,
		};
		
		settings = $.extend(def,settings);
		
		var elements = {
			originalDIV	: this,	// The "this" of the plugin
			container	: null,	// A container div, inserted by the plugin
			control		: null,	// The control play/pause button
			player		: null,	// The flash player
			progress	: null,	// Progress bar
			elapsed		: null	// The light blue elapsed bar
		};
		

		try{	

			settings.videoID = settings.video.match(/v=(.{11})/)[1];
			
			// The safeID is a stripped version of the
			// videoID, ready for use as a function name

			settings.safeID = settings.videoID.replace(/[^a-z0-9]/ig,'');
		
		} catch (e){
			// If the url was invalid, just return the "this"
        //$('#player').load('/videos/show');
		
		}

		// Fetch data about the video from YouTube's API

		var youtubeAPI = 'http://gdata.youtube.com/feeds/api/videos?v=2&alt=jsonc';

		$.get(youtubeAPI,{'q':settings.videoID},function(response){
			
			var data = response.data;
	
			if(!data.totalItems || data.items[0].accessControl.embed!="disabled"){
				
				// If the video was not found, or embedding is not allowed;
				
				$('#message').append("press 'space' for video-surf. supa-dupa beta.");
			}

			// data holds API info about the video:
			
			data = data.items[0];
			
			settings.ratio = 9/16;
			if(data.aspectRatio == "widescreen"){
				settings.ratio = 9/16;
			}
			
			settings.height = Math.round(settings.width*settings.ratio);

			// Creating a container inside the original div, which will
			// hold the object/embed code of the video

			elements.container = $('<div>',{className:'flashContainer',css:{
				width	: settings.width,
				height	: settings.height
			}}).appendTo(elements.originalDIV);

			// Embedding the YouTube chromeless player
			// and loading the video inside it:

			elements.container.flash({
				swf			: 'http://www.youtube.com/apiplayer?enablejsapi=1&version=3',
				id			: 'video_'+settings.safeID,
				height		: settings.height,
				width		: settings.width,
				allowScriptAccess:'always',
				wmode		: 'transparent',
				flashvars	: {
					"video_id"		: settings.videoID,
					"playerapiid"	: settings.safeID
				}
			});
			

			// We use get, because we need the DOM element
			// itself, and not a jquery object:
			
			elements.player = elements.container.flash().get(0);

			// Creating the control Div. It will act as a ply/pause button

			elements.control = $('<div>',{className:'controlDiv play'})
							   .appendTo(elements.container);

			// If the user wants to show the progress bar:

			if(settings.progressBar){
				elements.progress =	$('<div>',{className:'progressBar'})
									.appendTo(elements.container);

				elements.elapsed =	$('<div>',{className:'elapsed'})
									.appendTo(elements.progress);
				
				elements.progress.click(function(e){
					
					// When a click occurs on the progress bar, seek to the
					// appropriate moment of the video.
					
					var ratio = (e.pageX-elements.progress.offset().left)/elements.progress.outerWidth();
					
					elements.elapsed.width(ratio*100+'%');
					elements.player.seekTo(Math.round(data.duration*ratio), true);
					return false;
				});

			}

			var initialized = false;
			
			// Creating a global event listening function for the video
			// (required by YouTube's player API):
			
			window['eventListener_'+settings.safeID] = function(status){

				var interval;
				
				if(status==-1)	// video is loaded
				{
					if(!initialized)
					{
						// Listen for a click on the control button:
						
						$(document).ready(function(){
							if(!elements.container.hasClass('playing')){
								
								// If the video is not currently playing, start it:

								elements.control.removeClass('play replay').addClass('pause');
								elements.container.addClass('playing');
								elements.player.playVideo();
								
								if(settings.progressBar){
									interval = window.setInterval(function(){
										elements.elapsed.width(
											((elements.player.getCurrentTime()/data.duration)*100)+'%'
										);
									},1000);
								}
								
							} else {
								
								// If the video is currently playing, pause it:
								
								elements.control.removeClass('pause').addClass('play');
								elements.container.removeClass('playing');
								elements.player.pauseVideo();
								
								if(settings.progressBar){
									window.clearInterval(interval);
								}
							}
						});
						
						initialized = true;
					}
					else{
						// This will happen if the user has clicked on the
						// YouTube logo and has been redirected to youtube.com

						if(elements.container.hasClass('playing'))
						{
							elements.control.click();
						}
					}
				}
				
				if(status==0){ // video has ended
					 $.getJSON('/Zalipay/videos/show.json?' + Math.random(), function(data) {
		                $('#player').empty().youTubeEmbed(data.video_link);
		                $('#shareopt1 a').attr('href', 'http://twitter.com/share?' + $.param({
		                    text: data.twitter_link,
							related: 'ZloeSabo:aximas'
		                }));

						$('#shareopt2 :first-child').attr('src', 'http://www.facebook.com/plugins/like.php?' + $.param({
							href: data.video_id,
							layout: 'button_count',
							width: '90',
							colorscheme: 'dark',
							locale: 'en_US'
		  					}));

						$('#shareopt3').html(VK.Share.button({
							  url: data.video_id,
							  title: 'Видео ок!',
							  description: 'videoroulette',
							  noparse: true
							},
							{
								type: "link", 
								text: ".:."
							}));	
					});
				
				}
			}
			
			// This global function is called when the player is ed.
			// It is shared by all the videos on the page:
			
			if(!window.onYouTubePlayerReady)
			{				
				window.onYouTubePlayerReady = function(playerID){
					document.getElementById('video_'+playerID).addEventListener('onStateChange','eventListener_'+playerID);
				}
			}
		},'jsonp');

		return elements.originalDIV;
		
		
	}

})(jQuery);