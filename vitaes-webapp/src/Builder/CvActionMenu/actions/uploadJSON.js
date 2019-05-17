

export default function uploadJSON(selectorFiles, callback) {
  const fr = new FileReader();
  // eslint-disable-next-line func-names
  fr.onload = function () {
    const json = fr.result;
    callback(JSON.parse(json));
  };
  fr.readAsText(selectorFiles[0]);
}
