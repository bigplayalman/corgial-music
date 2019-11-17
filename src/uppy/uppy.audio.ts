import Uppy from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import ms from "ms";
let uppy: Uppy.Uppy;

const _create = () => {
  const upload = Uppy({
    id: "corgial-audio",
    autoProceed: true,
    debug: true,
    restrictions: {
      maxNumberOfFiles: 10,
      allowedFileTypes: [".mp3", ".flac"]
    }
  });
  upload.use(AwsS3, {
    limit: 10,
    timeout: ms("1 minute"),
    companionUrl: "http://localhost:3300"
  });
  const plugin: any = upload.getPlugin("XHRUpload");
  plugin.opts.limit = 10;
  return upload;
};

export const get = () => {
  if (!uppy)
  uppy = _create();
  return uppy;
};
