const express = require('express');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// 静的ファイル
app.use(express.static(__dirname));
app.use('/styles', express.static(path.join(__dirname, 'styles')));
app.use('/Images', express.static(path.join(__dirname, 'Images')));

// index.html をルートに返す
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 画像API
function serveImagesFrom(folderName) {
    return (req, res) => {
        const dirPath = path.join(__dirname, `Images/${folderName}`);
        fs.readdir(dirPath, (err, files) => {
            if (err) {
                return res.status(500).json({ error: `${folderName}画像の読み込みに失敗しました` });
            }
            const images = files.filter(file =>
                /\.(png|jpe?g|webp|gif)$/i.test(file)
            ).map(file => `/Images/${folderName}/${file}`);
            res.json(images);
        });
    };
}

app.get('/api/images', serveImagesFrom('main'));
app.get('/api/Background', serveImagesFrom('Background'));
app.get('/api/noise-textures', serveImagesFrom('NoiseTexture'));
app.get('/api/features', serveImagesFrom('features'));
app.get('/api/portfolio', serveImagesFrom('portfolio'));

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
