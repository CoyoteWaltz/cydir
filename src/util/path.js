/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-22 21:34:11
 * @LastEditTime: 2020-07-23 00:25:12
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: utils for path node
 */

const path = require('path');
const fs = require('fs');

const { MAX_PROBE_DEPTH, BLACKLIST } = require('./constants.js');

const data = require('../../paths.json');

// TODO
const configurationPath = () => {
  // for debug
  const tmpPath = path.resolve(__dirname, '../../tmp.json');

  const glbPth = path.resolve(
    process.env.HOME || process.env.USERPROFILE || __dirname, //  直接拿的 环境变量 HOME
    '.cpoperConfig.json'
  );

  console.log('------ global path: ', tmpPath);
  console.log(
    '------ global path: ',
    process.env.HOME || process.env.USERPROFILE || __dirname
  );
  console.log('------ global path: ', glbPth);

  return tmpPath;
};

// get all nodes of the layer
const getLayer = (root, depth = 1) => {
  const queue = [root];
  while (depth) {
    for (let i = queue.length; i > 0; --i) {
      const node = queue.shift();
      queue.push(...node.children);
    }
    depth--;
  }
  return queue;
};

// const res = getLayer(data, 2);
// console.log('res: ', res);

const serialize = (tree) => {
  const res = [...(tree.children || []).flatMap(serialize), tree];
  delete tree.children;
  return res;
};

// path.isAbsolute()
const traceParent = (absPath) => {
  // 只需要截去 {path.sep}xxxx 即可
  // return absPath.slice(0, absPath.lastIndexOf(path.sep));
  return path.dirname(absPath);
};

// 返回 父节点路径 断层数 i.e trace 失败的次数
// 到 root path 的时候停止 root path 的有效性交给外面去判断
const traceExistParent = (absPath, rootPath) => {
  if (!rootPath) {
    // TODO 这里改成 log err
    throw new Error('No root path config!');
  }
  let count = 0;
  let parent = traceParent(absPath);
  while (!fs.existsSync(parent) && parent !== rootPath) {
    parent = traceParent(parent);
    count++;
  }
  return { parentPath: parent, failCount: count };
};

const rres = traceExistParent(
  '/sss/vvv/ccc/sdsfa/sdfsdaf/fsds',
  '/sss/vvv/ccc'
);
console.log(rres);

// 工厂函数吧 可能之后会单独抽出一个模块来处理 node 相关
const emptyNode = (filePath, curDepth = 0) => {
  return { name: filePath, depth: curDepth, children: [] };
};

function probe(absPath, maxDepth) {
  maxDepth = maxDepth || MAX_PROBE_DEPTH;
  // 递归遍历目录 到达一定深度结束 返回 tree 节点结果
  // 接受参数 绝对路径
  if (!fs.existsSync(absPath)) {
    return emptyNode(absPath);
  }
  function walk(filePath, curDepth = 0) {
    const node = emptyNode(filePath, curDepth);
    if (curDepth === maxDepth) {
      return node;
    }
    fs.readdirSync(filePath)
      .filter((value) => {
        return !BLACKLIST.includes(value);
      })
      .map((value, index) => {
        const subPath = path.resolve(filePath, value);
        const stat = fs.statSync(subPath);
        if (stat.isDirectory(subPath)) {
          const child = walk(subPath, curDepth + 1);
          node.children.push(child);
        }
      });
    return node;
  }
  return walk(absPath);
}

// const res = serialize(data);
// console.log(res[res.length - 1].name, traceParent(res[res.length - 1].name));
// console.log(res);
module.exports = {
  serialize,
  traceParent,
  configurationPath,
  traceExistParent,
  probe,
};
