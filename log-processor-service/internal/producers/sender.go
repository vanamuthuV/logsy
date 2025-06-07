package producers

import (
	"context"
	"log"

	ogkafka "github.com/segmentio/kafka-go"
	"github.com/vanamuthuV/log-processor-service/internal/kafka"
)


func DatabaseTopicProducer(msg ogkafka.Message) bool {

	err := kafka.DatabaseConn.WriteMessages(context.Background(), ogkafka.Message{
		Key: msg.Key,
		Value: msg.Value,
	})

	if err != nil {
		log.Fatal("❌ cannot write message into database topic " + err.Error())
		return false
	}

	return true
}

func DatabaseTopicWithAlertTopicProducer(msg ogkafka.Message) bool  {


	err := kafka.AlertConn.WriteMessages(context.Background(), ogkafka.Message{
		Key: msg.Key,
		Value: msg.Value,
	})

	if err != nil {
		log.Fatal("❌ cannot write message into alert topic " + err.Error())
		return false
	}

	if !DatabaseTopicProducer(msg) { return false }
	
	return true

}