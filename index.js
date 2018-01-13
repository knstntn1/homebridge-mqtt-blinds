'use strict';

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
    this.mqttUrl = config["url"];
    this.mqttUsername = config["username"];
    this.mqttPassword = config["stop_url"];
    this.mqttTopic = config["topic"];
    this.mqttClientId = 'mqttjs_' + Math.random().toString(16).substr(2, 8);

    // mqtt options
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

    // state vars
    this.lastPosition = 100; // last known position of the blinds, open by default
    this.currentPositionState = 2; // stopped by default
    this.currentTargetPosition = 100; // open by default

    // mqtt handling
    this.mqttClient = mqtt.connect(this.mqttUrl, this.mqttOptions);
    var that = this;
  	this.mqttClient.on('error', function() {
  		that.log('Error event on MQTT');
  	});

  	this.mqttClient.on('connect', function() {
      that.log('MQTT is running ');
  	});

    this.mqttClient.on('message', function(topic, message) {
      switch (topic) {
        case this.mqttTopic + "/GET/currentPosition":
          this.lastPosition = Number(messsage);
          break;
        case this.mqttTopic + "/GET/positionState":
          this.currentPositionState = Number(messsage);
          break;
        case this.mqttTopic + "/GET/targetPosition":
          this.currentTargetPosition = Number(messsage);
          break;
      }
    });

    // MQTT SUBSCRBE
    this.mqttClient.subscribe(this.topicsStateGet);

    // register the service and provide the functions
    this.service = new Service.WindowCovering(this.name);

    // the current position (0-100%)
    this.service
        .getCharacteristic(Characteristic.CurrentPosition)
        .on('get', this.getCurrentPosition.bind(this));

    // the position state
    // 0 = DECREASING; 1 = INCREASING; 2 = STOPPED
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
    this.mqttClient.publish(this.mqttTopic + "/SET/targetPosition", pos.toString(), this.mqttOptions);
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
