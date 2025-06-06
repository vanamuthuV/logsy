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

	fmt.Print(constants.Topic)

	conn, err := kafka.DialLeader(context.Background(), "tcp", "localhost:9092", constants.Topic, 0)

	if err != nil {
		log.Fatal("failed to dial leader", err)
	}

	conn.SetReadDeadline(time.Now().Add(10 * time.Second))
	batch := conn.ReadBatch(10e3, 10e6)

	b := make([] byte, 10e3)

	for {
		n, err := batch.Read(b)

		if err != nil {
			break
		}

		fmt.Println(string(b[:n]))

	}

	if err := batch.Close(); err != nil {
		log.Fatal("failed to close batch ", err)
	}

	if err := conn.Close(); err != nil {
		log.Fatal("failed to close connection ", err)
	}

}