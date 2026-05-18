// Script 1x and 2x:
// An advanced YouTube playback speed automation script that detects video categories using the YouTube API and 
// automatically applies different playback speeds (such as 1x or 2x) based on the category. It supports caching, 
// SPA navigation detection, automatic enforcement of playback speed, and dynamic speed control for different types of content.



console.log("🚀 Smart YouTube Speed Loaded");

// 🎯 Category rules
const ONE_X_CATEGORIES = ["1", "10", "18", "23", "30", "34", "44"];
const TWO_X_CATEGORIES = ["2", "17", "20", "25", "27","28"];

let lastUrl = location.href;
let hasRun = false;
let cache = {};
let activeVideoId = null;

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
        const video = document.querySelector("video");
        const title = document.querySelector("h1.ytd-watch-metadata");

        if (video && title && video.readyState >= 2) {
            clearInterval(interval);
            callback(video);
        }
    }, 500);
}

// 🧠 Get Title
function getTitle() {
    const domTitle = document.querySelector("h1.ytd-watch-metadata")?.innerText;
    if (domTitle) return domTitle;

    return document.title
        .replace(/^\u25B6\s/, "")
        .replace(/\s-\sYouTube$/, "");
}

// 🧠 Get Channel
function getChannel(callback) {
    const interval = setInterval(() => {
        const el = document.querySelector("ytd-channel-name a");
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

// 📡 API → returns SPEED
async function getTargetSpeed(videoId) {
    if (cache[videoId] !== undefined) {
        console.log("⚡ Cache hit");
        return cache[videoId];
    }
    const API_KEY = "AIzaSyBWafm0ZKuJYAZymXlatNW8wGsIxg-YQMQ"; 

    try {
        const res = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`
        );

        const data = await res.json();
        const categoryId = data.items?.[0]?.snippet?.categoryId;

        let speed = null;

        if (ONE_X_CATEGORIES.includes(categoryId)) {
            speed = 1;
        } else if (TWO_X_CATEGORIES.includes(categoryId)) {
            speed = 2;
        }

        cache[videoId] = speed;

        console.log("🎯 Category:", categoryId, "| Speed:", speed);

        return speed;
    } catch (err) {
        console.log("❌ API Error:", err);
        return null;
    }
}

// ⚡ Apply speed
function applySpeed(video, targetSpeed) {
    if (!targetSpeed) {
        console.log("⚡ No target speed → no change");
        return;
    }

    if (video.playbackRate !== targetSpeed) {
        video.playbackRate = targetSpeed;
        console.log(`🎯 Forced ${targetSpeed}x`);
    }

    if (video.currentTime > 2) {
        video.currentTime = 0;
        console.log("🔄 Video restarted");
    }

    video.play();
}

// 🔁 Enforce correctly (NO leakage)
function enforceSpeed(video, targetSpeed) {
    // 🧹 Always clear old handlers
    video.onplay = null;
    video.onratechange = null;

    if (!targetSpeed) {
        console.log("🧹 Cleared enforcement (no target)");
        return;
    }

    const enforce = () => {
        const currentId = getVideoId();

        if (currentId !== activeVideoId) return;

        if (video.playbackRate !== targetSpeed) {
            video.playbackRate = targetSpeed;
            console.log(`🔁 Enforced ${targetSpeed}x`);
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
        activeVideoId = videoId;

        console.log("📊 VIDEO:", { title, channel, videoId });

        const targetSpeed = await getTargetSpeed(videoId);

        applySpeed(video, targetSpeed);
        enforceSpeed(video, targetSpeed);
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