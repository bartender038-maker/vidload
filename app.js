const form = document.querySelector("#form");
const urlInput = document.querySelector("#url");
const button = document.querySelector("#go");
const status = document.querySelector("#status");
const card = document.querySelector("#card");

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  card.classList.add("hidden");

  const url = urlInput.value.trim();

  try {
    new URL(url);
  } catch {
    status.textContent = "Please enter a valid URL.";
    return;
  }

  button.disabled = true;
  button.textContent = "Checking...";
  status.textContent = "Analyzing link...";

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
      throw new Error(data.error);
    }

    document.querySelector("#name").textContent = data.title;
    document.querySelector("#format").textContent = data.format;
    document.querySelector("#host").textContent = data.host;
    document.querySelector("#download").href = data.downloadUrl;

    card.classList.remove("hidden");
    status.textContent = "Ready to download.";
  } catch (error) {
    status.textContent = error.message || "Something went wrong.";
  } finally {
    button.disabled = false;
    button.textContent = "Analyze";
  }
});
