import React, {useContext, useEffect, useState} from "react";
import styles from './game.module.scss'
import clsx from "clsx";
import X from "./x";
import O from "./o";
import state from "../../context/state";
import gameService from "../../services/gameService/gameService";
import socketService from "../../services/socketService/socketService";

export type IPlayMatrix = Array<Array<string | null>>;
export interface IGameStart {
    gameStart: boolean
    symbol: 'x' | 'o'
}

const Game = () => {
    const [matrix, setMatrix] = useState<IPlayMatrix>([
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ])

    const {playerSymbol, setPlayerSymbol , isTurn, setTurn} = useContext(state)

    const updateMatrix = (row: number, cell: number, value: 'x' | 'o') => {
        const newMatrix = [...matrix]

        if (!newMatrix[row][cell] || newMatrix[row][cell] === 'null') {
            newMatrix[row][cell] = value
            setMatrix(newMatrix)
        }
        if (socketService.socket) {
            gameService.onMove(socketService.socket, newMatrix)

            setTurn(false)
        }
    }

    const handleGameUpdate = () => {
        if (socketService.socket) {
            gameService.onGameUpdate(socketService.socket, (newMatrix) => {
                setMatrix(newMatrix)
                setTurn(true)
            })
        }
    }

    const handleGameStart = () => {
        if (socketService.socket) {
            gameService.onGameStart(socketService.socket, (args) => {
                console.log(args)
                setPlayerSymbol(args.symbol)
                setTurn(args.gameStart)
            })
        }
    }

    useEffect(() => {
        handleGameUpdate()
        handleGameStart()
    }, [])

    return (
        <div className={styles.container}>
            {!isTurn && <div className={styles.block}/> }
            {matrix.map((row, rowId) => {
                return (
                    <div key={rowId} className={styles.rowContainer}>
                        {row.map((cell , cellId) => {
                            return (
                                <div
                                    key={cellId}
                                    className={clsx(styles.cell,
                                        {[styles.borderRight]: cellId < 2},
                                        {[styles.borderBottom]: rowId < 2},
                                    )}
                                    onClick={() => updateMatrix(rowId, cellId, playerSymbol)}
                                >
                                    {cell && cell !== 'null' ?
                                        (cell === 'x' ?
                                            <X/> :
                                            <O/>
                                        )
                                        : null
                                    }
                                </div>
                            )
                        })}
                    </div>
                )
            })}
        </div>
    )
}

export default Game
