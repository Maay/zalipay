//= require jquery
//= require jquery_ujs
//= require jquery.swfobject.1-1-1.min
//= require youTubeEmbed-jquery-1.0
//= require jquery.tipsy
//= require jquery.hotkeys
//= require_self


(function($) {
    $(document).ready(function() {
        //шорткаты
        $(document).bind('keydown', 'space', function() {
						$('#pause').show();
            $.getJSON('/videos/show.json?' + Math.random(), function(data) {
                $('#player').empty().youTubeEmbed(data.video_link);
				$('#lol').css('display', 'block');
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

        });


        //тултипы
        $(function() {
            $('#add [title]').tipsy({
                trigger: 'focus',
                gravity: 'nw',
                fade: true
            });
        });

	 $(function() {
			$('#logo').tipsy({
	            trigger: 'focus',
                gravity: 'nw',
                fade: true    
	            });
			});

 			 $(function() {
					$('#shareb').tipsy({
			                gravity: 'ne',
			                fade: true
			            });
					});


        // учим пользоваться пробельчиком TODO
        $("#space").hide();
        $("#nextb").mouseover(function() {
            $("#nextb").hide();
            $("#space").show();
        });
        $("#space").mouseleave(function() {
            $("#space").hide();
            $("#nextb").show();
        });

        //расчищалка-убиралка добавлялки видео
        $("#add").hide();
        $("#toadd").show();
        $("#toadd").click(function() {
            $("#toadd").hide();
            $("#add").show();
        });

        //добавлялка новых видео
        $.ajaxSetup({
            'beforeSend': function(xhr) {
                xhr.setRequestHeader("Accept", "text/javascript");
            }
        });
        $.fn.submitWithAjax = function() {
            this.submit(function() {
                $.post(this.action, $(this).serialize(), null, "script");
                $("#add").hide();
                $("#toadd").show();
                return false;
            });
        };


        $("#new_video").submitWithAjax();

        //расчищалка-убиралка расшаривалки
        $("#shareopt").hide();
        $("#shareb").show();
        $("#shareb").click(function() {
            $("#shareb").hide();
			$("#adding").css('margin-left', '8.5em');
            $("#shareopt").show();

        });
		
		  //уберает меню и восстанавливает кнопки
	        var i = null;
	        $("#all").mousemove(function() {
	            clearTimeout(i);
	            $(this).css("cursor", "default");
	            $("#menu").slideDown();
							$("#types_menu").slideDown();
							$("#wibiyaToolbar").fadeIn();
				$("#contr").fadeIn();
	            i = setTimeout(function() {
	                $("#menu").stop().slideUp();
									$("#wibiyaToolbar").stop().fadeOut();
									$("#types_menu").stop().slideUp();
					$("#contr").fadeOut();
	                $("#flash_notice").hide();
	                $("#add").hide();
	                $("#toadd").show();
					$("#shareopt").hide();
					$("#shareb").show();
	                $(this).css('cursor', 'none');
					$("#adding").css('margin-left', '2.3em');
	            }, 6000);
	        });
		
				//пауза-плей
				 $('#play').hide();
				 $('#pause').hide();
				 $('#pause').click(function(){
					$('#player').flash().get(0).pauseVideo();
					$('#pause').hide();
					$('#play').show();
					});	
				 $('#play').click(function(){
					$('#player').flash().get(0).playVideo();
					$('#play').hide();
					$('#pause').show();
					});
		


    });
})(jQuery);