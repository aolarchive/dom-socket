dom-socket
==========

Broadcast jQuery events across sockets

## Summary
dom-socket is a simple jQuery plugin, with a simple node.js component, that allows any jQuery events to be broadcast and listened to across multiple clients using socket.io as the backend messenger.

This makes it super simple to have one client's UI change based on events from a completely separate client.

This can be used for simple notifications, or for something more complex such as collaborative text editing. 

### Possible Use Cases

* User `A` clicks a submit button, and a notification pops up on every other active client's screen indicating user `A` just submitted an entry.
* User `A` needs help using a web application, and turns on a mode that 'mirrors' their UI interactions, so that support user `B` can see on their page everything that user `A` is doing.
* Lots of other possibilities

## Usage

**Initialize domSocket on an element**
```
$(element).domSocket({
  socketUrl: '{socket_url}'
  events: '{event [...event]}'
})
```
`socketUrl` - The absolute URL pointing to your socket.io server.

`events` - Space-separated list of event names to monitor, for the given jQuery element.


**Listen to socket events from the server**
```
.on('{event_name}', function (event, message) {
})
```

`event_name` - The jQuery event fired from other clients we want to listen for

`event` - the jQuery event object created from the socket event

`message` - The message string sent from the socket event

### Example

As one client mouses over the submit button, it renders a border around that button for all clients. 
On mouse out the border is removed for all clients.
```
$('.submit_button')
  .domSocket({
    socketUrl: 'http://localhost:3000',
    events: 'mouseover mouseout'
  })
 .on('js.event.mouseover', function (event, message) {
    console.log('event found', event, message);
    var $el = $(event.target);
    $el.css('border', '2px solid #CC0000');
  })
  .on('js.event.mouseout', function (event, message) {
    console.log('event found', event, message);
    var $el = $(event.target);
    $el.css('border', '');
  });
```
