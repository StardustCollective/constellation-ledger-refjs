'use strict';

const get = async (config, path) => {
  /* istanbul ignore if */
  if (config == undefined) {
    throw Error( 'config is a required parameter.' );
  }
  /* istanbul ignore if */
  if (config.http == undefined) {
    throw Error( 'config.http is a required parameter.' );
  }
  /* istanbul ignore if */
  if (path == undefined) {
    throw Error( 'path is a required parameter.' );
  }
  return new Promise((resolve) => {
    const options = {
      method: 'GET',
      hostname: config.hostname,
      path: path,
      port: config.port,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    };
    /* istanbul ignore if */
    if (config.debug) {
      console.log('get path', path);
      console.log('curl', 'http://' + config.hostname + ':' + config.port + path);
    }

    const req = config.http.request(options, (res) => {
      let chunks = '';
      res.on('data', (chunk) => {
        /* istanbul ignore if */
        if (config.debug) {
          console.log('get data', chunk.toString('utf8'));
        }
        if (chunk != 'null') {
          chunks += chunk;
        }
      });

      res.on('end', () => {
        /* istanbul ignore if */
        if (config.debug) {
          console.log('get end', chunks);
        }
        if (chunks.length == 0) {
          resolve({});
        } else {
          /* istanbul ignore if */
          if (config.debug) {
            console.log('get chunks', chunks);
          }
          const json = JSON.parse(chunks);
          resolve(json);
        }
      });
    });

    req.on('error', (error) => {
      console.log('get error', error);
    });

    req.end();
  });
};

const post = async (config, path, formData) => {
  if (formData == undefined) {
    throw Error(`'formData' is a required parameter.`);
  }
  return new Promise((resolve) => {
    const body = JSON.stringify(formData);

    const options = {
      method: 'POST',
      hostname: config.hostname,
      path: path,
      port: config.port,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      timeout: 30000,
    };

    /* istanbul ignore if */
    if (config.debug) {
      console.log('post path', path);
      console.log('curl ', 'http://' + config.hostname + ':' + config.port + path, `-X POST -H 'Content-Type: application/json' -H 'Accept:application/json' --data '${body}'`);
    }

    const req = config.http.request(options, (res) => {
      let chunks = '';
      res.on('data', (chunk) => {
        /* istanbul ignore if */
        if (config.debug) {
          console.log('post data', chunk);
        }
        if (chunk != null) {
          chunks += chunk;
        }
      });

      res.on('end', (chunk) => {
        /* istanbul ignore if */
        if (config.debug) {
          console.log('post end chunk', chunk);
          console.log('post end chunks', chunks.length, chunks);
        }
        resolve(chunks);
      });
    });

    // req.on('socket', (message) => {
    //   console.log('post socket', message);
    // });

    req.on('response', (response) => {
      /* istanbul ignore if */
      if (config.debug) {
        console.log('post response', response.statusCode, response.statusMessage);
      }
    });

    // req.on('close', (message) => {
    //   console.log('post close', message);
    // });

    req.on('error', (message) => {
      console.log('post error', message);
    });

    /* istanbul ignore if */
    if (config.debug) {
      console.log('post body', body);
    }

    req.write(body);
    req.end();
  });
};

exports.get = get;
exports.post = post;
