export async function loadFeatureImages() {
    const res = await fetch('/api/features');
    const featureImages = await res.json();

    const container = document.getElementById('feature-list');
    container.innerHTML = '';

    featureImages.forEach((src, index) => {
        const div = document.createElement('div');
        div.className = 'feature';
        div.innerHTML = `
            <img src="${src}" alt="特徴${index + 1}">
            <h3>特徴${index + 1}</h3>
            <p>特徴${index + 1}の説明文が入ります。</p>
        `;
        container.appendChild(div);
    });
}
