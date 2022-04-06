import { useState } from 'react';
import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    TILE_SIZE,
} from '../constants';
import map from '../components/rename.png';
import Grid from '../components/Grid';
import {
    Systems
} from '../components/systems';
import Notes from '../components/toolbelt/Notes';
import System from '../components/System';

export default function Navigator(props) {
    const {
        boardWidth,
        boardHeight,
        shipPath,
    } = props;

    const toolBeltWidth = 200;

    const width = boardWidth * TILE_SIZE;
    const height = boardHeight * TILE_SIZE;

    return (
        <div
            style={{
                width: width + toolBeltWidth,
                height,
                border: '10px solid #853',
                borderRadius: 5,
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
                overflow: 'hidden',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <System system={Systems.Torpedo} filled={2} size={6} />
                <System system={Systems.Mines} filled={2} size={6} />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <System system={Systems.Drone} filled={2} size={6} />
                <System system={Systems.Sonar} filled={2} size={6} />
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                }}
            >
                <System system={Systems.Silence} filled={2} size={6} />
            </div>
            <div
                style={{
                    marginLeft: width,
                    width: toolBeltWidth,
                    padding: 10,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Notes width={toolBeltWidth} />
            </div>
        </div>
    )
}