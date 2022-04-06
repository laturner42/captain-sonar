import {
    BOARD_WIDTH,
    BOARD_HEIGHT,
    Directions,
    TILE_SIZE,
} from '../constants';
import map from '../components/rename.png';
import Grid from '../components/Grid';
import CaptainMap from '../components/toolbelt/CaptainMap';

export default function Captain(props) {
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
                border: '10px solid red',
                borderRadius: 5,
                position: 'relative',
                display: 'flex',
                flexDirection: 'row',
            }}
        >
            <img
                src={map}
                width={width}
                height={height}
                style={{
                    position: 'absolute',
                }}
            />
            <Grid
                width={boardWidth}
                height={boardHeight}
                path={shipPath}
                boardMargin={0}
                lineColor="black"
            />
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
                <CaptainMap />
            </div>
        </div>
    )
}