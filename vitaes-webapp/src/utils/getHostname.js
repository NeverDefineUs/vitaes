const getHostname = (target, port) => {
  if (process.env.NODE_ENV === 'development') {
    return `localhost:${port}`;
  }
  return `${target}.vitaes.io`;
};


// TODO get data from ENV
export const getApiHostname = () => getHostname('api', 5000);

export const getLoggerHostname = () => getHostname('logger', 8017);
