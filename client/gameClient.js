const utilities = require('./utilities');

exports.onInteractiveOpen = function onInteractiveOpen() {
    // Do something?
    utilities.log('Interactive Open.');
}

exports.onInteractiveReady = function onInteractiveReady() {
    utilities.log('Interactive Ready.');
}

exports.onInteractiveMessage = function onInteractiveMessage(message) {
    utilities.log('Interactive Message: ' + message);
}

exports.onInteractiveError = function onInteractiveError(error) {
    utilities.logFatal('InteractiveError: ' + error);
}

exports.onParticipantJoin = function onParticipantJoin(participant) {
    utilities.log('onParticipantJoin');
}

exports.onParticipantLeave = function onParticipantLeave(sessionID, participant) {
    utilities.log('onParticipantLeave');
}
