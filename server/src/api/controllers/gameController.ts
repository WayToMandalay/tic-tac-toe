import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";

@SocketController()
export class GameController {
    private getGameRoom(socket: Socket) {
        const socketRooms = Array.from(socket.rooms.values()).filter((el) => {
            return el !== socket.id
        })
        return socketRooms && socketRooms[0]
    }

    @OnMessage("update_game")
    public async updateGame(
        @SocketIO() io : Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ) {
        const gameRoom = this.getGameRoom(socket)
        socket.to(gameRoom).emit("on_move", message)
    }

    @OnMessage("start_game")
    public async startGame(
        @SocketIO() io : Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ) {

    }

}
