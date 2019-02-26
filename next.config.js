/* eslint-disable no-param-reassign */
const Dotenv = require('dotenv-webpack');
const path = require('path');

const dedupeDependencies = (dependencies, alias) => (
  dependencies.reduce((res, dependecy) => ({ ...res, [dependecy]: path.resolve(`./node_modules/${dependecy}`) }), alias)
);

const initExport = {
  // eslint-disable-next-line no-unused-vars
  webpack: (config, env) => {
    config.plugins.push(new Dotenv({ path: './.env' }));

    if (process.env.ANALYZE_BUILD) {
      // eslint-disable-next-line global-require
      const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
      config.plugins.push(
        new BundleAnalyzerPlugin({
          analyzerMode: 'server',
          analyzerPort: 8888,
          openAnalyzer: true,
        })
      );
    }
    if (process.env.NODE_ENV === 'alias') {
      config.resolve.alias = dedupeDependencies(
        ['styled-components', 'grommet', 'grommet-icons'], config.resolve.alias
      );
    }
    config.module.rules.push({
      test: /\.(graphql|gql)$/,
      exclude: /node_modules/,
      loader: 'graphql-tag/loader',
    });
    return config;
  },
};

module.exports = initExport;
