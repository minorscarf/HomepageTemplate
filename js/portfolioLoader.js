export async function loadPortfolioImages() {
    const res = await fetch('/api/portfolio');
    const portfolioImages = await res.json();

    const container = document.getElementById('portfolio-grid');
    container.innerHTML = '';

    portfolioImages.forEach((src, index) => {
        const div = document.createElement('div');
        div.className = 'portfolio-item';
        div.innerHTML = `
            <img src="${src}" alt="ポートフォリオ${index + 1}">
            <h3>プロジェクト${index + 1}</h3>
            <p>プロジェクト${index + 1}の説明</p>
        `;
        container.appendChild(div);
    });
}
