function log({ text, metadata } = { text: 'default', metadata: undefined }) {
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line global-require
    const { Logging } = require('@google-cloud/logging');

    const gcpLog = new Logging({ projectId: 'nomadic-library-264607' });

    const logger = gcpLog.log('nomadic-library-api');

    const entry = logger.entry({ text, metadata });
    logger.write(entry);
  } else {
    // eslint-disable-next-line no-console
    console.log(text, metadata);
  }
}

function error(err, metadata) {
  if (process.env.NODE_ENV === 'production') {
    // eslint-disable-next-line global-require
    const { ErrorReporting } = require('@google-cloud/error-reporting');

    const gcpError = new ErrorReporting({ reportMode: 'always' });

    gcpError.report(err);
  } else {
    log({ text: 'error', metadata: { err, ...metadata } });
  }
}

module.exports = { log, error };
