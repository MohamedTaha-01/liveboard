import { Server, Socket } from "socket.io";
import Whiteboard from "../models/Whiteboard";

let storage: Whiteboard[] = [];

export const whiteboardHandler = (io: Server, socket: Socket) => {
  socket.on("whiteboard:create", (callback: Function) => {
    const whiteboard = new Whiteboard();
    storage.push(whiteboard);
    socket.join(whiteboard.id);
    console.log("\x1b[35m[!] whiteboard created:", whiteboard.id, "\x1b[0m");

    callback({ status: 201, whiteboard });
  });

  socket.on("whiteboard:join", (id: string, callback: Function) => {
    const whiteboard = storage.find((wb) => wb.id === id);
    if (!whiteboard) return { status: 404, error: "Whiteboard not found" };
    socket.join(whiteboard.id);
    console.log("\x1b[35m[!] whiteboard joined:", id, "\x1b[0m");

    callback({
      status: 200,
      whiteboard,
    });
  });

  socket.on("whiteboard:draw", (id: string, line, callback: Function) => {
    console.group("\x1b[33m[!] received draw order: \x1b[0m");
    console.log("\x1b[30m- from socket:", socket.id, "\x1b[0m");
    console.log("\x1b[30m- at whiteboard:", id, "\x1b[0m");
    console.log("\x1b[30m- in room:", io.sockets.adapter.rooms, "\x1b[0m");
    console.groupEnd();

    socket.to(id).emit("whiteboard:render", line);
    callback({
      status: 200,
    });
  });
};
