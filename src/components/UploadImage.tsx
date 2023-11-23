import { useState } from "react";
import { api } from "~/utils/api";

export default function UploadImage() {
  const [file, setFile] = useState<File>();
  const uploadImage = api.user.uploadImage.useMutation();

  async function handleUpload() {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    const { url } = await uploadImage.mutateAsync({ filename: file.name });
    await fetch(url, {
      method: "PUT",
      body: formData.get("image"),
    });
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  }
  return (
    <>
      <input
        type="file"
        accept="image/*"
        id="file-upload"
        name="file-upload"
        className="sr-only"
        onChange={handleFileChange}
      />
      <button onClick={() => void handleUpload()}>Upload Image</button>
    </>
  );
}
