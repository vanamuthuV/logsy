package producers

import (
	"context"
	"encoding/json"
	"log"
	"sync"

	ogkafka "github.com/segmentio/kafka-go"
	"github.com/vanamuthuV/log-processor-service/internal/kafka"
	"github.com/vanamuthuV/log-processor-service/pkg/model"
	"github.com/vanamuthuV/log-processor-service/internal/constants"
)


func DatabaseTopicProducer(msg ogkafka.Message, ch chan model.Listner, wg *sync.WaitGroup) {

	defer wg.Done()

	var parsedmsg model.Logs
	err := json.Unmarshal(msg.Value, &parsedmsg)

	if err != nil {

		log.Fatal("❌ cannot write message into database topic " + err.Error())

		ch <- model.Listner{
			Time: float64(parsedmsg.Timestamp),
			Topic: constants.DatabaseTopic,
			Success: false,
			Message: parsedmsg.Message,
			Level: parsedmsg.Level,
		}
		return
	}

	err = kafka.DatabaseConn.WriteMessages(context.Background(), ogkafka.Message{
		Key: msg.Key,
		Value: msg.Value,
	})

	if err != nil {
		log.Fatal("❌ cannot write message into database topic " + err.Error())
		ch <- model.Listner{
			Time: float64(parsedmsg.Timestamp),
			Topic: constants.DatabaseTopic,
			Success: false,
			Message: parsedmsg.Message,
			Level: parsedmsg.Level,
		}
		return
	}



	ch <- model.Listner{
		Time: float64(parsedmsg.Timestamp),
		Topic: constants.DatabaseTopic,
		Success: true,
		Message: parsedmsg.Message,
		Level: parsedmsg.Level,
	}
}

func DatabaseTopicWithAlertTopicProducer(msg ogkafka.Message, ch chan model.Listner, wg * sync.WaitGroup)  {

	defer wg.Done()

	var parsedmsg model.Logs
	err := json.Unmarshal(msg.Value, &parsedmsg)

	if err != nil {
		log.Fatal("❌ cannot write message into alert topic " + err.Error())
		ch <- model.Listner{
			Time: float64(parsedmsg.Timestamp),
			Topic: constants.AlertTopic,
			Success: false,
			Message: parsedmsg.Message,
			Level: parsedmsg.Level,
		}
	}

	err = kafka.AlertConn.WriteMessages(context.Background(), ogkafka.Message{
		Key: msg.Key,
		Value: msg.Value,
	})

	if err != nil {
		log.Fatal("❌ cannot write message into alert topic " + err.Error())
		ch <- model.Listner{
			Time: float64(parsedmsg.Timestamp),
			Topic: constants.AlertTopic,
			Success: false,
			Message: parsedmsg.Message,
			Level: parsedmsg.Level,
		}
		return
	}

	wg.Add(1)

	go DatabaseTopicProducer(msg, ch, wg) 
	
	ch <- model.Listner{
		Time: float64(parsedmsg.Timestamp),
		Topic: constants.AlertTopic,
		Success: true,
		Message: parsedmsg.Message,
		Level: parsedmsg.Level,
	}

}