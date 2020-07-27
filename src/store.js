/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-13 23:28:43
 * @LastEditTime: 2020-07-27 23:27:36
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: store root path, command, history and endpoints
 * @TODO: 更新 endpoints 和 prefixes 的方法 删除之前的 prefix 以及 对应的 endpoints以及插入新的
 * 用下标做真的好吗？
 */

const path = require('path');
const fs = require('fs');

// const { getMatchers } = require('./util/endpoint.js');
const { toJSON, noop } = require('./util/chores.js');
const { getCfgPath, probe } = require('./util/probe.js');
const logger = require('./util/log.js');
const { pathToFileURL } = require('url');

class Store {
  initDepth = Infinity;
  cfgPath = getCfgPath();
  constructor() {
    try {
      const cfg = JSON.parse(fs.readFileSync(this.cfgPath));
      this._root = cfg.root || '';
      this._command = cfg.command || '';
      this._endPoints = cfg.endPoints || [];
      this._prefixes = cfg.prefixes || [];
      this.currentDepth = cfg.currentDepth || this.initDepth;
    } catch (e) {}
  }
  save(cb) {
    cb = cb || noop;
    // TODO JSON.stringify
    fs.writeFile(this.cfgPath, toJSON(this.toJSON()), (err) => {
      if (err) {
        logger.err(err);
        logger.err('Failed to save config!').exit();
      }
      cb();
    });
  }
  toJSON() {
    return {
      command: this._command || '',
      root: this._root || '',
      currentDepth: this.currentDepth,
      endPoints: this._endPoints || [],
      // TODO
      usualList: this._usualList || [],
      prefixes: this._prefixes || [],
    };
  }
  get root() {
    return this._root;
  }
  set root(value) {
    if (!path.isAbsolute(value)) {
      logger.err('Path must be absolute!').exit();
    }
    if (!fs.existsSync(value)) {
      logger.err('Path does not exist!').exit();
    }
    if (!fs.statSync(value).isDirectory()) {
      logger.err('Path is not a directory!').exit();
    }
    this._root = value;
    this.initEndPoints();
  }
  get command() {
    return this._command;
  }
  set command(value) {
    this._command = value;
    this.save(() => {
      logger.info(`Store command: ${value}`);
    });
  }
  get endPoints() {
    return this._endPoints;
  }
  // TODO
  set endPoints(value) {
    this._endPoints = value;
  }
  get prefixes() {
    return this._prefixes;
  }
  // TODO
  set prefixes(value) {
    this._prefixes = value;
  }
  // 更新根目录 每次更新都 probe 更新
  // 不考虑异步吧
  initEndPoints() {
    const { endPoints, prefixes, probeDepth } = probe(
      this._root,
      this.initDepth
    );
    this._endPoints = endPoints;
    this._prefixes = prefixes;
    this.currentDepth = probeDepth;
    // console.log(this._endPoints.length);
    this.save(() => {
      logger.info(`Config root path: ${this._root}`);
    });
  }
}

const store = new Store();

store.root = '/Users/koyote/programming';
// store.command = 'code';
store.save();
// console.log(store);

module.exports = store;

// const node = {
//   name: '',
//   weight: 0,
//   children: [], // 获得子路径的数量
//   purity: 0, // 文件数量 / 目录数
//   path: 0, // 相对于根结点的距离 root 为 0
//   updateTime: Date.now(), // 每次遍历生成一次即可
//   passTimes: 0,
// };
