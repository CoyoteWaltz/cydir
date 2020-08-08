#!/usr/bin/env node
/*
 * @Author: CoyoteWaltz
 * @Date: 2020-07-13 22:29:06
 * @LastEditTime: 2020-08-08 21:15:31
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 */

const { program } = require('commander');

const { joinSep } = require('./util/chores.js');
const { storeRootPath, storeCommand, searchHandler } = require('./cli');

program.version('0.0.1');
// .usage('').version(require('../package.json').version);

// 顶层参数
program
  .arguments('[paths...]')
  // .description('<command> on your <directory>')
  .option('-p, --prompt', 'Prompt before exec command')
  .option('-e, --exact', 'Exact match')
  .option('-c, --case-sensitive', 'Match with case sensitive')
  .action((paths, cmdObj) => {
    if (!paths.length) {
      program.help();
    } else {
      console.log(paths);
      const { prompt, exact, caseSensitive } = cmdObj;
      const searchOption = { prompt, exact, caseSensitive };
      const fullPath = joinSep(paths);
      console.log(prompt, exact, caseSensitive);
      console.log(fullPath);
      require('./search/config.js').setOption(searchOption);
      searchHandler(fullPath);
    }
  });

program
  .command('config-command <command>')
  .description('Config command on your file path')
  .description('Config command on your file path [e.g: cydir "code"]')
  .action((command) => {
    console.log(command);
    console.log();
    storeCommand(command);
  });

program
  .command('config-root-path <root-path>')
  .description('Config a relative root path of your projects')
  .action((rootPath) => {
    console.log(rootPath);
    console.log();
    storeRootPath(rootPath);
  });
program.parse(process.argv);
