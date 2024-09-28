import { Server, Socket } from "socket.io";
import Whiteboard from "../models/Whiteboard";
import WhiteboardLogger from "../libs/WhiteboardLogger";

// TODO: Minimize whiteboard data sent. Avoid sending the entire whiteboard at every event.

let storage: Whiteboard[] = [];

export const whiteboardHandler = (io: Server, socket: Socket) => {
  socket.on("whiteboard:create", (callback: Function) => {
    try {
      const whiteboard = new Whiteboard(socket.id);
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

      if (whiteboard.visibility === "private" && whiteboard.owner !== socket.id) return callback({ status: 403, error: "Whiteboard is private" });

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

  //TODO: when visibility is changed from public to private, all connected sockets should be kicked
  socket.on("whiteboard:change-visibility", (id: string, visibility: "public" | "private", callback: Function) => {
    if (!id) callback({ status: 400, error: "Missing whiteboard ID" });
    try {
      const whiteboard = storage.find((wb) => wb.id === id);
      if (!whiteboard) return callback({ status: 404, error: "Whiteboard not found" });
      if (socket.id !== whiteboard.owner) return callback({ status: 403, error: "You are not allowed to change the visibility" });
      whiteboard.visibility = visibility;
      callback({
        status: 200,
        whiteboard,
      });
    } catch (error) {
      callback({ status: 500, error: "Internal server error" });
    }
  });
};
