$(document).ready(function start() {
    mixer.socket.on('event', processGameClientMessage);
    mixer.display.position().subscribe(handleVideoResized);
    moveVideo(0);
});

$('#hello').click(function() {
    console.log('Sending data to server');
    sendMessageToGameClient('dummy', { foo: 'bar', myint: 123 });
});

var eventHandlers = {
    initialMessage: handleInitialMessage,
    foobar: handleFoobar
};

function handleFoobar(data) {
    dataStr = JSON.stringify(data);
    console.log(`Received ${datastr} from player`);
}

function moveVideo(offset) {
    mixer.display.moveVideo({
        top: offset,
        bottom: offset,
        left: offset,
        right: offset
    });
}

function handleVideoResized(position) {
    const overlay = document.getElementById('overlay');
    const player = position.connectedPlayer;
    overlay.style.top = `${player.top}px`;
    overlay.style.left = `${player.left}px`;
    overlay.style.height = `${player.height}px`;
    overlay.style.width = `${player.width}px`;
}

function handleInitialMessage(data) {
    console.log(data.player.username);
}

//#region Game Client Communications

function sendMessageToGameClient(type, data) {
    mixer.socket.call('giveInput', {
        controlID: 'my-control',
        event: 'click',
        type: type,
        data: data
    });
}

var processGameClientMessage = function(msg) {
    console.log(msg);
    console.log(JSON.stringify(msg));
    if (
        typeof msg.event != 'undefined' &&
        typeof msg.event.type != 'undefined'
    ) {
        if (typeof eventHandlers[msg.event.type] != 'undefined') {
            eventHandlers[msg.event.type](msg.event.data);
        } else {
            console.error('Unrecognized event: ' + msg.event.type);
        }
    }
};

//#endregion

mixer.isLoaded();
