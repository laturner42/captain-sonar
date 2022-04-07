import { useState } from 'react';
import {
    Close as RemoveIcon,
} from '@mui/icons-material'
import {
    TextField,
    Button,
} from '@mui/material';
import { MessageTypes, Jobs } from '../constants';

export default function SetRoles(props) {
    const {
        sendMessage,
        gameData,
        myName,
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
                style={{
                    height: 30,
                    borderWidth: 2,
                    borderColor: selected ? 'white' : (!playerName && movingPlayer ? '#cff' : '#838'),
                    borderStyle: (!playerName || !teamNbr) ? 'solid' : undefined,
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
                    margin: 100,
                    marginTop: 0,
                    marginBottom: 0,
                }}
            >
                <span style={{ fontSize: 30 }}>Team {team.teamNbr}</span>
                {
                    Object.keys(Jobs).map((job) => {
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
                                <span style={{ color: '#ddf', fontSize: 24 }}>{Jobs[job]}</span>
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
                        .map(playerButton)
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
                    borderStyle: 'solid',
                    borderWidth: 2,
                    borderRadius: 20,
                    borderColor: '#abf',
                    width: 80,
                    textAlign: 'center',
                    marginTop: 20,
                    cursor: 'pointer',
                }}
                onClick={() => {
                    sendMessage(
                        MessageTypes.START_GAME,
                    )
                }}
            >
                <span>Start</span>
            </div>
        </div>
    )
}