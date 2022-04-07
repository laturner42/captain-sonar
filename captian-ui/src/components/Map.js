import {TILE_SIZE} from '../constants';
import map from './rename.png';

export default function Map(props) {
    const {
        width,
        height,
    } = props;

    return (
        <div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                    flexDirection: 'column',
                    width: TILE_SIZE,
                }}
            >
                <div
                    style={{
                        marginTop: TILE_SIZE,
                    }}
                />
                {
                    [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15].map((num) => (
                        <div
                            style={{
                                height: TILE_SIZE,
                                width: TILE_SIZE,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: '#ccf',
                                fontSize: 16,
                            }}
                        >
                            {num}
                        </div>
                    ))
                }
            </div>
            <div
                // style={{
                //     marginLeft: TILE_SIZE,
                //     marginTop: TILE_SIZE,
                // }}
            >
                <div
                    style={{
                        display: 'flex',
                        height: TILE_SIZE
                    }}
                >
                    {
                        ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O'].map((num) => (
                            <div
                                style={{
                                    height: TILE_SIZE,
                                    width: TILE_SIZE,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ccf',
                                    fontSize: 16,
                                }}
                            >
                                {num}
                            </div>
                        ))
                    }
                </div>
                <img
                    src={map}
                    alt="The Map"
                    width={width - TILE_SIZE}
                    height={height - TILE_SIZE}
                    style={{
                        position: 'absolute',
                    }}
                />
            </div>
        </div>
    )
}