(function ($) {

	$.fn.domSocket = function (method) {

		var defaultOptions = {
				socketUrl: 'http://localhost',
				events: '',
				container: null
			},
			args = arguments,
			options = {},
			socket = null,

			methods = {
				init: function (customOptions) {

					options = $.extend(true, {}, defaultOptions, customOptions);

					options.container = $(options.container || 'document');

					if (!socket) {
						socket = io.connect(options.socketUrl);

						socket.on('js.event', function (message) {
			        methods.messageHandler(message);
			      });
					}

					if (socket) {
						methods.registerEvents(this);
					}

        },

				messageHandler: function (message) {
					if (message) {
						console.log('received', message);
						var $el = $(message.selector);
						$el.trigger(message.type + '.' + message.eventType, message);
					}
				},

				broadcast: function (message) {
					//console.log(message);
					socket.emit('js.event', message);
				},

				registerEvents: function (el) {
					var $el = $(el);

					$el.on(options.events, function (event) {
						var message = methods.createMessage(event, $el);
						methods.broadcast(message);
					});
				},

				createMessage: function (event, el, data) {
					var el = $(el).get(0);
					return {
						type: 'js.event',
						eventType: event.type,
						selector: String(el.nodeName + (el.id ? '#'+el.id:'')/* + (el.classList.length ? '.'+el.classList.join('.'):'')*/).toLowerCase(),
						data: data
					};
				}
			};

		return this.each(function () {
      if (methods[method]) {
        return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
      } else if (typeof method === 'object' || ! method) {
        return methods.init.apply(this, args);
      } else {
        $.error('Method ' + method + ' does not exist.');
      }
    });
	};

}(jQuery));
