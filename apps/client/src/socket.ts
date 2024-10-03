import { io, Socket } from 'socket.io-client'

const URL =
  import.meta.env.VITE_PROD === true ? undefined : 'http://localhost:3002'

export const s: Socket = io(URL, {
  withCredentials: true,
  reconnectionAttempts: 10,
})
