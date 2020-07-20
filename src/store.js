/*
 * @Author: CoyoteWaltz <coyote_waltz@163.com>
 * @Date: 2020-07-13 23:28:43
 * @LastEditTime: 2020-07-20 23:08:49
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description: store history and paths
 */

const fs = require('fs');
const path = require('path');

// 只遍历文件夹名称
// 深度？
//   第一次扫描深度？
//   未找到扫描深度？
//     动态剪枝？深入？
// 其他信息
//   更新时间
// 路径匹配成功权重
// 广度优先
// 越过文件/文件夹少于一定数量的路径

// 最好的情况是没有子路径

// 设置几个阈值吧
//   文件夹包含的文件数 不能小于n
//   文件夹

// 模块化 首先制定规则/pipeline 遍历路径的时候

// 每个路径是一个 node

// 只关注 dir
async function print(path) {
  const dir = await fs.promises.opendir(path);
  console.log(dir);
  // console.log(await dir.read());
  for await (const dirent of dir) {
    console.log(dirent.name);
  }
}
// print('./').catch(console.error);

function walk(dirname) {
  if (!fs.existsSync(dirname)) {
    return;
  }
  const children = [];
  // console.log(fs.readdirSync(dirname))
  fs.readdirSync(dirname).map((value, index) => {
    const stat = fs.statSync(path.join(dirname, value))
    console.log(stat.isDirectory());
  })

}

walk('./')


const node = {
  name: '',
  weight: 0,
  children: [], // 获得子路径的数量
  purity: 0, // 文件数量 / 目录数
  path: 0, // 相对于根结点的距离 root 为 0
  updateTime: Date.now(), // 每次遍历生成一次即可
  passTimes: 0,
};

const config = {
  command: 'eeeee',
  path: {
    root: './',
  },
};

// const readline = require('readline')
