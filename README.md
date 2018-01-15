# homebridge-mqtt-blinds
homebridge plugin to control blinds with mqtt

## Configuration

### Basic
| Variable | Description | Example |
| --- | --- | --- |
| accessory | Name of the accessory plugin. | BlindsMQTT |
| name | Name for your blinds. | Living Room Blinds |
| manufacturer | Manufacturer of your blind | DIY |
| model | Model of your blind. | Prototype |
| serialNumberMAC | Serial number of your blind. | 01.01.01.01 |

### MQTT
#### Basics
| Variable | Description | Example |
| --- | --- | --- |
| mqttBrokerUrl| IP Adress of your MQTT Broker | mqtt://192.168.0.10:1883 |
| mqttUsername | Your MQTT Broker username | username |
| mqttPassword | Your MQTT Broker password | password|
| mqttMainTopic | The main topic of your blind | myBlind |

#### Get Topics
Use these variables to set your topics to control your blind.
| Variable | Description | Example |
| --- | --- | --- |
| currentPosition | Topic to get the current position of your blind. The value has to be between 0-100. | GET/currentPosition |
| positionState | Topic to get the current position state of your blind. The value has to be 0 for decreasing, 1 for increasing and 2 for a stopped blind.  | GET/positionState |
| targetPosition | Topic to get the target position of your blind. The value has to be between 0-100. | GET/targetPosition |

#### Set Topics
Use these variables to define the topic that the plugin uses to control your blind.
| Variable | Description | Example |
| --- | --- | --- |
| targetPosition |Topic to set the target position of your blind. The value has to be between 0-100.| SET/targetPosition |
