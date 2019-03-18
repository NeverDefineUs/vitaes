import copyElement from './copyElement';

export default function removeDisabled(rawCv) {
  const cv = copyElement(rawCv);
  Object.keys(cv).forEach((key) => {
    if (Array.isArray(cv[key])) {
      cv[key] = cv[key].filter(element => !element.disable);
      cv[key] = cv[key].map((element) => {
        let elementCopy = copyElement(element);
        elementCopy.disable = true;
        delete elementCopy.disable;
        return elementCopy;
      });
    }
  });

  return cv;
}
