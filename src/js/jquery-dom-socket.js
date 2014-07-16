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
			socketNamespace = 'js.event',

			methods = {
				init: function (customOptions) {

					options = $.extend(true, {}, defaultOptions, customOptions);

					options.container = $(options.container || 'document');

					if (!socket) {
						socket = io.connect(options.socketUrl);

						socket.on(socketNamespace, function (message) {
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
					socket.emit(socketNamespace, message);
				},

				registerEvents: function (el) {
					var $el = $(el);

					$el.on(options.events, function (event) {
						var message = methods.createMessage(event, $el);
						methods.broadcast(message);
					});
				},

				createMessage: function (event, el) {
					var $el = $(el),
						el = $el.get(0),
						message = {
							type: socketNamespace,
							eventType: event.type,
							selector: String(el.nodeName + (el.id ? '#'+el.id:'') + (el.className ? '.'+el.className.replace(' ','.'):'')).toLowerCase(),
							data: null
						};

					if ($el.is(':input')) {
						message.data = $el.val();
					}

					return message;
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
