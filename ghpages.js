/**
 * @license
 * Copyright 2020 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * @fileoverview A 'build' script for Blockly extension packages.
 * This script:
 *   - Uses webpack to build the src directory in development mode if no
 *   additional arguments are passed.
 *   - Uses webpack to build the src directory in production mode if
 *   ``blockly-scripts build prod`` is called.
 * @author samelh@google.com (Sam El-Husseini)
 */

'use strict';

const path = require('path');
const fs = require('fs');

const webpack = require('webpack');
const webpackConfig =
    require('./node_modules/@blockly/dev-scripts/config/webpack.config');

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = (relativePath) => path.resolve(appDirectory, relativePath);

const packageJson = require(resolveApp('package.json'));
console.log(`Running production build for ${packageJson.name}`);

// Create the webpack configuration for based on the build environment.
const args = process.argv.slice(2);
const skipLint = args.includes('--skip-lint');
const config = webpackConfig({
  mode: 'development',
  skipLint: skipLint,
});


// Create and run the webpack compiler.
webpack(config, (err, stats) => {
  if (err) {
    console.error(err.stack || err);
    if (err.details) {
      console.error(err.details);
    }
    return;
  }
  console.log(stats.toString({
    chunks: false, // Makes the build much quieter
    colors: true, // Shows colors in the console
  }));
});
