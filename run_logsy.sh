#!/bin/bash

echo "🔥 Starting Logsy Empire 🔥"
echo "⏳ Buckle up, G..."

# Ingestor
echo "🚀 Starting Ingestor..."
(cd log-ingestor-service && ./mvnw clean spring-boot:run) &

# Processor
echo "⚙️ Starting Log Processor..."
(cd log-processor-service && go run cmd/main.go) &

# Alert Service
echo "📬 Starting Alert Service..."
(cd alert-service && \
  export SPRING_ENVIRONMENTS_EMAIL=your@email.com && \
  export SPRING_ENVIRONMENTS_PASSWORD=wdas && \
  ./mvnw clean spring-boot:run) &

# Storage Service
echo "💾 Starting Storage Service..."
(cd storage-service && ./mvnw clean spring-boot:run) &

# Stream Gateway (WebSocket Gateway)
echo "🌐 Starting Stream Gateway..."
(cd log-stream-gateway && rm -rf dist && npm run build && npm start) &

# Dashboard Client
echo "🖥️ Starting Dashboard Client..."
(cd dashboard-client && npm run dev) &

echo "✅ All Logsy Services Are Booting Up, My G!"
echo "🧠 Make sure Kafka, MongoDB, etc. are running if needed!"

wait
