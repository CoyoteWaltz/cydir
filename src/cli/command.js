/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-17 23:10:37
 * @LastEditTime: 2020-08-19 00:28:14
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: 处理命令相关
 * @TODO:
 */

// const { exec, spawn } = require('child_process');
const spawn = require('cross-spawn');
const logger = require('../util/log.js');
const store = require('../store');
const isWin = process.platform == 'win32';

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

  // const options = isWin ? { windowsHide: true, shell: true } : {};
  // const quote = (str) => `"${str}"`;
  const quote = (str) => str;
  console.log(targetPath);
  const cmd = spawn(quote(command), [quote(targetPath)]);
  console.log(cmd.spawnargs);
  // stdout
  cmd.stdout.on('data', (data) => {
    logger.info(`[stdout] ${data.toString()}`);
  });
  // error catch
  cmd.stderr.on('data', (err) => {
    logger.err(`[stderr] ${err.toString()}`);
  });
  cmd.stderr.on('err', (err) => {
    logger.err(`[stderr] ${err.toString()}`);
  });
  cmd.on('error', (err) => {
    if (err.code === 'ENOENT') {
      // command not found
      if (!isWin) {
        logger.err(
          `Command not found! Run [which "${command}"] to check the command.`
        );
      } else {
        logger.err(`Command not found! Make sure "${command}" is in PATH.`);
      }
    } else {
      console.log(err);
    }
  });
}

module.exports = {
  fire,
};
