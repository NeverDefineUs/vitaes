import _ from 'lodash';

export default function removeDisabled(rawCv) {
  const cv = _.cloneDeep(rawCv);
  Object.keys(cv).forEach((key) => {
    if (Array.isArray(cv[key])) {
      cv[key] = cv[key].filter(element => !element.disable);
      cv[key] = cv[key].map((element) => {
        const elementCopy = _.cloneDeep(element);
        elementCopy.disable = true;
        delete elementCopy.disable;
        return elementCopy;
      });
    }
  });

  return cv;
}
