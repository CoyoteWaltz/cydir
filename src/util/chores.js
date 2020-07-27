/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-16 22:48:11
 * @LastEditTime: 2020-07-27 23:28:40
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 */

// for beautiful visualization
function toJSON(obj) {
  return JSON.stringify(obj, '', 2);
  // return JSON.stringify(obj);
}

// return different parts of 2 arrays which is new in arr2
function diffArrays(oldArr, newArr) {
  return newArr.filter((v) => !oldArr.includes(v));
}

function noop() {}

module.exports = {
  toJSON,
  diffArrays,
  noop,
};
