# homebridge-mqtt-blinds
This is a homebridge plugin to control blinds with mqtt. :sun_with_face::new_moon_with_face:

## Installation
If you are new to Homebridge, please first read the Homebridge [documentation](https://github.com/nfarina/homebridge).
To install the plugin use:
```
sudo npm install homebridge-mqtt-blinds -g
```

## Configuration

### config.json example
```
{
    "bridge": {
        "name": "Homebridge",
        "username": "CC:22:3D:E3:CE:30",
        "port": 51826,
        "pin": "031-45-154"
    },
    "accessories": [{
      "accessory": "BlindsMQTT",
      "name": "Living Room Blind",
      "manufacturer": "DIY",
      "model": "Prototype",
      "serialNumberMAC": "01.01.01.01",
      "mqttBrokerUrl": "mqtt://192.168.0.10:1883",
      "mqttUsername": "username",
      "mqttPassword": "password",
      "mqttMainTopic": "myBlind",
      "mqttSetTopics": {
        "targetPosition": "SET/targetPosition"
      },
      "mqttGetTopics": {
        "currentPosition": "GET/currentPosition",
        "positionState": "GET/positionState",
        "targetPosition": "GET/targetPosition"
      }
    }
    ],

    "platforms": [
    ]
}
```
### Basic
| Variable | Description | Example |
| --- | --- | --- |
| accessory | Name of the accessory plugin. | BlindsMQTT |
| name | Name for your blinds. | Living Room Blind |
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
Use these variables to set topics to inform the plugin about the current status of your blind. The plugin subscribes these topics. 

| Variable | Description | Example |
| --- | --- | --- |
| currentPosition | Topic to get the current position of your blind. The value has to be between 0-100. | GET/currentPosition |
| positionState | Topic to get the current position state of your blind. The value has to be 0 for decreasing, 1 for increasing and 2 for a stopped blind.  | GET/positionState |
| targetPosition | Topic to get the target position of your blind. The value has to be between 0-100. | GET/targetPosition |

#### Set Topics
Use these variables to define the topic that the plugin uses to control your blind. The plugin will publish on these topics.

| Variable | Description | Example |
| --- | --- | --- |
| targetPosition | Topic to set the target position of your blind. The value has to be between 0-100. | SET/targetPosition |

## Usage
Build up your blind. Use MQTT to communicate with homebridge. To explain how it works i will use the values of the examples above.
For example, if you use the home app to open your blind 100%, the plugin will publish `100`
on the topic `myBlind/SET/targetPosition`. The blind should send the current position on the topic `myBlind/GET/currentPosition`, the position state on `myBlind/GET/positionState` an the target position on `myBlind/GET/currentPosition`.

---------
Have fun with this plugin. Let me know if you find a issue. :+1: :smile:

