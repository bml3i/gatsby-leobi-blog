import React from 'react';
import PropTypes from 'prop-types';

const HTML = ({
  htmlAttributes,
  headComponents,
  bodyAttributes,
  preBodyComponents,
  body,
  postBodyComponents,
}) => (
  <html {...htmlAttributes} lang="zh">
    <head>
      <meta charSet="utf-8" />
      <meta httpEquiv="x-ua-compatible" content="ie=edge" />
      <meta name="baidu-site-verification" content="codeva-9aEYbTyyrW" />
      <meta
        name="viewport"
        content="width=device-width, initial-scale=1, shrink-to-fit=no"
      />
      {headComponents}
    </head>
    <body {...bodyAttributes}>
      {preBodyComponents}
      <div
        key="body"
        id="___gatsby"
        dangerouslySetInnerHTML={{ __html: body }}
      />
      {postBodyComponents}
      <script
        src="https://code.jquery.com/jquery-3.2.1.slim.min.js"
        integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN"
        crossOrigin="anonymous"
      />
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js"
        integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q"
        crossOrigin="anonymous"
      />
      <script
        src="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/4.6.0/js/bootstrap.min.js"
        integrity="sha512-XKa9Hemdy1Ui3KSGgJdgMyYlUg1gM+QhL6cnlyTe2qzMCYm4nAZ1PsVerQzTTXzonUR+dmswHqgJPuwCq1MaAg=="
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.1/jquery.fancybox.min.css"
      />
      <script src="https://cdnjs.cloudflare.com/ajax/libs/fancybox/3.2.1/jquery.fancybox.min.js" />
    </body>
  </html>
);

HTML.propTypes = {
  htmlAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  headComponents: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  bodyAttributes: PropTypes.object, // eslint-disable-line react/forbid-prop-types
  preBodyComponents: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  body: PropTypes.string,
  postBodyComponents: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
};

HTML.defaultProps = {
  body: '',
  htmlAttributes: {},
  headComponents: null,
  bodyAttributes: {},
  preBodyComponents: null,
  postBodyComponents: null,
};

export default HTML;
