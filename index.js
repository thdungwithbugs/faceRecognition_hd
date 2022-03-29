const faceScanned = document.querySelector("#loadFaceToScan");
const scanFaceApi = async () => {
  try {
    await faceapi.nets.faceLandmark68Net.loadFromUri("./models");
    await faceapi.nets.faceRecognitionNet.loadFromUri("./models");
    await faceapi.nets.tinyFaceDetector.loadFromUri("./models");
    await faceapi.nets.faceExpressionNet.loadFromUri("./models");
  } catch (error) {
    console.log(error.response.data);
  }
};

function getCamResult() {
  if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: {} }).then((stream) => {
      faceScanned.srcObject = stream;
    });
  }
}
faceScanned.addEventListener(
  "playing",
  () => {
    const scanCanvas = faceapi.createCanvasFromMedia(faceScanned);
    document.body.append(scanCanvas);
    const displaySize = {
      width: faceScanned.videoWidth,
      height: faceScanned.videoHeight,
    };
    setInterval(async () => {
      try {
        const detects = await faceapi
          .detectAllFaces(faceScanned, new faceapi.TinyFaceDetectorOptions())
          .withFaceLandmarks()
          .withFaceExpressions();
        //   console.log(detects);
        const resizedDetects = faceapi.resizeResults(detects, displaySize);
        scanCanvas
          .getContext("2d")
          .clearRect(0, 0, displaySize.width, displaySize.height);
        faceapi.draw.drawDetections(scanCanvas, resizedDetects);
        faceapi.draw.drawFaceLandmarks(scanCanvas, resizedDetects);
        faceapi.draw.drawFaceExpressions(scanCanvas, resizedDetects);
      } catch (error) {
        console.log(error.response.data);
      }
    });
  },
  300
);
scanFaceApi().then(getCamResult);
