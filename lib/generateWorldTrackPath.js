/**
 * Menghasilkan SVG path data (garis lengkung) yang melewati titik tengah
 * tiap papan dunia secara horizontal, dengan pola naik-turun (zigzag).
 *
 * @param {number} count       Jumlah dunia/papan
 * @param {number} itemWidth   Lebar tiap papan (px)
 * @param {number} baseY       Posisi Y tengah (biasanya height/2 dari viewBox)
 * @param {number} amplitude   Seberapa jauh naik/turun tiap titik
 * @returns {string} path `d` attribute
 */
export function generateWorldTrackPath(count, itemWidth, baseY, amplitude = 40) {
    if (count < 2 || !itemWidth) return '';

    const points = Array.from({ length: count }, (_, i) => {
        const x = i * itemWidth + itemWidth / 2;
        const y = baseY + (i % 2 === 0 ? -amplitude : amplitude);
        return { x, y };
    });

    // Susun path pakai quadratic bezier antar titik supaya melengkung halus,
    // bukan patah-patah seperti garis lurus.
    let d = `M ${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        const midX = (prev.x + curr.x) / 2;

        d += ` Q ${midX},${prev.y} ${midX},${(prev.y + curr.y) / 2}`;
        d += ` Q ${midX},${curr.y} ${curr.x},${curr.y}`;
    }

    return d;
}