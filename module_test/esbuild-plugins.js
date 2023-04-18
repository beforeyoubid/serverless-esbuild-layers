const { nodeExternalsPlugin } = require('esbuild-node-externals');
const { default: graphqlLoaderPlugin } = require('@luckycatfactory/esbuild-graphql-loader');

module.exports = [nodeExternalsPlugin(), graphqlLoaderPlugin()];
