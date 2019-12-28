var events = require('events');
var chalk = require('chalk');
var eventEmitter = new events.EventEmitter(); // For fireing events
module.exports = eventEmitter;

/********* Events ******************************************/

function categoryLoaded(data) {
    console.log(data);
}

function categoryDeleteAction(data) {
    console.log(chalk.green.inverse.bold(data));
}

function dashBoardLoaded(data) {
    console.log(chalk.green.inverse.bold(data));
}

function logOut() {
    console.log(chalk.blue.bold('Log out action'));

}

function login(message, data) {
    console.log(chalk.green.bold(message + ' ===> ' + data));
}

function newCategory() {
    console.log(chalk.green.bold('New category created'));

}


eventEmitter.on('categoryLoaded', categoryLoaded);
eventEmitter.on('categoryDeleteBefore', categoryDeleteAction);
eventEmitter.on('categoryDeleteAfter', categoryDeleteAction);
eventEmitter.on('categoryDeleteFailed', categoryDeleteAction);
eventEmitter.on('dashBoardLoaded', dashBoardLoaded);
eventEmitter.on('newCategory', newCategory);
eventEmitter.on('logOut', logOut);
eventEmitter.on('login', login);




/*************************** Close Events ****************************************/