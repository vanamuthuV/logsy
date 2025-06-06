package consumer

import (
	"context"
	"fmt"
	"log"
	"time"
	kafka "github.com/segmentio/kafka-go"
	"github.com/vanamuthuV/log-processor-service/internal/constants"
)

func RecieveMessage() {

	conn := kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{"localhost:9092"},
		Topic: constants.LoggerTopic,
		MinBytes: 1,
		MaxBytes: 10e6,
		GroupID:   "log-processor-group",
		MaxWait: 1 * time.Second,
		StartOffset: kafka.LastOffset,
	})

	defer conn.Close()

	for {
		n, err := conn.ReadMessage(context.Background())

		if err != nil {
			log.Printf("error while reading message: %v", err)
			continue
		}

		fmt.Printf("message at offset %d: %s = %s\n", n.Offset, n.Key, n.Value)

	}

}