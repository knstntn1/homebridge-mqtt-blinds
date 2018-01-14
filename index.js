var mqtt = require("mqtt");
var Service, Characteristic;

module.exports = function(homebridge) {
    Service = homebridge.hap.Service;
    Characteristic = homebridge.hap.Characteristic;

    homebridge.registerAccessory("homebridge-mqtt-blinds", "BlindsMQTT", BlindsMQTTAccessory);
}

function BlindsMQTTAccessory(log, config) {
    // GLOBAL vars
    this.log = log;

    // CONFIG vars
    this.name = config["name"];
    this.manufacturer = config['manufacturer'] || "";
  	this.model = config['model'] || "";
  	this.serialNumberMAC = config['serialNumberMAC'] || "";

    // MQTT vars
    this.mqttUrl = config["mqttBrokerUrl"];
    this.mqttUsername = config["mqttUsername"];
    this.mqttPassword = config["mqttPassword"];
    this.mqttClientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);

    this.mqttMainTopic = config["mqttMainTopic"]+"/";
    this.mqttGetTopics = config["mqttGetTopics"];
    this.mqttSetTopics = config["mqttSetTopics"];

    // MQTT options
    this.mqttOptions = {
      keepalive: 10,
      clientId: this.mqttClientId,
      protocolId: 'MQTT',
      protocolVersion: 4,
      clean: true,
      reconnectPeriod: 1000,
      connectTimeout: 30 * 1000,
      will: {
        topic: 'WillMsg',
        payload: 'Connection Closed abnormally..!',
        qos: 0,
        retain: false
      },
      username: this.mqttUsername,
      password: this.mqttPassword,
      rejectUnauthorized: false
    };

    // STATE vars
    this.lastPosition = 100; // last known position of the blinds, open by default
    this.currentPositionState = 2; // stopped by default
    this.currentTargetPosition = 100; // open by default

    // MQTT handling
    this.mqttClient = mqtt.connect(this.mqttUrl, this.mqttOptions);
    var that = this;
  	this.mqttClient.on('error', function() {
  		that.log('Error event on MQTT');
  	});

  	this.mqttClient.on('connect', function() {
      that.log('MQTT is running');
  	});

    this.mqttClient.on('message', function(topic, message) {
      switch (topic) {
        case that.mqttMainTopic + that.mqttGetTopics.currentPosition:
          var payload = parseInt(message);
          if (payload >= 0 && payload <= 100) {
            that.lastPosition = payload;
            that.service.getCharacteristic(Characteristic.CurrentPosition).setValue(that.lastPosition);
            that.log("Updated CurrentPosition: %s", that.lastPosition);
          }
          break;
        case that.mqttMainTopic + that.mqttGetTopics.positionState:
          var payload = parseInt(message);
          if (payload >= 0 && payload <= 2) {
            that.currentPositionState = parseInt(message);
            that.service.getCharacteristic(Characteristic.PositionState).setValue(that.currentPositionState);
            that.log("Updated PositonState: %s", that.currentPositionState);
          }
          break;
        case that.mqttMainTopic + that.mqttGetTopics.targetPosition:
          var payload = parseInt(message);
          if (payload >= 0 && payload <= 100) {
            that.currentTargetPosition = parseInt(message);
            that.service.getCharacteristic(Characteristic.TargetPosition).setValue(that.currentTargetPosition);
            that.log("Updated TargetPosition: %s", that.currentTargetPosition);
          }
          break;
      }
    });

    // MQTT subscribed
    this.mqttClient.subscribe(that.mqttMainTopic + that.mqttGetTopics.currentPosition);
    this.mqttClient.subscribe(that.mqttMainTopic + that.mqttGetTopics.positionState);
    this.mqttClient.subscribe(that.mqttMainTopic + that.mqttGetTopics.targetPosition);

    // register the service and provide the functions
    this.service = new Service.WindowCovering(this.name);

    // the current position (0-100%)
    this.service
        .getCharacteristic(Characteristic.CurrentPosition)
        .on('get', this.getCurrentPosition.bind(this));

    // the position state (0 = DECREASING, 1 = INCREASING, 2 = STOPPED)
    this.service
        .getCharacteristic(Characteristic.PositionState)
        .on('get', this.getPositionState.bind(this));

    // the target position (0-100%)
    this.service
        .getCharacteristic(Characteristic.TargetPosition)
        .on('get', this.getTargetPosition.bind(this))
        .on('set', this.setTargetPosition.bind(this));
}

BlindsMQTTAccessory.prototype.getCurrentPosition = function(callback) {
    this.log("Requested CurrentPosition: %s", this.lastPosition);
    callback(null, this.lastPosition);
}

BlindsMQTTAccessory.prototype.getPositionState = function(callback) {
    this.log("Requested PositionState: %s", this.currentPositionState);
    callback(null, this.currentPositionState);
}

BlindsMQTTAccessory.prototype.getTargetPosition = function(callback) {
    this.log("Requested TargetPosition: %s", this.currentTargetPosition);
    callback(null, this.currentTargetPosition);
}

BlindsMQTTAccessory.prototype.setTargetPosition = function(pos, callback) {
    this.log("Set TargetPosition: %s", pos);
    this.currentTargetPosition = pos;
    this.mqttClient.publish(this.mqttMainTopic + this.mqttSetTopics.targetPosition, pos.toString(), this.mqttOptions);
    callback(null);
}

BlindsMQTTAccessory.prototype.getServices = function() {
  var informationService = new Service.AccessoryInformation();

  informationService
    .setCharacteristic(Characteristic.Name, this.name)
    .setCharacteristic(Characteristic.Manufacturer, this.manufacturer)
    .setCharacteristic(Characteristic.Model, this.model)
    .setCharacteristic(Characteristic.SerialNumber, this.serialNumberMAC);

  return [informationService, this.service];
}
