/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-13 23:28:43
 * @LastEditTime: 2020-08-20 01:25:58
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: store root path, command, history and endpoints
 * @TODO: 
 */

const path = require('path');
const fs = require('fs');

const { toJSON, noop } = require('../util/chores.js');
const { getCfgPath, probe } = require('../probe.js');
const logger = require('../util/log.js');
const { getCommandTips, MAX_PROBE_DEPTH } = require('../util/constants.js');

class Store {
  constructor() {
    this.initDepth = MAX_PROBE_DEPTH;
    this.cfgPath = getCfgPath();
    let config;
    try {
      config = JSON.parse(fs.readFileSync(this.cfgPath));
    } catch (e) {
      config = {};
    }
    this.initConfig(config);
  }

  initConfig(config = {}) {
    this._root = config.root || '';
    this._command = config.command || '';
    this._endpoints = config.endpoints || [];
    this._prefixes = config.prefixes || [];
    this.usualList = config.usualList || [];
    this.currentDepth = config.currentDepth || this.initDepth;
  }

  save(cb) {
    cb = cb || noop;
    this.shrinkPrefixes();
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
    this.usualList = [];
    this.save(() => {
      logger.info(`Config root path: ${this._root}`);
    });
  }
  get command() {
    return this._command;
  }
  set command(value) {
    if (value === 'cydir') {
      logger.err("Don't circularly use cydir!").exit();
    }
    this._command = value;
    this.save(() => {
      logger.info(`Store command: ${this._command}`);
      logger.notice(getCommandTips(this._command));
    });
  }
  get endpoints() {
    return this._endpoints;
  }
  set endpoints(value) {
    if (Array.isArray(value)) {
      this._endpoints = value;
    } else {
      logger.err('Endpoints store not Array!').info(value);
    }
  }
  get prefixes() {
    return this._prefixes;
  }
  set prefixes(value) {
    this._prefixes = value;
  }
  // 更新根目录 每次更新都 probe 更新
  // 不考虑异步吧
  initEndpoints(depth = this.initDepth) {
    this._prefixes = [];
    const { endpoints, probeDepth } = probe(this._root, depth, this._prefixes);
    this._endpoints = endpoints;
    this.currentDepth = probeDepth;
  }
  setDepth(value = 0) {
    if (value <= 0) {
      return;
    }
    this.currentDepth = value;
    this.initEndpoints(value);
    // no save here
  }
  checkTypes() {
    // TODO
    if (
      !this._command ||
      typeof this._command !== 'string' ||
      this._command === 'cydir'
    ) {
      this._command = '';
      logger
        .err('No command! Run "cydir config-command <command>" to set one!')
        .exit();
    }
    if (!this._root || typeof this._root !== 'string') {
      this._root = '';
      logger
        .err('No root path! Run "cydir config-root-path <path>" to set one!')
        .exit();
    }
    this._endpoints = this._checkArray(this._endpoints);
    this.usualList = this._checkArray(this.usualList);
    this._prefixes = this._checkArray(this._prefixes);
    this.currentDepth = isNaN(this.currentDepth)
      ? this.initDepth
      : parseInt(this.currentDepth);
    return true;
  }
  _checkArray(arr) {
    // TODO
    return Array.isArray(arr) ? arr : [];
  }
  reset() {
    logger
      .notice('Reset all config.')
      .question('', 'sure?')
      .then(() => {
        this.initConfig();
        this.save(() => {
          logger.info('Config reset!');
        });
      })
      .catch(noop);
  }
  /**
   * fix the problem of unremoved useless prefixes
   */
  shrinkPrefixes() {
    const oldPrefixes = this._prefixes.slice();
    const flag = Array(oldPrefixes.length).fill(0);
    this._endpoints.concat(this.usualList).forEach((v) => {
      flag[v.prefixId]++;
    });
    const m = new Map();
    let id = 0;
    this._prefixes = this._prefixes.filter((v, idx) => {
      if (flag[idx] === 0) {
        return false;
      }
      m.set(v, id++);
      return true;
    });
    const mapNewPrefix = (endpoints) => {
      for (let i = 0; i < endpoints.length; ++i) {
        const ep = endpoints[i];
        ep.prefixId = m.get(oldPrefixes[ep.prefixId]);
      }
    };
    mapNewPrefix(this._endpoints);
    mapNewPrefix(this.usualList);
  }
}

const store = new Store();

module.exports = store;
