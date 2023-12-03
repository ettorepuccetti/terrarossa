import AddAPhotoIcon from "@mui/icons-material/AddAPhoto";
import { Avatar, Box, IconButton, styled } from "@mui/material";
import { useReducer } from "react";
import { useMergedStoreContext } from "~/hooks/useCalendarStoreContext";
import { useLogger } from "~/utils/logger";

export default function ProfilePicture() {
  const logger = useLogger({ component: "ProfilePicture" });
  const [forceUpdateCounter, forceUpdate] = useReducer((x: number) => x + 1, 0);
  const userData = useMergedStoreContext((store) => store.getUserData());
  const getSignedUrl = useMergedStoreContext((store) =>
    store.getGetSignedUrl(),
  );
  const updateImageSrc = useMergedStoreContext((store) =>
    store.getUpdateImageSrc(),
  );

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file: File | undefined = e.target.files?.[0];
    if (!file) {
      return;
    }
    logger.info(
      { fileName: file.name, fileSize: file.size, fileType: file.type },
      "uploading image",
    );
    const formData = new FormData();
    formData.append("image", file);

    // get presigned url from server
    const presignedUrl = await getSignedUrl.mutateAsync();

    // upload image to cloudflare R2
    await fetch(presignedUrl, {
      method: "PUT",
      body: formData.get("image"),
    });

    // update user info in db
    await updateImageSrc.mutateAsync();

    // force update to refresh avatar
    forceUpdate();
  }

  return (
    <>
      <Box position={"relative"}>
        <Avatar
          src={userData.image ?? undefined}
          sx={{ width: 120, height: 120 }}
          key={forceUpdateCounter}
        />
        <IconButton
          data-test="upload-image-button"
          component="label"
          sx={{ position: "absolute", bottom: -15, right: -20 }}
        >
          <AddAPhotoIcon />
          <VisuallyHiddenInput
            data-test="upload-image-input"
            type="file"
            accept="image/*"
            id="file-upload"
            name="file-upload"
            className="sr-only"
            onChange={(e) => void handleUpload(e)}
          />{" "}
        </IconButton>
      </Box>
    </>
  );
}

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});
