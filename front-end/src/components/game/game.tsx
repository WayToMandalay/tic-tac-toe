import React, {useContext, useEffect, useState} from "react";
import styles from './game.module.scss'
import clsx from "clsx";
import X from "./x";
import O from "./o";
import state from "../../context/state";
import gameService from "../../services/gameService/gameService";
import socketService from "../../services/socketService/socketService";

export type IPlayMatrix = Array<Array<string | null>>;
export type IMessage = 'WIN' | 'TIE' | 'LOSE'
export interface IGameStart {
    gameStart: boolean
    symbol: 'x' | 'o'
}

export interface IResults {
    win: boolean,
    tie: boolean,
    lose: boolean
}

const Game = () => {
    const [matrix, setMatrix] = useState<IPlayMatrix>([
        [null, null, null],
        [null, null, null],
        [null, null, null],
    ])

    const {playerSymbol, setPlayerSymbol , isTurn, setTurn ,isStarted, setIsStarted} = useContext(state)

    const [results, setResults] = useState<IResults>({
        win: false,
        tie: false,
        lose: false
    })

    const updateMatrix = (row: number, cell: number, value: 'x' | 'o') => {
        const newMatrix = [...matrix]

        if (!newMatrix[row][cell] || newMatrix[row][cell] === 'null') {
            newMatrix[row][cell] = value
            setMatrix(newMatrix)


            if (socketService.socket) {
                gameService.onMove(socketService.socket, newMatrix)

                const [currentPlayerWinner, otherPlayerWinner] = checkResult(newMatrix)

                if (currentPlayerWinner && !otherPlayerWinner) {
                    alert(`You've won`)
                    setResults({
                        ...results,
                        win: true
                    })
                    gameService.onWin(socketService.socket, 'LOSE')
                }

                if (currentPlayerWinner && otherPlayerWinner) {
                    alert(`TIE!`)
                    setResults({
                        ...results,
                        tie: true
                    })
                    gameService.onWin(socketService.socket, 'TIE')
                }

                if (!currentPlayerWinner && otherPlayerWinner) {
                    alert(`LOSE!`)
                    setResults({
                        ...results,
                        lose: true
                    })
                    gameService.onWin(socketService.socket, 'WIN')
                }

                setTurn(false)
            }
        }

    }

    const checkResult = (matrix: IPlayMatrix) => {
        for (let i = 0; i < 3; i++) {
            if (matrix[i].every(elem => elem && elem === playerSymbol)) {
                // alert(`You've won`)
                return [true, false]
            }
            else if (matrix[i].every(elem => elem && elem !== playerSymbol)) {
                // alert(`You've lost`)
                return [false, true]
            }
        }

        for (let i = 0; i < 3; i++) {
            if (matrix[0][i] && (matrix[0][i] === matrix[1][i]) && (matrix[0][i] === matrix[2][i])) {
                if (playerSymbol === matrix[0][i]) {
                    // alert(`You've won`)
                    return [true, false]
                }
                else {
                    // alert(`You've lost`)
                    return [false, true]
                }
            }
        }

        if (matrix[1][1]) {
            if ((matrix[1][1] === matrix[0][0]) && (matrix[1][1]) === matrix[2][2]) {
                if (matrix[1][1] === playerSymbol) {
                    // alert(`You've won`)
                    return [true, false]
                } else {
                    // alert(`You've lost`)
                    return [false, true]
                }
            }

            if ((matrix[1][1] === matrix[2][0]) && (matrix[1][1]) === matrix[0][2]) {
                if (matrix[1][1] === playerSymbol) {
                    // alert(`You've won`)
                    return [true, false]
                } else {
                    // alert(`You've lost`)
                    return [false, true]
                }
            }
        }

        if (matrix.every((row) => row.every((v) => v !==null))){
            // alert(`It's a Tie!`)
            return  [true, true]
        }

        return [false, false]
    }

    const handleGameWin = () => {
        if (socketService.socket) {
            gameService.onGameWin(socketService.socket, (message) => {
                setTurn(false)
                switch (message) {
                    case 'WIN':

                        setResults({
                            ...results,
                            win: true
                        })
                        break

                    case 'LOSE':
                        setResults({
                            ...results,
                            lose: true
                        })
                        break;

                    case 'TIE':
                        setResults({
                            ...results,
                            tie: true
                        })
                        break;
                }
            })
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
                setIsStarted(true)
                setPlayerSymbol(args.symbol)
                setTurn(args.gameStart)
            })
        }
    }

    useEffect(() => {
        handleGameUpdate()
        handleGameStart()
        handleGameWin()
    }, [])

    return (
        <div className={styles.container}>
            {!isStarted && <h2>Wait</h2>}
            {(!isTurn || !isStarted) && <div className={styles.block}/> }
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
                                        {[styles.disabled]: cell === 'x' || cell === 'o'},

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
