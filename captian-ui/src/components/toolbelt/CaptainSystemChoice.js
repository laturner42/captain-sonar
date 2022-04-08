import {SystemColors, Systems} from '../systems';
import {SystemIcons} from '../SystemIcons';
import {
    MessageTypes,
} from '../../constants';

export default function CaptainSystemChoice(props) {
    const {
        system,
        systems,
        disabled,
        clickable,
        removeOutline,
        sendMessage,
    } = props;

    const systemSize = 40;

    const active = !disabled && systems[system].filled === systems[system].max;

    const titles = {
        [Systems.Torpedo]: 'Fire a Torpedo up to 4 tiles away',
        [Systems.Mines]: 'Place a Mine in an adjacent tile',
        [Systems.Sonar]: 'Ask the enemy if they are in a particular Sector',
        [Systems.Drone]: 'Get two pieces of info from the enemy - only one is true',
        [Systems.Silence]: 'Move up to 4 spaces in a single direction without detection',
    }

    const trigger = () => {
        sendMessage(
            MessageTypes.DEPLOY_SYSTEM,
            {
                system,
            }
        )
    }

    return (
        <div
            style={{
                width: systemSize,
                height: systemSize,
                borderStyle: 'solid',
                borderColor: removeOutline ? SystemColors[system] : 'white',
                borderWidth: 3,
                backgroundColor: SystemColors[system],
                borderRadius: systemSize,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: systemSize * 1.1,
                opacity: active ? 1 : 0.6,
                margin: 5,
                cursor: active && clickable ? 'pointer' : 'not-allowed',
            }}
            onClick={active && clickable ? trigger : undefined}
            title={titles[system]}
        >
            {SystemIcons[system]}
        </div>
    )
}