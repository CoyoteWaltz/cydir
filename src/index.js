#!/usr/bin/env node
/*
 * @Author: CoyoteWaltz
 * @Date: 2020-07-13 22:29:06
 * @LastEditTime: 2020-08-20 01:07:07
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 */

const { program } = require('commander');

const { joinSep } = require('./util/chores.js');
const {
  storeRootPath,
  storeCommand,
  searchHandler,
  resetHandler,
} = require('./cli');

program.version('0.0.1');
// 顶层参数
program
  .arguments('[paths...]')
  // .description('<command> on your <directory>')
  .option('-s, --skip-confirm', 'Skip confirm before exec command')
  .option('-e, --exact', 'Exact match')
  .option('-c, --case-sensitive', 'Match with case sensitive')
  .action((paths, cmdObj) => {
    if (!paths.length) {
      program.help();
    } else {
      const { exact, caseSensitive } = cmdObj;
      const searchOption = { exact, caseSensitive };
      const fullPath = joinSep(paths);
      require('./search/config.js').setOption(searchOption);
      const confirm = !cmdObj.skipConfirm;
      searchHandler(fullPath, confirm, { exact });
    }
  });

program
  .command('config-command <command>')
  .description('Config command on your file path')
  .action((command) => {
    storeCommand(command);
  });

program
  .command('config-root-path <root-path>')
  .description('Config a relative root path of your projects')
  .action((rootPath) => {
    storeRootPath(rootPath);
  });

program
  .command('reset-config')
  .description('Reset all config')
  .action(() => {
    resetHandler();
  });

program.parse(process.argv);
