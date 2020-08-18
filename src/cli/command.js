/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-17 23:10:37
 * @LastEditTime: 2020-08-17 22:09:23
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: 处理命令相关
 * @TODO:
 */

const { exec, spawn } = require('child_process');

const logger = require('../util/log.js');
const store = require('../store');

/**
 *
 * @param {string} targetPath ensured an existed path
 */
function fire(targetPath, confirm = true) {
  // 这里需要给 "" 不然会被空格分割
  // const execution = `"${store.command}" "${targetPath}"`;
  logger.notice(`confirm: ${confirm}`); // TODO del

  // logger.info(targetPath);
  logger.emphasisPath(targetPath);
  if (!confirm) {
    execute(store.command, targetPath);
  } else {
    logger
      .question('', 'sure?')
      .then(() => {
        execute(store.command, targetPath);
        store.save();
      })
      .catch((err) => {
        if (err) {
          console.log(err);
        } else {
          logger.info('Do nothing...');
        }
        store.save();
      });
  }
}

function execute(command, targetPath) {
  console.log('exec....');

  const options = { windowsHide: true, shell: true };
  const quote = (str) => `"${str}"`;
  console.log(quote(targetPath));
  const cmd = spawn(quote(command), [quote(targetPath)], options);
  console.log(cmd.spawnargs);
  // stdout
  cmd.stdout.on('data', (err) => {
    logger.info(`[stdout] ${String(err)}`);
  });
  // error catch
  cmd.stderr.on('data', (err) => {
    logger.err(`[stderr] ${String(err)}`);
  });
  cmd.on('error', (err) => {
    logger.err(err);
  });
}

module.exports = {
  fire,
};
