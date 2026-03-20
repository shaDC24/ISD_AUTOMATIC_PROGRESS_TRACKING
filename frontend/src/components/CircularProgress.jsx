/**
 * CircularProgress
 * Small SVG circle showing how much of a lecture has been watched
 *   percent     - 0 to 100
 *   isCompleted - shows full green circle with checkmark
 *   size        - diameter in px (default 28)
 */
export default function CircularProgress({ percent = 0, isCompleted = false, size = 28 }) {
    const radius      = (size - 4) / 2;
    const circumference = 2 * Math.PI * radius;
    const filled      = isCompleted ? circumference : (percent / 100) * circumference;
    const strokeColor = isCompleted ? '#10b981' : '#7c3aed';

    return (
        <svg width={size} height={size} style={{ flexShrink: 0 }}>
            {/* Background circle */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="#374151"
                strokeWidth="3"
            />
            {/* Progress arc */}
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth="3"
                strokeDasharray={`${filled} ${circumference}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${size / 2} ${size / 2})`}
                style={{ transition: 'stroke-dasharray 0.4s ease' }}
            />
            {/* Center: checkmark or percent */}
            {isCompleted ? (
                <text
                    x={size / 2}
                    y={size / 2 + 4}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#10b981"
                    fontWeight="700"
                >✓</text>
            ) : percent > 0 ? (
                <text
                    x={size / 2}
                    y={size / 2 + 4}
                    textAnchor="middle"
                    fontSize="8"
                    fill="#9ca3af"
                >
                    {Math.round(percent)}%
                </text>
            ) : null}
        </svg>
    );
}
