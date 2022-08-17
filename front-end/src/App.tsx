import React, {useContext, useEffect, useState} from 'react';
import socketService from "./services/socketService/socketService";
import {JoinRoom} from "./components/joinRoom/joinRoom";
import State, {IOurStateProps} from "./context/state";
import Game from "./components/game/game";


function App() {
    const socketHost = process.env.REACT_APP_SOCKET_HOST || 'http://localhost:9000'

    const [inRoom, setInRoom] = useState(false)
    const [playerSymbol, setPlayerSymbol] = useState<'x' | 'o'>('x')
    const [isTurn, setTurn] = useState(false)

    const contextValue :IOurStateProps = {
        inRoom,
        setInRoom,
        playerSymbol,
        setPlayerSymbol,
        isTurn,
        setTurn
    }

    const connectSocket = async () => {
        const socket = await socketService.connect(socketHost)
    }

    useEffect(() => {
        connectSocket()
    }, [])

  return (
        <State.Provider value={contextValue}>
            <div className='appContainer'>
                <h1 className='appTitle'>Welcome to Tic-Tac-Toe</h1>
                <div className="mainContainer">
                    {!inRoom ?
                        <JoinRoom/>
                        :
                        <Game/>
                    }
                </div>
            </div>
        </State.Provider>

  );
}

export default App;
