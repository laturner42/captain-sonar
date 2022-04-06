import { useState } from 'react';
import {TILE_SIZE} from '../../constants';

export default function Notes(props) {
    const {
        width,
    } = props;
    const { note, setNote } = useState('');


    return (
        <div>
            <span>Notes</span>
            <textarea
                style={{
                    border: '0px',
                    width: width * 0.86,
                    height: width * 0.86,
                    fontSize: 12,
                    backgroundColor: '#852',
                    color: 'white',
                    resize: 'none',
                    backgroundImage: `
                        repeating-linear-gradient(#ccc 0 1px, transparent 1px 100%)
                    `,
                    backgroundPosition: '0px -1px',
                    backgroundSize: `${width}px ${14}px`,
                }}
                spellCheck="false"
                cols={5}
            />
        </div>
    )
}