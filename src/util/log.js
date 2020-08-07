/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-16 01:05:34
 * @LastEditTime: 2020-08-07 22:57:42
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: log
 */

const chalk = require('chalk');
const readline = require('readline');
const { toJSON } = require('./chores.js');
const path = require('path');

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
    msg = typeof msg === 'string' ? msg : toJSON(msg);
    console.log(chalk.bold.bgGreen.white(' Info '), msg);
    return this;
  },
  emphasisPath(dirPath) {
    console.log(
      chalk.bold.yellowBright('Got it!'),
      `${chalk.bold.white(path.dirname(dirPath))}${chalk.bold.yellow(
        path.sep + path.basename(dirPath)
      )}`
    );
    return this;
  },
  notice(msg) {
    console.log(chalk.bold.bgYellow.white(' Notice '), chalk.bold.yellow.italic(msg));
    return this;
  },
  // TODO
  question(tips, question = '') {
    return new Promise((resolve, reject) => {
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      });
      rl.question(`${tips? chalk.yellow(tips) + ' ': ''}${question} [y/n]`, (answer) => {
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
