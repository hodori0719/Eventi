const chalk = require("chalk");

module.exports = {
    name: 'err',
    execute(err) {
        console.log(chalk.red(`An error occured while connecting to the database:\n${err}`));
    }
}