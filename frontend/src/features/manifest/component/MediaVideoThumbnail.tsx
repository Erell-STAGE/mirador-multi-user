import { Box, Grid } from "@mui/material";
import { useRef } from "react";
import { MediaField } from "./ManifestCreationForm";

interface MediaVideoThumbnailProps {
  media?: MediaField;
  setMedia?: (media: MediaField) => void;
  thumbnail?: string;
}

export function MediaVideoThumbnail({
  media,
  setMedia,
  thumbnail
}: MediaVideoThumbnailProps) {
  const handleLoadedMetadata = () => {
    const video = videoEl.current;
    if (!video) return;
    media && setMedia && setMedia({
      ...media,
      duration: video.duration!,
      height: video.videoHeight!,
      width: video.videoWidth!,
    });
  };

  const videoEl = useRef<HTMLVideoElement | null>(null);

  const thumbnailUrl = media ? media.thumbnailUrl : thumbnail;
  const value = media ? media.value : thumbnail;

  return (
    <Grid>
      {thumbnailUrl && (
        <Box
          component="img"
          src={thumbnailUrl}
          loading="lazy"
          sx={{
            width: 200,
            height: 50,
            objectFit: "cover",
            "@media(min-resolution: 2dppx)": {
              width: 100,
              height: 100,
            },
          }}
        />
      )}
      {!thumbnailUrl && (
        <video
          width="200"
          ref={videoEl}
          src={value}
          controls
          onLoadedMetadata={handleLoadedMetadata}
        />
      )}
    </Grid>
  );
}
