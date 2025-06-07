package processor

import (
	"encoding/json"
	"log"

	 kafka "github.com/segmentio/kafka-go"
	"github.com/vanamuthuV/log-processor-service/pkg/model"
)

func ProcessMessageWithVerdict (msg kafka.Message) bool {

	var parsedmsg model.Logs

	err := json.Unmarshal(msg.Value, &parsedmsg)

	if err != nil {
		log.Fatal("❌ unable to parse the string %v" + string(err.Error()))
		return true
	}

	if parsedmsg.Level == model.ERROR || parsedmsg.Level == model.FATAL { return true } else { return false }
	
}