import json, sys

def get_raw_resources(lang):
  try:
    with open('Resources/' + lang + '.json', encoding='utf-8') as json_file:
      data = json.load(json_file)
      return data
  except:
    return {}


def get_resources(lang):
  resources = get_raw_resources('en')
  resources.update(get_raw_resources(lang))
  return resources
