package consumers

import (
	"context"
	"log"

	"github.com/vanamuthuV/log-processor-service/internal/constants"
	"github.com/vanamuthuV/log-processor-service/internal/kafka"
	"github.com/vanamuthuV/log-processor-service/internal/processor"
	"github.com/vanamuthuV/log-processor-service/internal/producers"
)

func ReceiveMessage() {

	conn := kafka.NewReader(constants.LoggerTopic, kafka.LogGroupID)
	defer conn.Close()

	for {
		msg, err := conn.ReadMessage(context.Background())

		if err != nil {
			log.Fatalf("❌ error in getting message from kafka %v", err)
			continue
		}

		success := false

		if processor.ProcessMessageWithVerdict(msg) { success = producers.DatabaseTopicWithAlertTopicProducer(msg) 
		} else { success = producers.DatabaseTopicProducer(msg) }

		if !success {
			log.Printf("❌ Failed to produce message: %s", string(msg.Value))
		} else {
			log.Printf("✅ Successfully processed: %s", string(msg.Value))
		}

	}

}