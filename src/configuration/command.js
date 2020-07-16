/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-16 22:24:37
 * @LastEditTime: 2020-07-16 22:59:41
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 */

const fs = require('fs');
const configFilename = require('../util/config-file-path.js');
const { jsonStringify } = require('../util/chores.js');
const log = require('../util/log.js');

function configCmd(command) {
  log.success(command)
  if (!command) {
    log.err('No command to set!')
  }
  const configFn = configFilename();
  if (!fs.existsSync(configFn)) {
    // initialize a config object
    const config = {
      command: [command],
    };
    console.log(config);
    // store
    fs.writeFileSync(configFn, jsonStringify(config));
    return;
  }
  const data = JSON.parse(fs.readFileSync(configFn));

  console.log(data);
  data.command = command;
  fs.writeFileSync(configFn, jsonStringify(data));

}
configCmd('sdaffs');
module.exports = configCmd;
