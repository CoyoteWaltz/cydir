/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-16 22:27:55
 * @LastEditTime: 2020-07-16 22:37:15
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: 
 */ 

const path = require('path')

module.exports = function() {
  // for debug
  const tmpPath = path.resolve(__dirname, '../../tmp.json')
  const glbPth = path.resolve(
    process.env.HOME || process.env.USERPROFILE || __dirname, //  直接拿的 环境变量 HOME
    ".cpoperConfig.json"
  );
  
  console.log('------ global path: ', tmpPath);
  console.log('------ global path: ', process.env.HOME || process.env.USERPROFILE || __dirname);
  console.log('------ global path: ', glbPth);

  return tmpPath
}

