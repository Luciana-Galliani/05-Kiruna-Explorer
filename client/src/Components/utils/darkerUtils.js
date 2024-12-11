export default function darkenColor(hex, percent) {
    const num = parseInt(hex.replace("#", ""), 16);
    const r = Math.max(0, Math.min(255, (num >> 16) - percent * 2.55));
    const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00ff) - percent * 2.55));
    const b = Math.max(0, Math.min(255, (num & 0x0000ff) - percent * 2.55));
    return `#${(r << 16 | g << 8 | b).toString(16).padStart(6, "0")}`;
}
