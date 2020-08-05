/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-21 22:57:18
 * @LastEditTime: 2020-08-05 22:33:14
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 */

const BLACKLIST = [
  '.git',
  'node_modules',
  '.idea',
  '.vscode',
  '__pycache__',
  '.github',
  '.vs',
  '.ipynb_checkpoints',
  '',
];

const commandTips = {
  code: `
Make sure 'code' is at least in your PATH.
Check out: 
[https://code.visualstudio.com/docs/editor/command-line#_common-questions]
to install 'code' command in PATH.`,
};

function getCommandTips(cmd) {
  if (commandTips[cmd]) {
    return commandTips[cmd]
  }
  return `Make sure '${cmd}' is at least in your PATH.`
}

const MAX_PROBE_DEPTH = 3;

module.exports = { BLACKLIST, MAX_PROBE_DEPTH, getCommandTips };
