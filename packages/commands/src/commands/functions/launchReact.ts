import chalk from 'chalk';
import shell from 'shelljs';

import { processUnknownArgs } from './processUnknownArgs';

import { load, printConfig } from '~/helpers/configManager';

export const startReact = (args: string[]): void => {
  const config = load();
  printConfig(config);
  const passthroughArgs = processUnknownArgs(args);

  if (config.build.reactBuild === 'nextjs') {
    shell.exec('yarn workspace @targecy/webapp dev' + passthroughArgs);
  } else {
    console.log(chalk.red('❌ Error! Invalid react build tool in config!'));
  }
};

export const buildReact = (args: string[]): void => {
  const config = load();
  printConfig(config);
  const passthroughArgs = processUnknownArgs(args);

  if (config.build.reactBuild === 'nextjs') {
    shell.exec('yarn workspace @targecy/webapp build' + passthroughArgs);
  } else {
    console.log(chalk.red('❌ Error! Invalid solidity toolkit in config!'));
  }
};
