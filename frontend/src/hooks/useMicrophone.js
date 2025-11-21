export function useMicrophone() {
  let mediaRecorder;
  let chunks = [];

  async function startRecording() {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder = new MediaRecorder(stream);

    mediaRecorder.ondataavailable = e => chunks.push(e.data);

    mediaRecorder.start();
  }

  function stopRecording() {
    return new Promise(resolve => {
      mediaRecorder.onstop = () => {
        const blob = new Blob(chunks, { type: "audio/wav" });
        chunks = [];
        resolve(blob);
      };
      mediaRecorder.stop();
    });
  }

  return { startRecording, stopRecording };
}
