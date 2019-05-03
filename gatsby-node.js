exports.onCreateNode = require('./gatsby/onCreateNode');

exports.createPages = require('./gatsby/CreatePages');

exports.onCreateWebpackConfig = require('./gatsby/onCreateWebpackConfig');

exports.modifyWebpackConfig = ({ config, stage }) => {
  const timestamp = Date.now();
  if (stage === 'build-javascript') {
    config.merge({
      output: {
        filename: `[name]-${timestamp}-[chunkhash].js`,
        chunkFilename: `[name]-${timestamp}-[chunkhash].js`,
      },
    });
  }

  return config;
};
