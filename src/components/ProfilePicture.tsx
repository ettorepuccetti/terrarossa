import { Avatar, Box } from "@mui/material";
import { useState } from "react";
import { useGetSignedUrl, useUpdateImageSrc, useUserQuery } from "./Profile";

export default function ProfilePicture() {
  const userQuery = useUserQuery();
  const getSignedUrl = useGetSignedUrl();
  const updateImageSrc = useUpdateImageSrc();

  const [file, setFile] = useState<File>();

  async function handleUpload() {
    if (!file) {
      return;
    }
    const formData = new FormData();
    formData.append("image", file);
    const { url: presignedUrl } = await getSignedUrl.mutateAsync();
    await fetch(presignedUrl, {
      method: "PUT",
      body: formData.get("image"),
    });
    await updateImageSrc.mutateAsync();
    userQuery.remove();
    await userQuery.refetch();
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
    }
  }

  if (userQuery.isLoading || userQuery.isRefetching) {
    return "loading...";
  }

  if (userQuery.isError) {
    return "error";
  }

  return (
    <>
      <Avatar
        src={userQuery.data.image ?? undefined}
        sx={{ width: 70, height: 70 }}
      />
      <Box display={"flex"} alignItems={"center"}>
        <input
          type="file"
          accept="image/*"
          id="file-upload"
          name="file-upload"
          className="sr-only"
          onChange={handleFileChange}
        />
        <button onClick={() => void handleUpload()} disabled={!file}>
          Upload Image
        </button>
      </Box>
    </>
  );
}
