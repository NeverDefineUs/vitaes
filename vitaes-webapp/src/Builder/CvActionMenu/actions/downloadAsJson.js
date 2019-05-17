
export default function downloadCvAsJson(userData) {
  const element = document.createElement('a');
  const file = new Blob([JSON.stringify(userData.cv)], {
    type: 'text/plain',
  });
  element.href = URL.createObjectURL(file);
  element.download = 'cv.json';
  element.click();
}
