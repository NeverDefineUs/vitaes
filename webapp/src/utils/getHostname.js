import isLocalhost from './isLocalHost'

const getHostname = (target, port) => {
  if (isLocalhost()) {
    return `localhost:${port}`;
  }

  return `${target}.vitaes.io`;
};


// TODO get data from ENV
export const getApiHostname = () => getHostname('api', 6001);

export const getLoggerHostname = () => getHostname('logger', 6002);

export const getStorageHostname = () => getHostname('storage', 6003);
