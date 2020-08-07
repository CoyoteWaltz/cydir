/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-17 23:10:37
 * @LastEditTime: 2020-08-08 00:30:45
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: 处理命令相关
 * @TODO:
 */

const { exec } = require('child_process');

const logger = require('../util/log.js');
const store = require('../store');

/**
 *
 * @param {string} targetPath ensured an existed path
 */
function fire(targetPath) {
  // 这里 path 需要给 '' 不然会被空格分割
  const execution = `${store.command} '${targetPath}'`;
  logger
    .emphasisPath(targetPath)
    .question('', 'sure?')
    .then(() => {
      exec(execution, (err, stdout, stderr) => {
        if (err) {
          logger.err(err);
        }
        if (stderr) {
          logger.err(stderr);
        }
        if (stdout) {
          logger.info('stdout: ');
          console.log(stdout);
        }
        logger.info('Success!');
        // store.cfgPath = './fire.json';
      });
    })
    .catch(() => {
      logger.info('Do nothing...');
    })
    .finally(() => {
      store.save();
    });
}

module.exports = {
  fire,
};
