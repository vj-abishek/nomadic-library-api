
/* eslint-disable no-console */
const { exec } = require('child_process');
const chalk = require('chalk');

console.clear();

const args = [['-p', '--patch'], ['-m', '--minor'], ['-M', '--major']];
const { argv } = process;

// Remove the two first parameters ('node' and 'script path')
argv.splice(0, 2);

// Handle error for npm version
function errorHandler(error, _, stderr) {
  if (error) {
    console.log(chalk.red.underline('Error while bumping new version:'));
    console.log(stderr);
    process.exit();
  }
}

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
let isClean = false;
exec('git status --porcelain', (_, stdout) => {
  const gitStatus = stdout.split('\n');
  gitStatus.pop();
  if (gitStatus.length > 0) {
    isClean = false;
    console.log(chalk.red.underline('Please, commit all changes before bumping.'));
    process.exit();
  }
  isClean = true;
});

// Trigger the rigth version upgrade
if (args[0].includes(argument)) {
  exec('npm version patch', errorHandler);
} else if (args[1].includes(argument)) {
  exec('npm version minor', errorHandler);
} else if (args[2].includes(argument)) {
  exec('npm version major', errorHandler);
}

// Handle async with condition to avoid push being trigger before the end of git status
if (isClean) {
  exec('git push && git push --tags', errorHandler);
  // eslint-disable-next-line global-require
  console.log(`Version successfully bumped to ${require('../package.json').version}`);
  process.exit();
}
