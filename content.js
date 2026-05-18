// A simplified YouTube playback speed automation script that forces selected video categories 
// to always play at 1x speed. It detects video changes, uses the YouTube API for category detection, and 
// continuously enforces normal playback speed for targeted categories while leaving all other videos unchanged.



console.log("🚀 Smart YouTube Speed Loaded");

// 🎯 Categories that should play at 1x
const ONE_X_CATEGORIES = ["1", "10", "18", "23", "30", "34", "44"];

let lastUrl = location.href;
let hasRun = false;
let cache = {};
let activeVideoId = null; //  Tracks current video

// 🔄 Detect video change (SPA)
new MutationObserver(() => {
    if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log("🔄 Video changed");

        hasRun = false;
        init();
    }
}).observe(document, { subtree: true, childList: true });

// ⏳ Wait until video is stable
function waitForStableVideo(callback) {
    const interval = setInterval(() => {
        const video = document.querySelector('video');
        const title = document.querySelector('h1.ytd-watch-metadata');

        if (video && title && video.readyState >= 2) {
            clearInterval(interval);
            callback(video);
        }
    }, 500);
}

// 🧠 Get Title
function getTitle() {
    const domTitle = document.querySelector('h1.ytd-watch-metadata')?.innerText;
    if (domTitle) return domTitle;

    return document.title
        .replace(/^\u25B6\s/, "")
        .replace(/\s-\sYouTube$/, "");
}

// 🧠 Get Channel
function getChannel(callback) {
    const interval = setInterval(() => {
        const el = document.querySelector('ytd-channel-name a');
        if (el) {
            clearInterval(interval);
            callback(el.innerText);
        }
    }, 300);
}

// 🎯 Extract Video ID
function getVideoId() {
    const url = new URL(window.location.href);
    return url.searchParams.get("v");
}

// 📡 API with caching
async function isOneXCategory(videoId) {
    if (cache[videoId] !== undefined) {
        console.log("⚡ Cache hit");
        return cache[videoId];
    }

    const API_KEY = "Please_use_your_APT_KEY"; //  Replace this with your own

    try {
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
        );

        const data = await res.json();
        const categoryId = data.items?.[0]?.snippet?.categoryId;

        const result = ONE_X_CATEGORIES.includes(categoryId);
        cache[videoId] = result;

        console.log("🎯 Category:", categoryId, "| Force 1x:", result);

        return result;
    } catch (err) {
        console.log("❌ API Error:", err);
        return false;
    }
}

// ⚡ Apply speed (ONLY for allowed categories)
function applySpeed(video, shouldBeOneX) {
    if (!shouldBeOneX) {
        console.log("⚡ Not target category → no change");
        return;
    }

    if (video.playbackRate !== 1) {
        video.playbackRate = 1;
        console.log("🎯 Forced 1x");
    }

    if (video.currentTime > 2) {
        video.currentTime = 0;
        console.log("🔄 Video restarted");
    }

    video.play();
}

// 🔁 Enforce correctly (NO leakage)
function enforceSpeed(video, shouldBeOneX) {
    // 🧹 Clear old listeners ALWAYS
    video.onplay = null;
    video.onratechange = null;

    if (!shouldBeOneX) {
        console.log("🧹 Cleared enforcement (not target)");
        return;
    }

    const enforce = () => {
        const currentId = getVideoId();

        if (currentId !== activeVideoId) return;

        if (video.playbackRate !== 1) {
            video.playbackRate = 1;
            console.log("🔁 Enforced 1x (correct video only)");
        }
    };

    video.onplay = enforce;
    video.onratechange = enforce;
}

// 🎯 Main logic
function processVideo(video) {
    if (hasRun) return;
    hasRun = true;

    const title = getTitle();

    getChannel(async (channel) => {
        const videoId = getVideoId();
        activeVideoId = videoId; //  Set current video

        console.log("📊 VIDEO:", { title, channel, videoId });

        const shouldBeOneX = await isOneXCategory(videoId);

        applySpeed(video, shouldBeOneX);

        enforceSpeed(video, shouldBeOneX);
    });
}

// 🚀 Init
function init() {
    waitForStableVideo((video) => {
        console.log("✅ Stable video ready");
        processVideo(video);
    });
}

// 🚀 Start
init();
