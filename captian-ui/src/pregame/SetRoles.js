import { useState } from 'react';
import {
    Close as RemoveIcon,
} from '@mui/icons-material'
import {
    Button,
} from '@mui/material';
import { MessageTypes, Jobs } from '../constants';

export default function SetRoles(props) {
    const {
        sendMessage,
        gameData,
    } = props;

    const [movingPlayer, setMovingPlayer] = useState(null)

    const team1Roles = Object.values(gameData.team1.roles);
    const team2Roles = Object.values(gameData.team2.roles);
    const placedRoles = [...team1Roles, ...team2Roles];

    const playerButton = (playerName, teamNbr, job) => {
        let selected = false;
        let selectable = false;
        let onClick;
        if (playerName) {
            selected = movingPlayer === playerName;
            if (!teamNbr) {
                selectable = true;
                onClick = () => setMovingPlayer(selected ? null : playerName);
            }
        } else {
            if (movingPlayer) {
                selectable = true;
                onClick = () => {
                    setMovingPlayer(null);
                    sendMessage(
                        MessageTypes.ASSIGN_PLAYER,
                        {
                            teamNbr,
                            newJob: job,
                            playerName: movingPlayer,
                        }
                    )
                }
            }
        }
        return (
            <div
                key={`pbutton-${playerName ? playerName : `{teamNbr}-${job}`}`}
                style={{
                    height: 30,
                    borderWidth: 2,
                    borderColor: selected ? 'white' : (!playerName && movingPlayer ? '#cff' : '#838'),
                    borderStyle: (playerName || !teamNbr) ? 'solid' : 'dotted',
                    borderRadius: 10,
                    padding: 3,
                    paddingLeft: 6,
                    paddingRight: 6,
                    margin: 5,
                    backgroundColor: selected ? '#245' : '#124',
                    cursor: selectable ? 'pointer' : undefined,
                    textAlign: 'center',
                }}
                onClick={onClick}
            >
                <span>{playerName ?? 'Empty'}</span>
            </div>
        )
    }

    const renderTeam = (team) => {
        const {
            roles,
        } = team;
        return (
            <div
                style={{
                    margin: 80,
                    marginTop: 0,
                    marginBottom: 0,
                }}
            >
                <span style={{ fontSize: 30 }}>Team {team.teamNbr}</span>
                {
                    Object.keys(Jobs).reverse().map((job) => {
                        const removeJob = () => {
                            sendMessage(
                                MessageTypes.REMOVE_PLAYER,
                                {
                                    oldJob: job,
                                    teamNbr: team.teamNbr,
                                }
                            )
                        }
                        return (
                            <div
                                style={{
                                    display: 'flex',
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    width: 300,
                                    borderBottomWidth: 1,
                                    borderBottomColor: '#777',
                                    borderBottomStyle: 'solid',
                                }}
                            >
                                <span style={{ color: job === Jobs.CAPTAIN ? '#dfd' : '#ddf', fontSize: 24 }}>{Jobs[job]}</span>
                                <div
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                    }}
                                >
                                    {
                                        !!roles[job] && (
                                            <RemoveIcon style={{ color: '#fbb', cursor: 'pointer' }} onClick={removeJob} />
                                        )
                                    }
                                    {playerButton(roles[job], team.teamNbr, job)}
                                </div>
                            </div>
                        )
                    })
                }
            </div>
        )
    };

    return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <span>Unplaced Players</span>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    height: 60,
                }}
            >
                {
                    Object.values(gameData.players)
                        .map(player => player.name)
                        .filter(playerName => !placedRoles.includes(playerName))
                        .map((playerName) => playerButton(playerName))
                }
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                }}
            >
                {renderTeam(gameData.team1)}
                {renderTeam(gameData.team2)}
            </div>
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                }}
            >
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    <span>Map</span>
                    <select
                        value={gameData.map}
                        onChange={({ target }) => {
                            sendMessage(
                                MessageTypes.CHANGE_MAP,
                                {
                                    newMap: parseInt(`${target.value}`, 10),
                                }
                            )
                        }}
                    >
                        <option value={1}>Map Alpha</option>
                        <option value={2}>Map Foxtrot</option>
                    </select>
                </div>
                <Button
                    disabled={!gameData.team1.roles[Jobs.CAPTAIN] || !gameData.team2.roles[Jobs.CAPTAIN]}
                    onClick={() => {
                        sendMessage(
                            MessageTypes.START_GAME,
                        )
                    }}
                    variant="contained"
                    style={{
                        marginLeft: 30,
                    }}
                >
                    Start
                </Button>
            </div>
        </div>
    )
}