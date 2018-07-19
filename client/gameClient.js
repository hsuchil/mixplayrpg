const utilities = require('./utilities');

exports.onInteractiveOpen = function onInteractiveOpen() {
    utilities.log('onInteractiveOpen');
}

exports.onParticipantJoin = function onParticipantJoin(participant) {
    utilities.log('onParticipantJoin');
}

exports.onParticipantLeave = function onParticipantLeave(sessionID, participant) {
    utilities.log('onParticipantLeave');
}
