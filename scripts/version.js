
/* eslint-disable no-console */
const { spawnSync } = require('child_process');
const chalk = require('chalk');

console.clear();

const args = [['-p', '--patch'], ['-m', '--minor'], ['-M', '--major']];
const { argv } = process;

// Remove the two first parameters ('node' and 'script path')
argv.splice(0, 2);

// Check if there's only one argument
if (argv.length > 1) {
  console.log(chalk.red.underline(`Only one argument is accepted. Received: ${argv.length}`));
  console.log('Arguments list:');
  for (let index = 0; index < argv.length; index += 1) {
    console.log(argv[index]);
  }
  process.exit();
}

// Get the needed argument
const argument = argv[0];

// Check if argement is valid
if (args.includes((arg) => arg.includes(argument))) {
  console.log(chalk.red.underline(`Argument passed is not valid: ${argument}`));
  console.log('Only these arguments are allowed:');
  args.forEach((arg) => console.log(`${arg[0]} or ${arg[1]}`));
  process.exit();
}

// Check if the directory has non-committed changes
const porcelain = spawnSync('git', ['status', '--porcelain'], { encoding: 'utf8' });
if (porcelain.error) {
  console.log(chalk.red.underline('Error while bumping new version:'));
  console.log(porcelain.error);
  process.exit();
}

const gitStatus = porcelain.stdout.split('\n');
gitStatus.pop();
if (gitStatus.length > 0) {
  console.log(chalk.red.underline('Please, commit all changes before bumping.'));
  process.exit();
}

// Trigger the rigth version upgrade
if (args[0].includes(argument)) {
  spawnSync('npm', ['version', 'patch', '--no-git-tag-version']);
} else if (args[1].includes(argument)) {
  spawnSync('npm', ['version', 'patch', '--no-git-tag-version']);
} else if (args[2].includes(argument)) {
  spawnSync('npm', ['version', 'patch', '--no-git-tag-version']);
}

// Handle async with condition to avoid push being trigger before the end of git status
const push = spawnSync('git', ['push'], { encoding: 'utf8' });
if (push.error) {
  console.log(chalk.red.underline('Error while pushing version commit:'));
  console.log(push.error);
  process.exit();
}

const pushTag = spawnSync('git', ['push', '--tags'], { encoding: 'utf8' });
if (pushTag.error) {
  console.log(chalk.red.underline('Error while pushing version tag:'));
  console.log(porcelain.error);
  process.exit();
}

// eslint-disable-next-line global-require
console.log(`Version successfully bumped to ${require('../package.json').version}`);

process.exit();
