const canvas = document.getElementById('hero-canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight * 0.7;

let imageList = [];
let currentIndex = 0;
let nextIndex = 1;
let noiseImg = null;
let noiseData = null;
let transitionDuration = 2000;
let displayDuration = 4000;
let startTime = null;
let currentImg, nextImg;

function loadImage(src) {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject(new Error(`画像読み込み失敗: ${src}`));
        img.src = src;
    });
}

async function fetchImages() {
    const res = await fetch('/api/images');
    imageList = await res.json();
    preloadNextSet();
}

async function preloadNextSet() {
    currentImg = await loadImage(imageList[currentIndex]);
    nextImg = await loadImage(imageList[nextIndex]);

    const noiseRes = await fetch('/api/noise-textures');
    const noiseList = await noiseRes.json();
    const randomNoise = noiseList[Math.floor(Math.random() * noiseList.length)];
    noiseImg = await loadImage(randomNoise);

    if (!noiseImg || canvas.width === 0 || canvas.height === 0) {
        console.warn("ノイズ画像またはcanvasのサイズが無効です");
        return;
    }

    prepareNoise();
    startTime = performance.now();
    requestAnimationFrame(drawFrame);
}

function prepareNoise() {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx.drawImage(noiseImg, 0, 0, canvas.width, canvas.height);
    noiseData = tempCtx.getImageData(0, 0, canvas.width, canvas.height).data;
}

function drawFrame(time) {
    const progress = Math.min((time - startTime) / transitionDuration, 1);

    const width = canvas.width;
    const height = canvas.height;

    ctx.clearRect(0, 0, width, height);

    const currentCanvas = document.createElement('canvas');
    currentCanvas.width = width;
    currentCanvas.height = height;
    const currentCtx = currentCanvas.getContext('2d');
    currentCtx.drawImage(currentImg, 0, 0, width, height);
    const currentData = currentCtx.getImageData(0, 0, width, height).data;

    const nextCanvas = document.createElement('canvas');
    nextCanvas.width = width;
    nextCanvas.height = height;
    const nextCtx = nextCanvas.getContext('2d');
    nextCtx.drawImage(nextImg, 0, 0, width, height);
    const nextData = nextCtx.getImageData(0, 0, width, height).data;

    const blendedImage = ctx.createImageData(width, height);
    const blendedData = blendedImage.data;

    for (let i = 0; i < width * height * 4; i += 4) {
        const noise = noiseData[i] / 255;
        const blendFactor = progress >= noise ? 1 : 0;

        for (let c = 0; c < 4; c++) {
            blendedData[i + c] =
                currentData[i + c] * (1 - blendFactor) +
                nextData[i + c] * blendFactor;
        }
    }

    ctx.putImageData(blendedImage, 0, 0);

    if (progress < 1) {
        requestAnimationFrame(drawFrame);
    } else {
        setTimeout(() => {
            currentIndex = nextIndex;
            nextIndex = (nextIndex + 1) % imageList.length;
            preloadNextSet();
        }, displayDuration);
    }
}

export { fetchImages };
