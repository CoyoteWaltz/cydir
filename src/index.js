#!/usr/bin/env node
/*
 * @Author: CoyoteWaltz
 * @Date: 2020-07-13 22:29:06
 * @LastEditTime: 2020-07-14 22:47:08
 * @LastEditors: CoyoteWaltz <coyote_waltz@163.com>
 * @Description:
 */

const { program } = require('commander');

// program
//   .version('0.0.1')
//   .option('--root-path <root-path>', 'root path for your projects')
//   .option('--command <command>', 'command for the Application your projects');

// program.parse(process.argv);

// if (program.rootPath) {
//   console.log(program.rootPath);
// }

program
  .command('do <source> [destination]')
  .description('do something')
  .action((source, destination) => {
    console.log(source);
    console.log(destination);
  });

program
  .command('build')
  .description('do build')
  .action(() => {
    console.log(123);
  });
// <required> [optional]
program
  .arguments('<cmd> [env] [options...]')
  .action(function (cmd, env, options) {
    console.log(cmd, env);
    if (typeof env === 'undefined') {
      process.exit(1);
    }
    console.log(options);
  });

program
  .command('rm <dir>')
  .option('-r, --recursive', 'Remove recursively')
  .action(function (dir, cmdObj) {
    console.log('remove ' + dir + (cmdObj.recursive ? ' recursively' : ''));
  });

async function run() {
  /* code goes here */
  console.log('run');
}

async function main() {
  // register commands
  program.command('run').action(run);
  await program.parseAsync(process.argv);
}
// main();

program.parse(process.argv);
