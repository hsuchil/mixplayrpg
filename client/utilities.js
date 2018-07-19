exports.log = function log(message) {
    console.log(message);
}

exports.logFatal = function logFatal(message) {
    console.error(message);
    process.exit(1);
}
