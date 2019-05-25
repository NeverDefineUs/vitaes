const getHostname = (target, port) => {
  if (process.env.K8S) {
    return `${target}.k8s.vitaes.io`;
  }

  if (process.env.NODE_ENV === 'development') {
    return `localhost:${port}`;
  }

  return `${target}.vitaes.io`;
};


// TODO get data from ENV
export const getApiHostname = () => getHostname('api', 6001);

export const getLoggerHostname = () => getHostname('logger', 6002);
