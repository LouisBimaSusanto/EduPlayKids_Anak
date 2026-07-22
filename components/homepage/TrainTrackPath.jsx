'use client';

import { useEffect, useRef, useState } from 'react';

export function TrainTrackPath({
    d,
    pathWidth,
    pathHeight,
    railGap    = 16,
    tieSpacing = 26,
    tieLength  = 24,
    railColor  = '#8B6F47',
    tieColor   = '#5A3E24',
    sampleStep = 5,
}) {
    const hiddenPathRef = useRef(null);
    const [track, setTrack] = useState(null);

    useEffect(() => {
        if (!d) { setTrack(null); return; }

        const pathEl = hiddenPathRef.current;
        if (!pathEl) return;

        const totalLength = pathEl.getTotalLength();
        if (!totalLength) return;

        const railAPoints = [];
        const railBPoints = [];
        const ties = [];
        let distSinceLastTie = 0;

        for (let dist = 0; dist <= totalLength; dist += sampleStep) {
        const p      = pathEl.getPointAtLength(dist);
        const pAhead = pathEl.getPointAtLength(Math.min(dist + 1, totalLength));

        const dx = pAhead.x - p.x;
        const dy = pAhead.y - p.y;
        const len = Math.hypot(dx, dy) || 1;

        const nx = -dy / len;
        const ny = dx / len;

        railAPoints.push(`${p.x + nx * (railGap / 2)},${p.y + ny * (railGap / 2)}`);
        railBPoints.push(`${p.x - nx * (railGap / 2)},${p.y - ny * (railGap / 2)}`);

        distSinceLastTie += sampleStep;
        if (distSinceLastTie >= tieSpacing) {
            distSinceLastTie = 0;
            ties.push({
            x1: p.x + nx * (tieLength / 2),
            y1: p.y + ny * (tieLength / 2),
            x2: p.x - nx * (tieLength / 2),
            y2: p.y - ny * (tieLength / 2),
            });
        }
        }

        setTrack({
        railA: `M ${railAPoints.join(' L ')}`,
        railB: `M ${railBPoints.join(' L ')}`,
        ties,
        });
    }, [d, railGap, tieSpacing, tieLength, sampleStep]);

    if (!d) return null;

    return (
        <svg
        style={{
            position: 'absolute',
            left: 0,
            top: 0,
            width: pathWidth,
            height: pathHeight,
            pointerEvents: 'none',
            zIndex: 0,
        }}
        viewBox={`0 0 ${pathWidth} ${pathHeight}`}
        preserveAspectRatio="none"
        >
        <path ref={hiddenPathRef} d={d} fill="none" stroke="none" />

        {track && (
            <>
            {track.ties.map((tie, i) => (
                <line
                key={i}
                x1={tie.x1} y1={tie.y1}
                x2={tie.x2} y2={tie.y2}
                stroke={tieColor}
                strokeWidth={5}
                strokeLinecap="round"
                />
            ))}
            <path d={track.railA} fill="none" stroke={railColor} strokeWidth={4} strokeLinecap="round" />
            <path d={track.railB} fill="none" stroke={railColor} strokeWidth={4} strokeLinecap="round" />
            </>
        )}
        </svg>
    );
}