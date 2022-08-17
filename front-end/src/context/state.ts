import React from "react";

export interface IOurStateProps {
    inRoom: boolean
    setInRoom: (inRoom: boolean) => void
    playerSymbol: 'x' | 'o'
    setPlayerSymbol: (symbol: 'x' | 'o') => void
    isTurn: boolean
    setTurn: (turn: boolean) => void
}

const ourState: IOurStateProps = {
    inRoom: false,
    setInRoom: () => {},
    playerSymbol: 'x',
    setPlayerSymbol: () => {},
    isTurn: false,
    setTurn: () => {}

}

export default React.createContext(ourState)
