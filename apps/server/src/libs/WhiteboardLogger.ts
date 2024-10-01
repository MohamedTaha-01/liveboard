export default class WhiteboardLogger {
  static logCreate(whiteboardId: string) {
    console.log('\x1b[35m[!] whiteboard created:', whiteboardId, '\x1b[0m')
  }

  static logJoin(whiteboardId: string) {
    console.log('\x1b[35m[!] whiteboard joined:', whiteboardId, '\x1b[0m')
  }

  static logDraw(
    rooms: Map<string, Set<string>>,
    socketId: string,
    whiteboardId: string
  ) {
    console.group('\x1b[33m[!] received draw order: \x1b[0m')
    console.log('\x1b[30m- from socket:', socketId, '\x1b[0m')
    console.log('\x1b[30m- at whiteboard:', whiteboardId, '\x1b[0m')
    console.log('\x1b[30m- in room:', rooms, '\x1b[0m')
    console.groupEnd()
  }
}
