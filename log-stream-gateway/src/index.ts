import express from "express";
import http from "http";
import { InitializeSocket } from "./socket/socketHandler";
import { IntializeKafkaConsumer } from "./kafka/consumer";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const server = http.createServer(app);

const PORT = process.env.PORT || 4000;

server.listen(PORT, () => {
  console.log("stream gateway is listening");
  InitializeSocket(server);
  IntializeKafkaConsumer();
});
