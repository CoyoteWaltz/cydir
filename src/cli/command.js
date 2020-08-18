/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-17 23:10:37
 * @LastEditTime: 2020-08-19 01:02:39
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
  logger.notice(`confirm: ${confirm}`); // TODO del

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
  const quoted = (str) => `"${str}"`;
  // const quoted = (str) => str;
  // const quoted = (str) => `"${escapeCommand(str)}"`;
  console.log(targetPath);
  const args = [quoted(targetPath)];
  if (!isWin) {
    // 非 windows 情况下处理
    const splitCommand = command.split(' ');
    command = splitCommand.shift();
    args.unshift(...splitCommand);
  }
  console.log('args:', args);
  const cmd = spawn(quoted(command), args, { shell: true });
  console.log(cmd.spawnargs);
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
