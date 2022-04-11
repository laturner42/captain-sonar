import { TOOL_BELT_WIDTH } from '../../constants';

export default function Notes(props) {
    const {
        job,
        setJobNotes,
        notes,
    } = props;
    const width = TOOL_BELT_WIDTH;

    return (
        <div
            style={{
                margin: 5,
                display: 'flex',
                flexDirection: 'column',
            }}
        >
            <span>Notes</span>
            <textarea
                value={notes[job]}
                onChange={(event) => setJobNotes(job, event.target.value)}
                style={{
                    border: '0px',
                    width: width * 0.86,
                    height: width * 0.55,
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