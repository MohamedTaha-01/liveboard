import { Server, Socket } from "socket.io";
import Whiteboard from "../models/Whiteboard";
import WhiteboardLogger from "../libs/WhiteboardLogger";

let storage: Whiteboard[] = [];

export const whiteboardHandler = (io: Server, socket: Socket) => {
  socket.on("whiteboard:create", (callback: Function) => {
    const whiteboard = new Whiteboard();
    storage.push(whiteboard);
    socket.join(whiteboard.id);
    WhiteboardLogger.logCreate(whiteboard.id);
    callback({ status: 201, whiteboard });
  });

  socket.on("whiteboard:join", (id: string, callback: Function) => {
    const whiteboard = storage.find((wb) => wb.id === id);
    if (!whiteboard) return { status: 404, error: "Whiteboard not found" };
    socket.join(whiteboard.id);
    WhiteboardLogger.logJoin(whiteboard.id);

    callback({
      status: 200,
      whiteboard,
    });
  });

  socket.on("whiteboard:draw", (id: string, line, callback: Function) => {
    WhiteboardLogger.logDraw(io.sockets.adapter.rooms, socket.id, id);
    socket.to(id).emit("whiteboard:render", line);
    callback({
      status: 200,
    });
  });
};
