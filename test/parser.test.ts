/* eslint-disable @typescript-eslint/no-require-imports */
import { analyzeProject } from '../src/parser';
import { vol } from 'memfs';

jest.mock('fs', () => {
  const fs = jest.requireActual('fs');
  return { ...fs, ...require('memfs').fs };
});

describe('analyzeProject', () => {
  beforeAll(() => {
    vol.fromJSON({
      'src/app.ts': `
                import {doSomething} from './utils/helpers'
                import {Config} from '@shared/config'

                export class MainApp {
                    constructor(private config: Config) {}
                }
            `,
      'src/utils/helpers.ts': `
                export function doSomething() {
                    console.log('doing something...')
                }
            `,
      'src/index.ts': `
                import {MainApp} from './app'
                import {someFunction} from '@third-party/library'
                import * as path from 'path'

                const app = new MainApp()
            `,
      'package.json': `{"name": "test-project"}`,
    });
  });

  afterAll(() => {
    vol.reset();
  });

  test('should correctly parse module dependencies', () => {
    const result = analyzeProject('src');

    expect(result).toBeDefined();
    expect(result['src/index.ts'].dependencies).toContain('src/app.ts');
    expect(result['src/app.ts'].dependencies).toContain('src/utils/helpers.ts');
    expect(result['src/app.ts'].dependencies).toContain('@shared/config');
  });

  test('should not include built-in Node.js modules as dependencies', () => {
    const result = analyzeProject('src');
    expect(result['src/index.ts'].dependencies).not.toContain('path');
  });

  test('should correctly list exported symbols', () => {
    const result = analyzeProject('src');
    expect(result['src/utils/helpers.ts'].exports).toContain('doSomething');
    expect(result['src/app.ts'].exports).toContain('MainApp');
  });
});
