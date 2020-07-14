import argparse

parser = argparse.ArgumentParser(description='Builds docker images.')
parser.add_argument('-p', '--prod', action='store_true')
parser.add_argument('-s', '--staging', action='store_true')
args = parser.parse_args()

if args.prod:
    env = 'production'
elif args.staging:
    env = 'staging'
else:
    env = 'development'
