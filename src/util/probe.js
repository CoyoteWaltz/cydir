/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-22 21:34:11
 * @LastEditTime: 2020-07-25 00:20:31
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: utils for path node
 */

const path = require('path');
const fs = require('fs');
// const { diffArrays } = require('./chores.js');
const { createEndpoint } = require('./endpoint.js');

const { MAX_PROBE_DEPTH, BLACKLIST } = require('./constants.js');

// const data = require('../../paths.json');

// TODO
function getCfgPath() {
  // for debug
  const tmpPath = path.resolve(__dirname, '../../ttmp.json');

  const glbPth = path.resolve(
    process.env.HOME || process.env.USERPROFILE || __dirname, //  直接拿的 环境变量 HOME
    '.__cydir.config.json'
  );

  console.log('------ global path: ', tmpPath);
  console.log(
    '------ global path: ',
    process.env.HOME || process.env.USERPROFILE || __dirname
  );
  console.log('------ global path: ', glbPth);

  return tmpPath;
}

// 以 absPath 为 root maxDepth 为最大深度的 所有 endpoints
// 加入 exclude
function probe(absPath, maxDepth) {
  // return Endpoints[]
  maxDepth = maxDepth || MAX_PROBE_DEPTH;

  // 递归遍历目录 到达一定深度结束 返回 tree 节点结果
  const endPoints = [];
  // 接受参数 绝对路径
  if (!fs.existsSync(absPath)) {
    return endPoints;
  }

  function walk(filePath, curDepth = 0, chain = '', excludes = []) {
    const matcher = path.join(chain, path.basename(filePath));
    if (curDepth === maxDepth) {
      endPoints.push(createEndpoint(filePath, curDepth, matcher));
      return;
    }
    try {
      const subPaths = fs
        .readdirSync(filePath)
        .filter((value) => !BLACKLIST.includes(value))
        // 转 abs path
        .map((value) => path.resolve(filePath, value))
        .filter((value) => !excludes.includes(value)) // TODO 这一步可能要在想想
        .filter((value) => fs.statSync(value).isDirectory());
      if (!subPaths.length) {
        endPoints.push(createEndpoint(filePath, curDepth, matcher));
        return;
      }
      // 第一个给 chain
      walk(subPaths.shift(), curDepth + 1, matcher);
      if (subPaths.length) {
        subPaths.forEach((value) => {
          walk(value, curDepth + 1, '');
        });
      }
    } catch (e) {
      // ignore this error walk
      return;
    }
  }
  walk(absPath, 0, absPath);
  return endPoints;
}

// // get all nodes of the layer
// const getLayer = (root, depth = 1) => {
//   const queue = [root];
//   while (depth) {
//     for (let i = queue.length; i > 0; --i) {
//       const node = queue.shift();
//       queue.push(...node.children);
//     }
//     depth--;
//   }
//   return queue;
// };

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

// const rres = traceExistParent(
//   '/sss/vvv/ccc/sdsfa/sdfsdaf/fsds',
//   '/sss/vvv/ccc'
// );
// console.log(rres);

// 增加 diff 功能
// function probe(absPath, oldTree = null, maxDepth = MAX_PROBE_DEPTH) {
//   // maxDepth = maxDepth || MAX_PROBE_DEPTH;
//   // 递归遍历目录 到达一定深度结束 返回 tree 节点结果
//   // 接受参数 绝对路径
//   absPath = oldTree ? oldTree.name : absPath;
//   if (!fs.existsSync(absPath)) {
//     return emptyNode(absPath);
//   }
//   // let old = oldTree;
//   let diffs = [];

//   const walk = (filePath, curDepth = 0, old = null) => {
//     const node = emptyNode(filePath, curDepth);
//     if (curDepth === maxDepth) {
//       return node;
//     }
//     // get sub paths of filePath
//     const subPaths = fs
//       .readdirSync(filePath)
//       .filter((value) => {
//         return !BLACKLIST.includes(value);
//       })
//       .map((value) => path.resolve(filePath, value))
//       .filter((value) => fs.statSync(value).isDirectory(value));

//     const oldNames = old ? getChildrenName(old) : [];
//     // 找出新增 or 修改过的
//     const differences = diffArrays(oldNames, subPaths);
//     diffs.push(...differences);
//     // }

//     subPaths.forEach((value, index) => {
//       // 找一下旧树对应的节点
//       const oldNode = old
//         ? old.children.filter((v) => value === v.name)[0]
//         : old;
//       const child = walk(value, curDepth + 1, oldNode);
//       node.children.push(child);
//     });
//     // old = oldNow;
//     return node;
//   };
//   const res = walk(absPath, 0, oldTree);
//   // TODO
//   console.log(diffs);
//   return res;
// }



const oldNode = {
  name: '/Users/koyote/programming',
  depth: 0,
  children: [
    {
      name: '/Users/koyote/programming/FrontEnd',
      depth: 1,
      children: [
        {
          name: '/Users/koyote/programming/FrontEnd/fork_proj',
          depth: 2,
          children: [
            {
              name:
                '/Users/koyote/programming/FrontEnd/fork_proj/HomePage-master',
              depth: 3,
              children: [],
            },
          ],
        },
      ],
    },
  ],
};
const newNode = {
  name: '/Users/koyote/programming',
  depth: 0,
  children: [
    {
      name: '/Users/koyote/programming/FrontEnd',
      depth: 1,
      children: [
        {
          name: '/Users/koyote/programming/FrontEnd/newnew',
          depth: 2,
          children: [
            {
              name:
                '/Users/koyote/programming/FrontEnd/fork_proj/HomePage-master',
              depth: 3,
              children: [],
            },
          ],
        },
      ],
    },
  ],
};

// const res = probe('/Users/koyote/programming', data);
// console.log(res);

// const res = serialize(data);
// console.log(res[res.length - 1].name, traceParent(res[res.length - 1].name));
// console.log(res);
module.exports = {
  serialize,
  traceParent,
  getCfgPath,
  traceExistParent,
  probe,
};
