import {Socket} from "socket.io-client";
import {IGameStart, IMessage, IPlayMatrix} from "../../components/game/game";


class GameService {
    public async joinRoom(socket: Socket, roomID: string): Promise<boolean> {
     return new Promise((rs, rj) => {

         socket.emit('join_game', {roomID})
         socket.on('room_joined', () => rs(true))
         socket.on('room_join_error', ({error}) => rj(error))
     })
    }

    public async onMove(socket: Socket, matrix: IPlayMatrix): Promise<boolean> {
        return new Promise(() => {
            socket.emit('update_game', {matrix})
        })
    }

    public async onGameUpdate(socket: Socket, listener: (matrix: IPlayMatrix) => void ) {
        socket.on('on_move', ({matrix}) => listener(matrix))
    }

    public async onGameStart(socket: Socket, listener: (args: IGameStart) => void) {
        socket.on('start_game', (args) => listener(args))
    }

    public async onGameWin(socket: Socket, listener: (message: IMessage) => void) {
        socket.on('game_win', (message) => listener(message))
    }

    public async onWin(socket: Socket, message: IMessage) {
        socket.emit('on_win', message)
    }
}

export default new GameService()
