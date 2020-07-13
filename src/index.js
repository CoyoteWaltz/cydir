#!/usr/bin/env node
/*
 * @Author: CoyoteWaltz
 * @Date: 2020-07-13 22:29:06
 * @LastEditTime: 2020-07-13 23:31:27
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 */

const { program } = require('commander');

program
  .version('0.0.1')
  .option('--root-path <root-path>', 'root path for your projects')
  .option('--command <command>', 'command for the Application your projects');

program.parse(process.argv);

if (program.rootPath) {
  console.log(program.rootPath);
}
