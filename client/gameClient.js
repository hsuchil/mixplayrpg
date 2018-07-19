const utilities = require('./utilities');

mixer = null;

msBetweenFrames = 15;
msDataFlush = 60000;

registeredPlayers = {};
onlinePlayers = {};

//#region Mixer Stuff

exports.onInteractiveOpen = function onInteractiveOpen() {
    // Do something?
    utilities.log('Interactive Open.');
}

exports.onInteractiveReady = function onInteractiveReady() {
    utilities.log('Interactive Ready.');
    StartGame();
}

exports.onInteractiveMessage = function onInteractiveMessage(message) {
    msg = JSON.parse(message);
    utilities.checkTypeOrFail(msg.type, 'string', message);
    if (msg.type === 'method') {
        utilities.checkTypeOrFail(msg.method, 'string', message);

        switch (msg.method) {
            case 'onParticipantJoin':
                msg.params.participants.forEach(participant => {
                    player = playerFromParticipant(participant);
                    handlePlayerJoined(player);
                });

                break;

            case 'onParticipantLeave':
                msg.params.participants.forEach(participant => {
                    player = playerFromParticipant(participant);
                    handlePlayerLeft(player);
                })
                break;

            case 'giveInput':
                sid = msg.params.participantID;
                type = msg.params.input.type;
                data = msg.params.input.data;
                handleEvent(sid, type, data);
                break;

            default:
                break;
        }
    }
}

exports.onInteractiveError = function onInteractiveError(error) {
    utilities.logFatal('InteractiveError: ' + error);
}

exports.setMixerClient = function setMixerClient(client) {
    mixer = client;
}

//#endregion

function StartGame() {
    GameLoop();
    LoadData();
}

function GameLoop() {
    // console.log('Frame');
    setTimeout(GameLoop, msBetweenFrames);
}

//#region Persistence

function LoadData() {
    setTimeout(FlushData, msBetweenFrames);
}

function FlushData() {
    setTimeout(FlushData, msBetweenFrames);
}

//#endregion

function playerFromParticipant(participant) {
    player = {};
    if (participant.userID !== '0' && participant.userID in registeredPlayers) {
        player = registeredPlayers[participant.userID];
    } else {
        player.uid = participant.userID;
        player.username = participant.username;
        player.level = 1;
        player.experience = 0;
    }

    player.sid = participant.sessionID;
    player.isMod = utilities.arrayContains(participant.channelGroups, 'Mod');
    player.isPro = utilities.arrayContains(participant.channelGroups, 'Pro');
    player.isOwner = utilities.arrayContains(participant.channelGroups, 'Owner');

    if (player.uid !== '0') {
        registeredPlayers[player.uid] = player;
    }

    return player;
}

//#region Inbound Messages

function handlePlayerJoined(player) {
    onlinePlayers[player.sid] = player;
    console.log(`Player ${player.username} joined!`);
}

function handlePlayerLeft(player) {
    delete onlinePlayers[player.sid];
    console.log(`Player ${player.username} left... :(`);
}

function handleEvent(sid, type, data) {
    if (!(sid in onlinePlayers)) {
        utilities.log('Event sent by offline player.');
        return;
    }

    player = onlinePlayers[sid];
    datastr = JSON.stringify(data);
    console.log(`Event ${type} by ${player.username}. Data: ${datastr}`);
    sendDataToPlayer(sid, { message: 'Cool story bro!' });
    sendDataToAll({ message: 'Hello World!' });
}

//#endregion

//#region Outbound Messages

function sendDataToPlayer(sid, data) {
    mixer.execute(
        'broadcastEvent',
        {
            scope: ['participant:' + sid],
            data: data
        },
        false
    );
}

function sendDataToAll(data) {
    mixer.execute(
        'broadcastEvent',
        {
            scope: ['group:default'],
            data: data
        },
        false
    );
}

//#endregion
