/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-29 23:23:33
 * @LastEditTime: 2020-07-29 23:24:53
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const { probe } = require('../src/util/probe.js');
const path = require('path');
const fs = require('fs');
// 验证 prefix
const { prefixes, endPoints } = require('../prefixtmp.json');

endPoints.forEach(({ prefixId, matcher }) => {
  const fullPath = path.join(prefixes[prefixId], matcher);
  // console.log(fullPath);
  if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    logger.err(fullPath).info(matcher);
  }
});
