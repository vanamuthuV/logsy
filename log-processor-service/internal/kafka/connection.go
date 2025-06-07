package kafka

import (
	"github.com/vanamuthuV/log-processor-service/internal/constants"
	kafka "github.com/segmentio/kafka-go"
)

func NewReader(topic string, groupID string) *kafka.Reader {

	return kafka.NewReader(kafka.ReaderConfig{
		Brokers: []string{constants.Brokers},
		// GroupID: groupID,
		Topic: topic,
		MinBytes: ReadMinBytes,
		MaxBytes: int(ReadMaxBytes),
		MaxWait: ReadMaxWait,
		StartOffset: kafka.FirstOffset,	
	})

}

func NewWriter(topic string) *kafka.Writer {

	return kafka.NewWriter(
		kafka.WriterConfig{
			Brokers: []string{constants.Brokers},
			Topic: topic,
		})

}

