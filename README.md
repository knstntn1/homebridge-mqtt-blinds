# homebridge-mqtt-blinds
homebridge plugin to control blinds with mqtt

## Configuration

### Basic
| Variable | Description |
| --- | --- |
| accessory ||
| name ||
| manufacturer ||
| model ||
| serialNumberMAC ||

### MQTT
#### Basics
| Variable | Description | Example |
| --- | --- | --- |
| mqttBrokerUrl|||
| mqttUsername |||
| mqttPassword |||
| mqttMainTopic |||

#### Get Topics
| Variable | Description | Example |
| --- | --- | --- |
| currentPosition |||
| positionState |||
| targetPosition |||

#### Set Topics
| Variable | Description | Example |
| --- | --- | --- |
| targetPosition |||
