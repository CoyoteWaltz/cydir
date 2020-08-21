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
  helpHandler,
} = require('./cli');

program.version(require('../package.json').version);

program
  .arguments('[path...]')
  // .description('<command> on your <directory>')
  .option('-s, --skip-confirm', 'Skip confirm before exec command')
  .option('-e, --exact', 'Exact match')
  .option('-c, --case-sensitive', 'Match with case sensitive')
  // .option('-p, --parent', 'Match with case sensitive')
  .action((paths, cmdObj) => {
    if (!paths.length) {
      helpHandler(program);
    } else {
      const { exact, caseSensitive } = cmdObj;
      const confirm = !cmdObj.skipConfirm;
      const searchOption = { exact, caseSensitive, confirm };
      const fullPath = joinSep(paths);
      require('./search/config.js').setOption({ caseSensitive });
      searchHandler(fullPath, searchOption);
    }
  });

program
  .command('set-command <command>')
  .description('Set the command to execute on your directories')
  .action((command) => {
    storeCommand(command);
  });

program
  .command('set-root-path <root-path>')
  .description('Set a relative root path of your directories')
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
