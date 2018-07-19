window.addEventListener('load', function initMixer() {
    mixer.display.position().subscribe(handleVideoResized);

    // Move the video by a static offset amount
    const offset = 0;
    mixer.display.moveVideo({
        top: offset,
        bottom: offset,
        left: offset,
        right: offset,
    });

    // Whenever someone clicks on "Hello World", we'll send an event
    // to the game client on the control ID "hello-world"
    document.getElementById('hello-world').onclick = function (event) {
        mixer.socket.call('giveInput', {
            controlID: 'my_first_button',
            event: 'click',
            button: event.button,
        });
    };

    mixer.isLoaded();
});

function handleVideoResized(position) {
    const overlay = document.getElementById('overlay');
    const player = position.connectedPlayer;
    overlay.style.top = `${player.top}px`;
    overlay.style.left = `${player.left}px`;
    overlay.style.height = `${player.height}px`;
    overlay.style.width = `${player.width}px`;
}
