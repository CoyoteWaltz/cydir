/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-16 22:48:11
 * @LastEditTime: 2020-08-14 00:10:07
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 */

// for beautiful visualization
function toJSON(obj) {
  return JSON.stringify(obj, '', 2);
  // return JSON.stringify(obj);
}

function noop() {}

function joinSep(separate, sep = ' ') {
  return separate.join(sep);
}

module.exports = {
  toJSON,
  noop,
  joinSep,
};
