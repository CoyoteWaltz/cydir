#!/usr/bin/env node
/*
 * @Author: CoyoteWaltz
 * @Date: 2020-07-13 22:29:06
 * @LastEditTime: 2020-08-07 23:41:14
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 */

const { program } = require('commander');
const chalk = require('chalk');
const { storeRootPath, storeCommand, searchHandler } = require('./cli');

let target;
// program;
// .name("my-command")
// .usage('')
// .version(require('../package.json').version)
// .option('--config-path  <root-path>', 'Root path for your projects')
// .option('--command <command>', 'command for the Application your projects');
// .option('--config-command <command>', 'Command on your filepath')
program.version('0.0.1');

// 顶层参数
program
  .arguments('[paths...]')
  // .description('<command> on your <directory>')
  .option('-p, --prompt', 'Prompt before exec command')
  .option('-c, --case-sensitive', 'Match with case sensitive')
  .action((paths, cmdObj) => {
    if (!paths.length) {
      program.help();
    } else {
      console.log(paths);
      console.log(cmdObj.prompt);
      console.log(cmdObj.caseSensitive);
      console.log(paths.join(' '));
      const fullPath = paths.join(' ');
      target = fullPath
      searchHandler(fullPath);
    }
  });

program
  .command('config-command <command>')
  .description(chalk.yellow('Config command on your file path'))
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

// if (program.configCommand) {
//   console.log(program.configCommand);
//   console.log();
// }

// if (program.configPath) {
//   console.log(program.configPath);
//   console.log();
// }

// console.log(program.opts());
// if (program.opts) {
//   program.help()
// }
// program.parse(process.argv);

// if (program.rootPath) {
//   console.log(program.rootPath);
// }

// program
//   .command('ssss <path>')
//   .description('config a relative root path of your projects')
//   .action((path) => {
//     console.log(path);
//   });

// program
//   .command('build')
//   .description('do build')
//   .action(() => {
//     console.log(123);
//   });
// <required> [optional]
// program
//   .arguments('<cmd> [env] [options...]')
//   .action(function (cmd, env, options) {
//     console.log(cmd, env);
//     if (typeof env === 'undefined') {
//       process.exit(1);
//     }
//     console.log(options);
//   });

// program
//   .command('rm <dir>')
//   .option('-r, --recursive', 'Remove recursively')
//   .action(function (dir, cmdObj) {
//     console.log('remove ' + dir + (cmdObj.recursive ? ' recursively' : ''));
//   });

// async function run() {
//   /* code goes here */
//   console.log('run');
// }

// async function main() {
//   // register commands
//   program.command('run').action(run);
//   await program.parseAsync(process.argv);
// }
// main();

console.log('>>>>>>>>>> ', target);
