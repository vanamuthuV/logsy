package main

import (
	"fmt"

	"github.com/vanamuthuV/log-processor-service/internal/consumers"
	"github.com/vanamuthuV/log-processor-service/internal/kafka"
)

func main() {
	fmt.Println("✅ Log processor service is active ✅")
	
	consumers.ReceiveMessage()

	defer kafka.CloseWriters()
}