export async function loadBackgroundImage() {
    const res = await fetch('/api/Background');
    const bgImages = await res.json();
    if (!bgImages.length) return;

    const bgUrl = bgImages[0];

    document.body.style.backgroundImage = `url('${bgUrl}')`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
}