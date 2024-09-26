import express, { Request, Response } from "express";
import { createServer } from "node:http";
import cors from "cors";
import { Server } from "socket.io";
import Whiteboard from "./models/Whiteboard";

const app = express();
app.use(cors({ origin: "*" }));
app.use(express.json());
const server = createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://127.0.0.1:5173",
    methods: ["OPTIONS", "GET", "POST"],
    // allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

let storage: Whiteboard[] = [];

app.post("/whiteboard", (req: Request, res: Response) => {
  const whiteboard = new Whiteboard();
  storage.push(whiteboard);
  res.status(200).json({ whiteboard });
});

app.get("/whiteboard", (req: Request, res: Response) => {
  res.status(200).json({ whiteboards: storage });
});

app.get("/whiteboard/:id", (req: Request, res: Response) => {
  const { id } = req.params;
  const whiteboard = storage.find((wb) => wb.id === id);
  res.status(200).json({ whiteboard });
});

io.on("connection", (socket) => {
  console.log("a user connected:", socket.id);
});

server.listen(3002, () => {
  console.log("server running at http://localhost:3000");
});
