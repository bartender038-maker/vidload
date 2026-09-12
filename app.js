const form = document.querySelector("#form");
const urlInput = document.querySelector("#url");
const button = document.querySelector("#go");
const status = document.querySelector("#status");
const card = document.querySelector("#card");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  const url = urlInput.value.trim();

  if (!url) {
    status.textContent = "Please enter a video link.";
    return;
  }

  button.disabled = true;
  button.textContent = "Extracting...";
  status.textContent = "Finding video...";

  card.classList.add("hidden");

  try {
    const response = await fetch("/api/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ url })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Could not fetch this link.");
    }

    if (!data.formats || data.formats.length === 0) {
      throw new Error("No downloadable video was found.");
    }

    document.querySelector("#name").textContent =
      data.title || "Video";

    document.querySelector("#format").textContent =
      data.formats[0].label || data.formats[0].ext || "Video";

    document.querySelector("#host").textContent =
      data.source || "Video";

    const download = document.querySelector("#download");

    download.href = data.formats[0].url;
    download.target = "_blank";
    download.textContent =
      "Download " + (data.formats[0].label || "");

    card.classList.remove("hidden");

    status.textContent = "Video found.";
  } catch (error) {
    status.textContent =
      error.message || "Could not fetch this link.";
  } finally {
    button.disabled = false;
    button.textContent = "Analyze";
  }
});
