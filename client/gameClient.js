const utilities = require('./utilities');

msBetweenFrames = 15;
msDataFlush = 60000;

registeredPlayers = {};
onlinePlayers = {};

//#region Mixer Stuff...
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
                participantID = msg.params.participantID;
                type = msg.params.input.type;
                data = msg.params.input.data;
                handleEvent(participantID, type, data);
                break;

            default:
                break;
        }
    }
}

exports.onInteractiveError = function onInteractiveError(error) {
    utilities.logFatal('InteractiveError: ' + error);
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

function LoadData() {
    setTimeout(FlushData, msBetweenFrames);
}

function FlushData() {
    setTimeout(FlushData, msBetweenFrames);
}


function playerFromParticipant(participant) {
    player = {};
    if (participant.userID !== '0' && participant.userID in registeredPlayers) {
        player = registeredPlayers[participant.userID];
    } else {
        player.userID = participant.userID;
        player.username = participant.username;
        player.level = 1;
        player.experience = 0;
    }

    player.sessionID = participant.sessionID;
    player.isMod = utilities.arrayContains(participant.channelGroups, 'Mod');
    player.isPro = utilities.arrayContains(participant.channelGroups, 'Pro');
    player.isOwner = utilities.arrayContains(participant.channelGroups, 'Owner');

    if (player.userID !== '0') {
        registeredPlayers[player.userID] = player;
    }

    return player;
}

function handlePlayerJoined(player) {
    onlinePlayers[player.sessionID] = player;
    console.log(`Player ${player.username} joined!`);
}

function handlePlayerLeft(player) {
    delete onlinePlayers[player.sessionID];
    console.log(`Player ${player.username} left... :(`);
}

function handleEvent(participantID, type, data) {
    datastr = data.toString();
    console.log(`Event ${type} by ${participantID}.\nData: ${datastr}`);
}
