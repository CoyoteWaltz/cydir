/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-16 01:05:34
 * @LastEditTime: 2020-07-25 02:12:02
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: log
 */

const chalk = require('chalk');
const readline = require('readline');

const logger = {
  err(err, exit = true) {
    let msg = typeof err === 'string' ? err : err.message || err.msg;

    console.log(chalk.bold.bgRed(' Error '), chalk.red(msg));
    exit && process.exit(1);
  },
  info(msg) {
    console.log(chalk.bold.bgGreen.white(' Info '), chalk.green(msg));
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

// logger.info('yesssss');
// logger.err('noooo');

// const readline = require('readline')

module.exports = logger;

// console.log(chalk.black.bgGreen('123123123', 'sadf', 'weff'));
// console.log(chalk.red('good', chalk.underline.blue('oh yeah')));

// log(`
// CPU: ${chalk.red('90%')}
// RAM: ${chalk.green('40%')}
// DISK: ${chalk.yellow('70%')}
// `);
// log(chalk.bgKeyword('orange')('Some orange text'));
// log(chalk.bgHex('#44fe4e')('Some orange text'));
