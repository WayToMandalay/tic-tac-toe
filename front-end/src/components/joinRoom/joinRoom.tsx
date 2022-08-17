import React, {useContext, useState} from "react";
import styles from './joinRoom.module.scss'
import state from "../../context/state";
import GameService from "../../services/gameService/gameService";
import {Socket} from "socket.io-client";
import socketService from "../../services/socketService/socketService";
import gameService from "../../services/gameService/gameService";

interface IJoinRoomProps {}

export const JoinRoom = (props: IJoinRoomProps) => {
    const [roomName, setRoomName] = useState('')
    const [isJoining, setJoining] = useState(false)

    const {inRoom, setInRoom} = useContext(state)

    const handleRoomChange = (e: React.ChangeEvent<any>) => {
        setRoomName(e.target.value)
    }

    const joinRoom = async (e: React.FormEvent) => {

        e.preventDefault()
        const socket = socketService.socket

        if (!roomName || roomName.trim() === '' || !socket) return
        setJoining(true)

        const joined = await gameService.joinRoom(socket, roomName)
            .catch((err) => {
                alert(err)
            })
        if (joined) {
            setInRoom(true)
        }
        setJoining(false)
    }

    return (
        <form onSubmit={joinRoom}>
            <div className={styles.joinRoomContainer}>
                <h4>Enter Room ID to Join the Game</h4>
                <input
                    onChange={handleRoomChange}
                    className={styles.input}
                    placeholder='RoomID'
                    value={roomName}
                />
                <button disabled={isJoining} type='submit' className={styles.button}>
                    {isJoining ? 'You are Joining...' : 'Join'}
                </button>
            </div>
        </form>
    )
}

