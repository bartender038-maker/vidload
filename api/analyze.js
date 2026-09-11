export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({
      error: "Please enter a video URL."
    });
  }

  let parsed;

  try {
    parsed = new URL(url);
  } catch {
    return res.status(400).json({
      error: "Please enter a valid URL."
    });
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return res.status(400).json({
      error: "Only public HTTP/HTTPS URLs are supported."
    });
  }

  const hostname = parsed.hostname.toLowerCase();

  const blockedHosts = [
    "localhost",
    "127.0.0.1",
    "0.0.0.0"
  ];

  if (blockedHosts.includes(hostname)) {
    return res.status(400).json({
      error: "That URL cannot be processed."
    });
  }

  const extensionMatch = parsed.pathname
    .toLowerCase()
    .match(/\.(mp4|webm|mov|m4v|ogv|ogg)(?:$|\?)/);

  if (!extensionMatch) {
    return res.status(400).json({
      error:
        "This link is not a direct video file. Direct video links such as .mp4 or .webm are currently supported."
    });
  }

  const extension = extensionMatch[1].toUpperCase();

  let filename = decodeURIComponent(
    parsed.pathname.split("/").pop() || "video"
  );

  filename = filename.replace(/\.[^.]+$/, "");

  filename = filename
    .replace(/[-_]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!filename) {
    filename = "Video";
  }

  return res.status(200).json({
    success: true,
    title: filename,
    format: extension,
    host: parsed.hostname,
    downloadUrl: parsed.toString()
  });
}
