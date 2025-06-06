package producer

import (
	kafka "github.com/segmentio/kafka-go"
	"github.com/vanamuthuV/log-processor-service/internal/constants"
)

func dbProducer() {

	conn := kafka.NewWriter(kafka.WriterConfig{
		Brokers: []string{"localhost:9092"},
		Topic: constants.DatabaseTopic,
	})

}