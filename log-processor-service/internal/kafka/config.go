package kafka

import (
	"time"
	"github.com/vanamuthuV/log-processor-service/internal/constants"
)

var (
	Brokers  = []string{constants.Brokers}
	ReadMinBytes = 1
	ReadMaxBytes = 10e6
	ReadMaxWait = 1 * time.Second
	LogGroupID = "log-processor-group"
)