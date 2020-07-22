/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-16 22:24:37
 * @LastEditTime: 2020-07-23 00:29:54
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 */

const fs = require('fs');
const { configurationPath } = require('../util/path.js');
const { jsonStringify } = require('../util/chores.js');
const log = require('../util/log.js');

function configCmd(command) {
  // log.info(command);

  if (!command) {
    log.err('No command to set!');
  }
  const configFn = configurationPath();
  if (!fs.existsSync(configFn)) {
    // initialize a config object
    // todo get an empty config for init
    const config = {
      command: [command],
    };
    console.log(config);
    // store
    fs.writeFileSync(configFn, jsonStringify(config));
  } else {
    const data = require(configFn);
    console.log(data);
    data.command = command;
    fs.writeFileSync(configFn, jsonStringify(data));
  }
  log.info(`Config command ${command}`)
}
configCmd('eeeee');
module.exports = configCmd;
