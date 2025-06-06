package main

import ( 
	"fmt"
	"github.com/vanamuthuV/log-processor-service/internal/kafka/consumer" 
)

func main() {
	fmt.Println("Log processor service is active")
	consumer.RecieveMessage()
}