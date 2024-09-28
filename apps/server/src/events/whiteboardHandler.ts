import { Server, Socket } from "socket.io";
import Whiteboard from "../models/Whiteboard";
import WhiteboardLogger from "../libs/WhiteboardLogger";

let storage: Whiteboard[] = [];

export const whiteboardHandler = (io: Server, socket: Socket) => {
  socket.on("whiteboard:create", (callback: Function) => {
    try {
      const whiteboard = new Whiteboard();
      storage.push(whiteboard);
      socket.join(whiteboard.id);
      WhiteboardLogger.logCreate(whiteboard.id);
      callback({ status: 201, whiteboard });
    } catch (error) {
      callback({ status: 500, error: "Internal server error" });
    }
  });

  socket.on("whiteboard:join", (id: string, callback: Function) => {
    if (!id) callback({ status: 400, error: "Missing whiteboard ID" });
    try {
      const whiteboard = storage.find((wb) => wb.id === id);
      if (!whiteboard) return callback({ status: 404, error: "Whiteboard not found" });
      socket.join(whiteboard.id);
      WhiteboardLogger.logJoin(whiteboard.id);

      callback({
        status: 200,
        whiteboard,
      });
    } catch (error) {
      callback({ status: 500, error: "Internal server error" });
    }
  });

  socket.on("whiteboard:draw", (id: string, line, callback: Function) => {
    if (!id) callback({ status: 400, error: "Missing whiteboard ID" });
    if (!line) callback({ status: 400, error: "Bad request" });
    try {
      WhiteboardLogger.logDraw(io.sockets.adapter.rooms, socket.id, id);
      storage.find((wb) => wb.id === id)?.content.push(line);
      socket.to(id).emit("whiteboard:render", line);
      callback({
        status: 200,
      });
    } catch (error) {
      callback({ status: 500, error: "Internal server error" });
    }
  });
};
