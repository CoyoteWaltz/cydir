/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-16 01:05:34
 * @LastEditTime: 2020-07-16 22:58:29
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: log
 */

const chalk = require('chalk');
const log = console.log;

const logger = {
  err(err) {
    let msg = typeof err === 'string' ? err : err.message || err.msg;

    log(chalk.bold.bgRed(' Error '), chalk.red(msg));
    // process.exit(1);
  },
  info(msg) {
    log(chalk.bold.bgGreen.white(' Info '), chalk.green(msg));
  },
};

logger.info('yesssss');
logger.err('noooo');

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
