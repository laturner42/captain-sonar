import CaptainSystemChoice from './CaptainSystemChoice';
import {Systems} from '../systems';

export default function SystemChoices(props) {
    const {
        title,
        enableActions,
        team,
        clickable,
        removeOutlines,
        sendMessage,
    } = props;

    return (
        <div
            style={{
                width: '100%',
            }}
        >
            <div
                style={{
                    display: 'flex',
                    borderWidth: 2,
                    borderRadius: 30,
                    borderColor: '#444',
                    borderStyle: 'solid',
                    margin: 5,
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <span>{title || 'Systems'}</span>
                <div
                    style={{
                        display: 'flex',
                        justifyContent: 'center',
                    }}
                >
                    <div>
                        <CaptainSystemChoice
                            system={Systems.Torpedo}
                            systems={team.systems}
                            disabled={!enableActions}
                            clickable={clickable}
                            removeOutline={removeOutlines}
                            sendMessage={sendMessage}
                        />
                        <CaptainSystemChoice
                            system={Systems.Mines}
                            systems={team.systems}
                            disabled={!enableActions}
                            clickable={clickable}
                            removeOutline={removeOutlines}
                            sendMessage={sendMessage}
                        />
                    </div>
                    <div>
                        <CaptainSystemChoice
                            system={Systems.Drone}
                            systems={team.systems}
                            disabled={!enableActions}
                            clickable={clickable}
                            removeOutline={removeOutlines}
                            sendMessage={sendMessage}
                        />
                        <CaptainSystemChoice
                            system={Systems.Sonar}
                            systems={team.systems}
                            disabled={!enableActions}
                            clickable={clickable}
                            removeOutline={removeOutlines}
                            sendMessage={sendMessage}
                        />
                    </div>
                    <CaptainSystemChoice
                        system={Systems.Silence}
                        systems={team.systems}
                        disabled={!enableActions}
                        clickable={clickable}
                        removeOutline={removeOutlines}
                        sendMessage={sendMessage}
                    />
                </div>
            </div>
        </div>
    )
}