exports.onCreateNode = require('./gatsby/onCreateNode');

exports.createPages = require('./gatsby/CreatePages');

exports.onCreateWebpackConfig = require('./gatsby/onCreateWebpackConfig');

exports.onCreateWebpackConfig = ({ stage, getConfig, actions }) => {
  if (stage === 'build-javascript') {
    const timestamp = Date.now();
    const config = getConfig();
    config.output.filename = `[name]-${timestamp}-[chunkhash].js`;
    config.output.chunkFilename = `[name]-${timestamp}-[chunkhash].js`;
    actions.replaceWebpackConfig(config);
  }
};
