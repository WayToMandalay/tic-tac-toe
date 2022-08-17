import {io, Socket} from "socket.io-client"

class SocketService {

    public socket: Socket | null = null

    public connect(url: string) {
        return new Promise((rs, rj) => {
            this.socket = io(url)

            if (!this.socket) {
                return rj()
            }

            this.socket.on("connect", () => {
                console.log('connected')
                rs(this.socket)
            })

            this.socket.on("connect_error", (err) => {
                console.log('Connection error: ', err)
            })
        })
    }
}

export default new SocketService()
