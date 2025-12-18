
export const formatNumber = (num: number): string => {
    if (!num || num === 0) return "0";
    if (num < 10000) return num.toLocaleString();

    // 10^100 is Googol.
    if (num >= 1e100) return "1 구골(Googol)";

    const units = [
        "", "만", "억", "조", "경", "해", "자", "양", "구", "간", 
        "정", "재", "극", "항하사", "아승기", "나유타", "불가사의", "무량대수"
    ];
    
    const unitStep = 4;
    // Math.log10(num) can be slightly inaccurate for very large floats, but good enough for games.
    const unitIndex = Math.floor(Math.log10(num) / unitStep);

    if (unitIndex >= units.length) return num.toExponential(2);

    const value = num / Math.pow(10, unitIndex * unitStep);
    
    // Show up to 2 decimal places, remove trailing zeros if integer
    // e.g. 1.50만 -> 1.5만, 1.00만 -> 1만
    let formattedValue = value.toFixed(2);
    if (formattedValue.endsWith('.00')) formattedValue = formattedValue.slice(0, -3);
    else if (formattedValue.endsWith('0')) formattedValue = formattedValue.slice(0, -1);

    return `${formattedValue}${units[unitIndex]}`;
};
