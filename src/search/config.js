/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-08 20:30:20
 * @LastEditTime: 2020-08-08 21:50:33
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

function setOption({ exact = false, caseSensitive = false }) {
  fuseOption.threshold = exact ? 0 : fuseOption.threshold;
  fuseOption.isCaseSensitive = caseSensitive;
}

module.exports = {
  fuseOption,
  setOption,
};
