package consumers

import (
	"context"
	"log"
	"sync"

	"github.com/vanamuthuV/log-processor-service/internal/constants"
	"github.com/vanamuthuV/log-processor-service/internal/kafka"
	"github.com/vanamuthuV/log-processor-service/internal/processor"
	"github.com/vanamuthuV/log-processor-service/internal/producers"
	"github.com/vanamuthuV/log-processor-service/pkg/model"
)

func ReceiveMessage(channel chan model.Listner) {

	var wg sync.WaitGroup

	conn := kafka.NewReader(constants.LoggerTopic, kafka.LogGroupID)
	defer conn.Close()

	for {
		msg, err := conn.ReadMessage(context.Background())

		if err != nil {
			log.Fatalf("❌ error in getting message from kafka %v", err)
			continue
		}

		wg.Add(1)
		if processor.ProcessMessageWithVerdict(msg) { 
			go producers.DatabaseTopicWithAlertTopicProducer(msg, channel, &wg) 
		} else { 
			go producers.DatabaseTopicProducer(msg, channel, &wg) 
		}

	}
}