import {ConnectedSocket, MessageBody, OnMessage, SocketController, SocketIO} from "socket-controllers";
import {Server, Socket} from "socket.io";

@SocketController()
export class RoomController {

    @OnMessage("join_game")
    public async joinGame(
        @SocketIO() io : Server,
        @ConnectedSocket() socket: Socket,
        @MessageBody() message: any
    ) {
        console.log("User is in a room: " + message.roomID)

        const connectedSockets = io.sockets.adapter.rooms.get(message.roomID)
        const socketRooms = Array.from(socket.rooms.values()).filter((room) => room !== socket.id)

        if (socketRooms.length > 0 || (connectedSockets && connectedSockets.size === 2)) {
            socket.emit("room_join_error", {
                error: "Room is full"
            })
        } else {
            await socket.join(message.roomID)

            socket.emit('room_joined')

            if (io.sockets.adapter.rooms.get(message.roomID).size === 2) {
                console.log('starting game')
                socket.emit('start_game', {gameStart: true, symbol: 'x'})
                socket.to(message.roomID).emit('start_game', {gameStart: false, symbol: 'o'})
            }
        }
    }

}
