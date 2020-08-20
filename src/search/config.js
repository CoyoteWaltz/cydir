/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-08 20:30:20
 * @LastEditTime: 2020-08-15 14:29:13
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const defaultThreshold = 0.38;

const fuseOption = {
  keys: ['matcher'],
  includeScore: true,
  threshold: defaultThreshold, // 这个越低越好 那个算法嘛
  isCaseSensitive: false,
};

function setOption({ caseSensitive = false }) {
  fuseOption.isCaseSensitive = caseSensitive;
}

module.exports = {
  fuseOption,
  setOption,
};
