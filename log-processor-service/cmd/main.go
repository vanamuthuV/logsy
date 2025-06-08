package main

import (
	"fmt"

	"github.com/vanamuthuV/log-processor-service/internal/consumers"
	"github.com/vanamuthuV/log-processor-service/internal/kafka"
	"github.com/vanamuthuV/log-processor-service/internal/utils"
	"github.com/vanamuthuV/log-processor-service/pkg/model"
)

func main() {
	fmt.Println("✅ Log processor service is active ✅")
	
	channel := make(chan model.Listner)

	go consumers.ReceiveMessage(channel)
	go utils.ListenOnChannel(channel)

	defer kafka.CloseWriters()

	select {}
}