import axios from "axios";

export async function uploadVideo(blob) {
  const formData = new FormData();
  formData.append("video", blob, "interview.webm");

  const res = await axios.post("http://localhost:4000/api/interview/upload-video", formData);
  return res.data;
}
