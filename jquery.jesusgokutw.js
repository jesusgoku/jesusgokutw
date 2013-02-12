(function($) {
	$.JesusGokuTW = {
		parseTweet: function( text ) {
			// ---- LINKS -------------------------------------
			// text = text.replace(/(https?:\/\/[^ ]+)/g, '<a href="$1">$1</a>');
			// ---- HASH TAGS ---------------------------------
			text = text.replace(/(#[^ :,#\.]+)/g, function( text ) {
				return '<a href="http://twitter.com/search?q=' + encodeURIComponent( text ) + '" target="_blank">' + text + '</a>';
			});
			// ---- MENTIONS ----------------------------------
			text = text.replace(/(@([^ :,@\.]+))/g, '<a href="http://twitter.com/$2" target="_blank">$1</a>');
			return text;
		}
		, parseDate: function( date ) {
			var d = new Date( date );
			return d.toLocaleDateString() + ' a las ' + d.toLocaleTimeString();
		}
		, parseRelativeTime: function( date ) {
			var previous = new Date( date );
			var current = new Date();
		    var msPerMinute = 60 * 1000;
		    var msPerHour = msPerMinute * 60;
		    var msPerDay = msPerHour * 24;
		    var msPerMonth = msPerDay * 30;
		    var msPerYear = msPerDay * 365;

		    var elapsed = current - previous;

		    if (elapsed < msPerMinute) {
		         return Math.round(elapsed/1000) + 's';   
		    }

		    else if (elapsed < msPerHour) {
		         return Math.round(elapsed/msPerMinute) + 'm';   
		    }

		    else if (elapsed < msPerDay ) {
		         return Math.round(elapsed/msPerHour ) + 'h';   
		    }

		    else if (elapsed < msPerMonth) {
		        return '' + Math.round(elapsed/msPerDay) + 'd';   
		    }

		    else if (elapsed < msPerYear) {
		        return '' + Math.round(elapsed/msPerMonth) + ' mes(es)';   
		    }

		    else {
		        return '' + Math.round(elapsed/msPerYear ) + ' año(s)';   
		    }
		}
		, parseUrl: function( urls, text ) {
			if( urls.length )
			{
				$.each( urls, function() {
					text = text.replace(this.url, '<a href="' + this.url + '">' + this.display_url + '</a>');
				});
			}
			else
			{
				text = text.replace(/(https?:\/\/[^ ]+)/g, '<a href="$1">$1</a>');
			}

			return text;
		}
		, updateList: function(_this, config, options) {
			var apiurl = $.JesusGokuTW.lastData && $.JesusGokuTW.lastData.refresh_url != '' ? config.apiurl + $.JesusGokuTW.lastData.refresh_url : config.apiurl;// + '?q=' + encodeURIComponent(options.query) + (options.lang ? '&lang=' + options.lang : '');
			$.ajax({
				url: apiurl
				, data: {
					q: encodeURIComponent( options.query )
					, lang: (options.lang ? options.lang : '')
					, include_entities: (options.showUrl ? true : false)
				}
				, dataType: 'jsonp'
				, success: function(data) {

					if( typeof data.results !== 'undefined' && data.results.length )
					{
						_this.each(function() {
							var $this = $(this);

							$this.addClass('jesusgokutw');

							var html = '';
							var date = '';
							var relative = '';
							$.each(data.results, function() {
								// ---- LINKS -------------------------------------
								this.text = $.JesusGokuTW.parseUrl( (options.showUrl ? this.entities.urls : []), this.text );
								this.text = $.JesusGokuTW.parseTweet( this.text );
								// ---- DATE --------------------------------------
								date = $.JesusGokuTW.parseDate( this.created_at );
								relative = $.JesusGokuTW.parseRelativeTime( this.created_at );
								// ---- HTML --------------------------------------
								html += '<div class="jesusgokutw-tweet">';
								html += '<a href="http://twitter.com/' + this.from_user + '" target="_blank"><img src="' + this.profile_image_url + '" width="48" height="48"></a>';
								html += '<p><a href="http://twitter.com/' + this.from_user + '" target="_blank" title="@' + this.from_user + '">';
								html += '<strong>' + this.from_user_name +'</strong>';
								html += (options.usernameShow ? ' <span>@' + this.from_user + '</span>' : '');
								html += '</a></p>';
								html += '<p>' + this.text + '</p>';
								html += '<p class="jesusgokutw-date"><a href="https://twitter.com/' + this.from_user + '/status/' + this.id_str + '" target="_blank" title="' + date + '">' + relative + '</a></p>';
								html += '</div>';
							});
							
							if( ! $.JesusGokuTW.lastData ) $this.html( html );
							else $this.prepend( html );

						});
					}
					else
					{
						_this.each(function() {
							var $this = $(this);
							var html = '<p>No hay resultados</p>';
							$this.html( html );
						});
					}

					$.JesusGokuTW.lastData = data;
					$.JesusGokuTW.countConnect += 1;
				}
			});
		}
		, lastData: false
		, countConnect: 0
	};

	$.fn.JesusGokuTW = function( custom ) {
		var _this = this;
		var config = {
			apiurl: 'https://search.twitter.com/search.json'
			, tweetClass: 'jesusgokutw-tweet'
		};
		var defaults = {
			query: 'jesusgoku'
			, usernameShow: true
			, refresh: false // En segundos
			, lang: false
			, showUrl: true
		};
		var options = $.extend({},defaults, custom);

		if( options.refresh )
		{
			setInterval(function() {
				$.JesusGokuTW.updateList(_this, config, options);
			}, options.refresh * 1000);
		}

		$.JesusGokuTW.updateList(_this, config, options);

		return this;
	}
})(jQuery);