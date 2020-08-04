/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-13 23:28:43
 * @LastEditTime: 2020-08-05 00:01:36
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: store root path, command, history and endpoints
 * @TODO: 1. 更新 endpoints 和 prefixes 的方法 删除之前的 prefix 以及 对应的 endpoints以及插入新的
 *        2. 用下标做真的好吗？
 *        3. 构造时读取文件检查文件格式 不符合就 reset
 */

const path = require('path');
const fs = require('fs');

// const { getMatchers } = require('./util/endpoint.js');
const { toJSON, noop } = require('../util/chores.js');
const { getCfgPath, probe } = require('../probe.js');
const logger = require('../util/log.js');

class Store {
  initDepth = 3;
  cfgPath = getCfgPath();
  constructor() {
    try {
      const cfg = JSON.parse(fs.readFileSync(this.cfgPath));
      this._root = cfg.root || '';
      this._command = cfg.command || '';
      this._endpoints = cfg.endpoints || [];
      this._prefixes = cfg.prefixes || [];
      this.usualList = cfg.usualList || [];
      this.currentDepth = cfg.currentDepth || this.initDepth;
    } catch (e) {
      logger.err(e);
    }
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
      endpoints: this._endpoints || [],
      // TODO
      usualList: this.usualList || [],
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
    this.initEndpoints();
  }
  get command() {
    return this._command;
  }
  set command(value) {
    this._command = value;
    // this.save(() => {
    //   logger.info(`Store command: ${value}`);
    // });
  }
  get endpoints() {
    return this._endpoints;
  }
  // TODO
  set endpoints(value) {
    if (Array.isArray(value)) {
      this._endpoints = value;
    } else {
      logger.err('endpoints store not Array!').info(value);
    }
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
  initEndpoints(depth = this.initDepth) {
    console.log('----root: ', this._root === '');
    this._prefixes = [];
    const { endpoints, probeDepth } = probe(this._root, depth, this._prefixes);
    this._endpoints = endpoints;
    this.currentDepth = probeDepth;

    this.save(() => {
      logger.info(`Config root path: ${this._root}`);
    });
  }
  setDepth(value = 0) {
    if (value <= 0) {
      return;
    }
    this.currentDepth = value;
    this.initEndpoints(value);
  }
}

const store = new Store();

module.exports = store;
