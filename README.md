# Smart YouTube Speed

I got tired of constantly changing YouTube playback speed every time I switched between educational videos, songs, trailers, movies, or comedy content.

Most of the time, I prefer watching videos at higher speeds like **2x**, especially for learning content. But some categories — like music, trailers, movies, and entertainment — simply feel better at normal speed.

So I built this extension.

**Smart YouTube Speed** automatically keeps selected YouTube categories locked at **1x playback speed**, while leaving everything else untouched.

This repository is meant to demonstrate the idea and implementation behind category-aware playback control on YouTube.

---

## ✨ Features

* 🎯 Detects YouTube video categories automatically
* ⚡ Forces selected categories to stay at **1x**
* 🔄 Works seamlessly with YouTube SPA navigation
* 🧠 Uses caching to reduce API requests
* 🪶 Lightweight and fast

---

## 📂 Current 1x Categories

The extension currently locks these categories to **1x playback speed**:

| Category         | ID |
| ---------------- | -- |
| Film & Animation | 1  |
| Music            | 10 |
| Short Movies     | 18 |
| Comedy           | 23 |
| Movies           | 30 |
| Trailers         | 44 |

All other videos remain untouched.

---

## 🛠️ Want to Add More Categories?

You can easily customize the extension.

Simply:

1. Check YouTube category IDs from the YouTube API documentation
2. Add them into:

```js id="hww25y"
const ONE_X_CATEGORIES = [ ... ]
```

YouTube category reference:

[YouTube Video Categories Documentation](https://developers.google.com/youtube/v3/docs/videoCategories/list?utm_source=chatgpt.com)

This makes the extension highly customizable based on personal viewing preferences.

---

## 🚀 More Advanced Versions

This repository contains the simplified public version focused on **1x category enforcement**.

I also built:

* a more advanced version with **multiple category-based playback speeds**
* a highly optimized private version with additional logic and smarter handling

This public version is mainly intended to:

* demonstrate the concept
* show what can be built using the YouTube API
* provide a clean starting point for customization

---

## 🛠️ Installation

### 1. Clone the repository

```bash id="x9j9v4"
git clone https://github.com/YOUR_USERNAME/smart-youtube-speed.git
```

---

### 2. Create API configuration


Add your YouTube Data API v3 key:

```js id="wvhcwy"
const API_KEY = "YOUR_YOUTUBE_API_KEY";
```

---

### 3. Load the extension in Chrome

Open:

```txt id="5z0bhs"
chrome://extensions
```

Then:

* Enable **Developer Mode**
* Click **Load unpacked**
* Select the project folder

---

## 🔑 Getting a YouTube API Key

1. Open:

   [Google Cloud Console](https://console.cloud.google.com/?utm_source=chatgpt.com)

2. Create a project

3. Enable:

   * **YouTube Data API v3**

4. Generate an API key

5. Paste it in the context.js

## ⚙️ How It Works

The extension:

1. Detects when a YouTube video changes
2. Extracts the video ID
3. Fetches the video category using the YouTube API
4. Checks whether the category should stay at 1x
5. Automatically enforces normal playback speed

It also continuously prevents accidental speed changes while watching targeted content, so if you want to keep everything as normal please remove the extension.

---

## 📌 Notes

* Only affects selected categories
* Does not modify unrelated videos
* Runs entirely in-browser
* No tracking
* No external servers

---

## ⭐ Contributing

Suggestions, ideas, and improvements are always welcome.

---

## 📜 License

MIT License
