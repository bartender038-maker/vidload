export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Method not allowed"
    });
  }

  const { url } = req.body || {};

  if (!url) {
    return res.status(400).json({
      error: "Please enter a video link."
    });
  }

  try {
    new URL(url);
  } catch {
    return res.status(400).json({
      error: "Please enter a valid video link."
    });
  }

  try {
    const response = await fetch("https://gendownload.com/api/extract", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        url: url
      })
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: data.error || "Could not extract this video."
      });
    }

    const formats = Array.isArray(data.formats)
      ? data.formats
          .filter(format => format && format.url)
          .map(format => ({
            label: format.label || "Download",
            type: format.type || "video",
            ext: format.ext || "mp4",
            filesize: format.filesize || null,
            url: format.url
          }))
      : [];

    if (formats.length === 0) {
      return res.status(404).json({
        error: "No downloadable video was found on this page."
      });
    }

    return res.status(200).json({
      success: true,
      title: data.title || "Video",
      thumbnail: data.thumbnail || null,
      duration: data.duration || null,
      source: data.source || null,
      author: data.author || null,
      formats: formats
    });

  } catch (error) {
    return res.status(500).json({
      error: "The video extraction service could not be reached."
    });
  }
          }
