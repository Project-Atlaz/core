/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable @typescript-eslint/no-unused-expressions */
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { analyzeProject } from '../parser';
import { log } from './logger';
import fs from 'node:fs';
import path from 'node:path';

yargs(hideBin(process.argv))
  .command(
    'analyze <projectPath>',
    'Analyzes a TypeScript project to build a dependency graph',
    (yargs) => {
      return yargs.positional('projectPath', {
        describe: 'The path to the project to analyze',
        type: 'string',
        demandOption: true,
      });
    },
    async (argv) => {
      log.info(`Starting analysis for project at: ${argv.projectPath}`);

      try {
        const graph = analyzeProject(argv.projectPath);
        const outputFileName = 'analysis-report.json';
        const outputPath = path.resolve(process.cwd(), outputFileName);

        fs.writeFileSync(outputPath, JSON.stringify(graph, null, 2));

        log.success(`Analysis complete!`);
        log.success(`Report saved to: ${outputPath}`);
      } catch (error) {
        log.error(`An error occurred during analysis: ${error}`);
        process.exit(1);
      }
    },
  )
  .demandCommand(1, 'You need to specify a command.')
  .help().argv;
