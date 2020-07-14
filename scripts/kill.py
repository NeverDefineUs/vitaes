import os
from vitaes_parser import env

if env == 'production' or env == 'staging':
    print('Stopping services in %s environment...' % env)
    print()
    os.system('kubectl delete ingress --all')
    os.system('kubectl delete deployment --namespace kube-system renderer-autoscaler')
    os.system('kubectl delete deployment --all')
    os.system('kubectl delete pod --all')
    os.system('kubectl delete service --all')
    print()
    print('Services stopped in %s environment' % env)
else:
    print('Stopping services in development environment...')
    print()
    os.system('docker-compose down')
    print()
    print('Services stopped in development environment')