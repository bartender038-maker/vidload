export default function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({
      error: "URL is required."
    });
  }

  let videoUrl;

  try {
    videoUrl = new URL(url);
  } catch {
    return res.status(400).json({
      error: "Invalid URL."
    });
  }

  if (!["http:", "https:"].includes(videoUrl.protocol)) {
    return res.status(400).json({
      error: "Only HTTP and HTTPS links are supported."
    });
  }

  const match = videoUrl.pathname
    .toLowerCase()
    .match(/\.(mp4|webm|mov|m4v|ogv|ogg)$/);

  if (!match) {
    return res.status(400).json({
      error:
        "Use a direct public video file ending in .mp4, .webm, .mov, .m4v, .ogv or .ogg."
    });
  }

  const filename =
    decodeURIComponent(videoUrl.pathname.split("/").pop() || "video.mp4");

  const title = filename
    .replace(/\.[^.]+$/, "")
    .replace(/[-_]+/g, " ");

  return res.status(200).json({
    title,
    format: match[1].toUpperCase(),
    host: videoUrl.hostname,
    downloadUrl: videoUrl.toString()
  });
}
