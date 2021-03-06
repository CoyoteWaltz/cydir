/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-17 23:10:37
 * @LastEditTime: 2020-08-20 01:09:19
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: 处理命令相关
 * @TODO:
 */

const spawn = require('cross-spawn');
const logger = require('../util/log.js');
const store = require('../store');

const isWin = process.platform == 'win32';

/**
 *
 * @param {string} targetPath ensured an existed path
 */
function fire(targetPath, confirm = true) {
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
          logger.err(err);
        } else {
          logger.info('Do nothing...');
        }
        store.save();
      });
  }
}

function execute(command, targetPath) {
  const args = [targetPath];
  if (!isWin) {
    // 非 windows 情况下处理
    const splitCommand = command.split(' ');
    command = splitCommand.shift();
    args.unshift(...splitCommand);
  }
  const cmd = spawn(command, args);
  // stdout
  cmd.stdout.on('data', (data) => {
    logger.info(`stdout:\n${data.toString()}`);
  });
  // error catch
  cmd.stderr.on('data', (err) => {
    logger.err(`stderr:\n${err.toString()}`);
  });
  cmd.stderr.on('err', (err) => {
    logger.err(`stderr:\n${err.toString()}`);
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
      logger.err(err).info('Please report an issue.');
    }
  });
}

module.exports = {
  fire,
};
