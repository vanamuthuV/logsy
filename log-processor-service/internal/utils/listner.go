package utils

import (
	"log"
	"github.com/vanamuthuV/log-processor-service/pkg/model"
)

func ListenOnChannel(channel chan model.Listner) {
	for res := range channel {
		if res.Success {
			log.Printf("✅ | %f | %v | %v | %v ", res.Time, res.Topic, res.Level, res.Message)
		} else {
			log.Printf("❌ | %f | %v | %v | %v ", res.Time, res.Topic, res.Level, res.Message)
		}
	}
}