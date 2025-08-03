import { Kafka, PartitionAssigners } from "kafkajs";
import { Logs, LogsSchema } from "../types/logs.dto";
import { pipeline } from "../socket/socketHandler";
import dotenv from "dotenv"

dotenv.config()


const kafka = new Kafka({
  clientId: "logsy-stream-service",
  brokers: [process.env.BROKER || "BROKER"],
});

const consumer = kafka.consumer({
  groupId: process.env.GROUPID || "GRUOP",
  partitionAssigners: [PartitionAssigners.roundRobin],
});

export const IntializeKafkaConsumer = async () => {
  await consumer.connect();
  await consumer.subscribe({
    topic: process.env.TOPIC || "",
    fromBeginning: false,
  });

  await consumer.run({
    eachMessage: async ({ message }) => {
      if (message.value) {
        try {
          const raw = JSON.parse(message.value.toString());
          const result = LogsSchema.safeParse(raw);

          if (!result.success) {
            console.error("❌ Invalid log structure:", result.error.format());
            return;
          }

          const log: Logs = result.data;

          pipeline(log);

          console.log("✅ Log emitted:", log.message);
        } catch (err) {
          console.error("💥 Error processing log:", err);
        }
      }
    },
  });
};
