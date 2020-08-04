/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-16 01:05:34
 * @LastEditTime: 2020-08-04 22:36:22
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: log
 */

const chalk = require('chalk');
const readline = require('readline');
const { toJSON } = require('./chores.js');

const logger = {
  exit(flag = true) {
    flag && process.exit(1);
  },
  err(err) {
    let msg = typeof err === 'string' ? err : err.message || err.msg;
    console.log(chalk.bold.bgRed(' Error '), chalk.red(msg));
    return this;
  },
  info(msg) {
    msg = typeof msg === 'string' ? chalk.green(msg) : chalk.white(toJSON(msg));
    console.log(chalk.bold.bgGreen.white(' Info '), msg);
    return this;
  },
  // TODO
  question(tips, question = '') {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      console.log(chalk.bold.yellowBright('Oops!'), chalk.yellow(tips));
      rl.question(`${question} [y/n]\n`, (answer) => {
        if (answer.toLowerCase() === 'y') {
          resolve();
          rl.close();
        } else {
          reject();
          rl.close();
        }
      });
    });
  },
};


module.exports = logger;
