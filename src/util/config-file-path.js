/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-16 22:27:55
 * @LastEditTime: 2020-07-16 22:37:15
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: 
 */ 

const path = require('path')

module.exports = function() {
  const tmpPath = path.resolve(__dirname, '../../tmp.json')
  console.log('------ global path: ', tmpPath);
  return tmpPath
}