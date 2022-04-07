export default function EnemyHistory(props) {
    const {
        enemyTeam,
    } = props;

    const history = [...enemyTeam.history].reverse();

    return (
        <div
            style={{
                width: '90%',
                overflow: 'scroll',
                borderWidth: 2,
                borderStyle: 'solid',
                borderColor: '#555',
                borderRadius: 10,
                height: 130,
            }}
        >
            <div
                style={{
                    height: 12,
                    margin: 5,
                    fontSize: 12,
                    textAlign: 'center',
                    borderBottomColor: '#aaa',
                    borderBottomWidth: 1,
                    borderBottomStyle: 'solid',
                }}
            >
                <span>Enemy History</span>
            </div>
            {
                history.map((event, i) => (
                    <div
                        style={{
                            color: i === 0 ? 'white' : '#aaa',
                            fontSize: 12,
                            marginLeft: 5,
                            marginRight: 5,
                        }}
                    >
                        <span>{event}</span>
                    </div>
                ))
            }
        </div>
    )
}