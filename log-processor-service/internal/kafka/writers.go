package kafka

import (
	"log"

	"github.com/vanamuthuV/log-processor-service/internal/constants"
)

var (
	DatabaseConn    = NewWriter(constants.DatabaseTopic)
	AlertConn = NewWriter(constants.AlertTopic)
)

func CloseWriters () {

	err := DatabaseConn.Close()
	if err != nil {
		log.Fatal("❌ cannot close database topic connection " + err.Error())
	}

	err = AlertConn.Close()
	if err != nil {
		log.Fatal("❌ cannot close alert topic connection " + err.Error())
	}

}

