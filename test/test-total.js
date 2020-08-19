/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-08-14 22:03:04
 * @LastEditTime: 2020-08-20 00:59:58
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 * @TODO:
 */

const path = require('path');
const fs = require('fs');
const { parseFullPath } = require('../src/store/endpoint.js');
const { probe, distance, getCfgPath } = require('../src/probe.js');
const { prefixes, endpoints, usualList, root, currentDepth } = require(getCfgPath());
const logger = require('../src/util/log');
// const { checkTypes, usualList } = require('../src/store/index.js');


function ensureEndpoints(endpoints, prefixes, root) {
  console.log('ep len: ', endpoints.length);
  endpoints.forEach((ep) => {
    // const fullPath = path.join(prefixes[prefixId], matcher);
    const fullPath = parseFullPath(ep, prefixes);
    // console.log(fullPath);
    // console.log(distance(fullPath, root));

    if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
      logger.err('Not exist ' + fullPath).info(ep.matcher).exit(false);
    }
  });
}

function ensureUnique(endpoints, prefixes) {
  console.log(endpoints.length);
  const set = new Set();
  const oSet = new Set();
  endpoints.forEach((ep) => {
    // const fullPath = path.join(prefixes[prefixId], matcher);
    const fullPath = parseFullPath(ep, prefixes);
    if (set.has(fullPath)) {
      logger.err('duplicate ' + fullPath);
      oSet.add(fullPath);
    } else {
      set.add(fullPath);
    }
    // console.log(fullPath);
    // console.log(distance(fullPath, root));

    // if (!fs.existsSync(fullPath) || !fs.statSync(fullPath).isDirectory()) {
    //   logger.err(fullPath).info(ep.matcher).exit();
    // }
  });
  console.log(set.size);
  console.log(oSet.size);
  let all = true;
  for (let v of set) {
    // console.log(v);
    if (!oSet.has(v)) {
      all = false;
    }
  }
  console.log(all);
}

function allPrefixes(endpoints, prefixes) {
  const flag = Array(prefixes.length).fill(0);
  endpoints.forEach((v) => {
    // console.log(v);
    flag[v.prefixId]++;
  })
  // console.log(flag);
  flag.forEach((v, i) => {
    console.log('prefix', i, prefixes[i], v);
  })
}

console.log('-------check ep:');
ensureEndpoints(endpoints, prefixes, root);
console.log('-------check ul:');
ensureEndpoints(usualList, prefixes, root);
ensureUnique(endpoints, prefixes, root);
console.log('depth:', currentDepth);
allPrefixes(endpoints.concat(usualList), prefixes, root);
