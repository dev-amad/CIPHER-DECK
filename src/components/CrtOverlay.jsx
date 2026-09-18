import React from 'react';

/**
 * CrtOverlay Component
 * Provides authentic vintage CRT scanlines, flicker, phosphor bloom,
 * and vignette border effects without interrupting clicks.
 */
export default function CrtOverlay({ scanlinesEnabled = true, vignetteEnabled = true }) {
    return (
        <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
            {/* Scanline pattern */}
            {scanlinesEnabled && (
                <div
                    className="absolute inset-0 bg-scanlines opacity-[0.18] mix-blend-overlay pointer-events-none"
                    aria-hidden="true"
                />
            )}

            {/* Subtle CRT Flicker */}
            <div
                className="absolute inset-0 bg-amber-500/[0.015] pointer-events-none animate-crt-flicker"
                aria-hidden="true"
            />

            {/* Screen Vignette / Bezel shadow */}
            {vignetteEnabled && (
                <div
                    className="absolute inset-0 pointer-events-none shadow-[inset_0_0_100px_rgba(0,0,0,0.85)] ring-1 ring-amber-500/20"
                    aria-hidden="true"
                />
            )}
        </div>
    );
}
