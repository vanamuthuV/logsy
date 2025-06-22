import { Kafka } from "kafkajs";
import { LogsDto, LogsSchema } from "../types/logs.dto";
import { pipeline } from "../socket/socketHandler";

const kafka = new Kafka({
  clientId: "logsy-stream-service",
  brokers: [process.env.BROKER || ""],
});

const consumer = kafka.consumer({ groupId: process.env.GROUPID || "" });

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

          const log: LogsDto = result.data;

          pipeline(log);

          console.log("✅ Log emitted:", log.message);
        } catch (err) {
          console.error("💥 Error processing log:", err);
        }
      }
    },
  });
};
