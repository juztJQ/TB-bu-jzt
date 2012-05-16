JQTWEET = {
	
	// Set twitter username, number of tweets & id/class to append tweets
	user: 'tuiterosboyaca',
	numTweets: 20,
	appendTo: '#jstwitter',

	// core function of jqtweet
	loadTweets: function() {
		$.ajax({
			url: 'http://api.twitter.com/1/statuses/user_timeline.json/',
			type: 'GET',
			dataType: 'jsonp',
			data: {
				screen_name: JQTWEET.user,
				include_rts: true,
				count: JQTWEET.numTweets,
				include_entities: true
			},
			success: function(data, textStatus, xhr) {

				 var html = '<div class="tweet">IMG_TAG TWEET_TEXT<div class="time">AGO</div>';
				 var img;
                 var img2;
				 // append tweets into page
				 for (var i = 0; i < data.length; i++) {
				
					if (data[i].entities.media) {
						img = '<a href="' + data[i].entities.media[0].media_url + ':large" class="fancy">';
						img += '<img src="' + data[i].entities.media[0].media_url + ':thumb" alt="" width="150" />';
						img += '</a>';
					} else {
						img = '<img src="' + data[i].user.profile_image_url + '" alt="" " />';
					}


					$(JQTWEET.appendTo).append(
						html.replace('IMG_TAG', img)
							.replace('TWEET_TEXT', JQTWEET.ify.clean(data[i].text, img) )
							.replace(/USER/g, data[i].user.screen_name)
							.replace('AGO', JQTWEET.timeAgo(data[i].created_at) )
							.replace(/ID/g, data[i].id_str)							
					);
										
					
				 }
				
				//trigger jQuery Masonry once all data are loaded				
				var $container = $('#jstwitter');
				$container.imagesLoaded(function(){
				  $container.masonry({
				    itemSelector : '.tweet',
				    columnWidth : 0,
				    isAnimated: true
				  });
				});		
				
				//the last step, activate fancybox 
				$("a.fancy").fancybox({
					'overlayShow'	: false,
					'transitionIn'	: 'elastic',
					'transitionOut'	: 'elastic',
					'overlayShow'	: true
				});							 					
				
			}	

		});
		
	}, 
	
		
	/**
      * relative time calculator FROM TWITTER
      * @param {string} twitter date string returned from Twitter API
      * @return {string} relative time like "2 minutes ago"
      */
    timeAgo: function(dateString) {
		var rightNow = new Date();
		var then = new Date(dateString);
		
		if ($.browser.msie) {
			// IE can't parse these crazy Ruby dates
			then = Date.parse(dateString.replace(/( \+)/, ' UTC$1'));
		}

		var diff = rightNow - then;

		var second = 1000,
		minute = second * 60,
		hour = minute * 60,
		day = hour * 24,
		week = day * 7;

		if (isNaN(diff) || diff < 0) {
			return ""; // return blank string if unknown
		}

		if (diff < second * 2) {
			// within 2 seconds
			return "ahora mismo";
		}

		if (diff < minute) {
			return "hace " + Math.floor(diff / second) + " segundos";
		}

		if (diff < minute * 2) {
			return "hace 1 minuto";
		}

		if (diff < hour) {
			return "hace " + Math.floor(diff / minute) + " minutos";
		}

		if (diff < hour * 2) {
			return "hace 1 hora";
		}

		if (diff < day) {
			return  "hace " + Math.floor(diff / hour) + " horas";
		}

		if (diff > day && diff < day * 2) {
			return "ayer";
		}

		if (diff < day * 365) {
			return "hace " + Math.floor(diff / day) + " dias";
		}

		else {
			return "hace mas de un año";
		}
	}, // timeAgo()
    
	
    /**
      * The Twitalinkahashifyer!
      * http://www.dustindiaz.com/basement/ify.html
      * Eg:
      * ify.clean('your tweet text');
      */
    ify:  {
      link: function(tweet, hasIMG) {
        return tweet.replace(/\b(((https*\:\/\/)|www\.)[^\"\']+?)(([!?,.\)]+)?(\s|$))/g, function(link, m1, m2, m3, m4) {
          var http = m2.match(/w/) ? 'http://' : '';
          if (hasIMG) return '';
          else return '<a class="twtr-hyperlink" target="_blank" href="' + http + m1 + '">' + ((m1.length > 25) ? m1.substr(0, 24) + '...' : m1) + '</a>' + m4;
        });
      },

      at: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20})/g, function(m, username) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/intent/user?screen_name=' + username + '">@' + username + '</a>';
        });
      },

      list: function(tweet) {
        return tweet.replace(/\B[@＠]([a-zA-Z0-9_]{1,20}\/\w+)/g, function(m, userlist) {
          return '<a target="_blank" class="twtr-atreply" href="http://twitter.com/' + userlist + '">@' + userlist + '</a>';
        });
      },

      hash: function(tweet) {
        return tweet.replace(/(^|\s+)#(\w+)/gi, function(m, before, hash) {
          return before + '<a target="_blank" class="twtr-hashtag" href="http://twitter.com/search?q=%23' + hash + '">#' + hash + '</a>';
        });
      },

      clean: function(tweet , hasIMG) {
	      return this.hash(this.at(this.list(this.link(tweet, hasIMG))));

      }
    } // ify

	
};




// start jqtweet!
JQTWEET.loadTweets();
