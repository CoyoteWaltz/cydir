const chalk = require('chalk');
const log = console.log;
console.log(chalk.black.bgGreen('123123123', 'sadf', 'weff'));
console.log(chalk.red('good', chalk.underline.blue('oh yeah')));

log(`
CPU: ${chalk.red('90%')}
RAM: ${chalk.green('40%')}
DISK: ${chalk.yellow('70%')}
`);
log(chalk.bgKeyword('orange')('Some orange text'));
log(chalk.bgHex('#44fe4e')('Some orange text'));
