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

  try {
    new URL(url);
  } catch {
    return res.status(400).json({
      error: "Please enter a valid URL."
    });
  }

  try {
    const response = await fetch("https://gendownload.com/api/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json({
        error: data.error || "Unable to extract this video."
      });
    }

    if (!data.formats || data.formats.length === 0) {
      return res.status(404).json({
        error: "No downloadable video formats were found."
      });
    }

    const formats = data.formats
      .filter(format => format.type === "video")
      .map(format => ({
        label: format.label || "Video",
        extension: format.ext || "mp4",
        filesize: format.filesize || null,
        url: format.url
      }));

    return res.status(200).json({
      success: true,
      title: data.title || "Video",
      thumbnail: data.thumbnail || null,
      duration: data.duration || null,
      source: data.source || null,
      author: data.author || null,
      formats
    });

  } catch (error) {
    return res.status(500).json({
      error: "The video could not be processed right now."
    });
  }
      }
