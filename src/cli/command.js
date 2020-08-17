/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-17 23:10:37
 * @LastEditTime: 2020-08-15 12:53:44
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
function fire(targetPath, confirm = true) {
  // 这里需要给 "" 不然会被空格分割
  const execution = `"${store.command}" "${targetPath}"`;
  logger.notice(`confirm: ${confirm}`); // TODO del

  logger.info(execution);
  logger.emphasisPath(targetPath);
  if (!confirm) {
    execute(execution);
  } else {
    logger
      .question('', 'sure?')
      .then(() => {
        execute(execution);
        store.save();
      })
      .catch(() => {
        logger.info('Do nothing...');
        store.save();
      });
  }
}

function execute(execution) {
  console.log('exec....');
  const options = { windowsHide: true };
  exec(execution, (err, stdout, stderr) => {
    if (stdout) {
      logger.info('stdout: ');
      console.log(stdout);
    }
    // if (err) {
    //   logger.err(err);
    // }
    if (stderr) {
      return logger.err(stderr);
    } else {
      logger.info('Success!');
    }
  });
}

module.exports = {
  fire,
};
