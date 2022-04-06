import { useState, useEffect } from 'react';
import {
    Rocket as Torpedo,
    TrackChanges as Sonar,
} from '@mui/icons-material';

import {
    Systems,
    SystemIcons,
    SystemColors,
} from './systems';

export default function System(props) {
    const {
        system,
        filled,
        size,
    } = props;

    const systemSize = 100;

    const rectangles = [];
    const rectWidth = systemSize * 0.5;
    const rectHeight = systemSize * 0.3;
    for (let i=0; i<size; i++) {
        rectangles.push(
            <div
                key={`system-${i}`}
                style={{
                    position: 'absolute',
                    backgroundColor: `rgba(255,255,255,${filled > i ? 1 : 0.5})`,
                    width: rectWidth,
                    height: rectHeight,
                    borderRadius: systemSize * 0.1,
                    transformOrigin: '50% 275%',
                    transform: `rotate(${30 + (i * 45)}deg)`,
                    marginTop: -rectHeight,
                    marginLeft: (systemSize * 0.5) - (rectWidth / 2),
                }}
            />
        )
    }

    return (
        <div
            style={{
                position: 'relative',
                margin: rectWidth,
            }}
            key={system}
        >
            {rectangles}
            <div
                style={{
                    width: systemSize,
                    height: systemSize,
                    borderStyle: 'solid',
                    borderWidth: 3,
                    backgroundColor: SystemColors[system],
                    borderRadius: systemSize,
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: systemSize * 1.1,
                }}
            >
                {SystemIcons[system]}
            </div>
        </div>
    )
}