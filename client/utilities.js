exports.log = function log(message) {
    console.log(message);
}

exports.logFatal = function logFatal(message) {
    console.error(message);
    process.exit(1);
}

exports.checkTypeOrFail = function checkTypeOrFail(data, type, logOnError) {
    if (typeof data !== type) {
        console.error('Failed type check.');
        if (typeof logOnError !== 'undefined') {
            console.error(logOnError);
        }

        process.exit(1);
    }
}

exports.arrayContains = function arrayContains(array, value) {
    if (array.indexOf(value) > -1) {
        return true;
    }

    return false;
}
