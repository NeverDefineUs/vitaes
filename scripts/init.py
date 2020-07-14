import os
from vitaes_parser import env

if env == 'production' or env == 'staging':
    print('Setting up in %s environment...' % env)
    print()
    os.system('doctl k8s cluster kubeconfig save vitaes')
    os.system("kubectl config use-context $(doctl k8s cluster kubeconfig show -o text vitaes | grep current-context: | sed -E  's/.*: (.*)/\1/')")
    print()
    print('Setup done for %s environment' % env)
else:
    print('Setting up in development environment...')
    print()
    os.system('docker volume create grafana-volume')
    os.system('docker volume create influxdb-volume')
    os.system('docker volume create log-volume')
    print()
    print('Setup done for development environment')