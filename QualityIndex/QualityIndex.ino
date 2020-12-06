
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include "MQ135.h"

// Set these to run example.
#define FIREBASE_HOST "arduino-pollution-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "JLoueMInkwOXuDeFy6f20ZDDwLmwydXU42bWGmet"
#define WIFI_SSID "skynet"
#define WIFI_PASSWORD "9448893603"


// MQ-135 sensor values
#define ANALOGPIN A0    //  Define Analog PIN on Arduino Board
#define RZERO 312.11    //  Define RZERO Calibration Value

//sound sensor values
#define SOUNDPIN D5
boolean isSoundDetected = false;
unsigned long lastSoundDetectTime;

//UTC time offsets in millis
const long utcOffsetInSeconds = 19800;

//NTP client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

MQ135 gasSensor = MQ135(ANALOGPIN);

void setup() {
  Serial.begin(9600);

  // connect to wifi.
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("connecting");
  while (WiFi.status() != WL_CONNECTED) {
    Serial.print(".");
    delay(500);
  }
  Serial.println();
  Serial.print("connected: ");
  Serial.println(WiFi.localIP());

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  Serial.print("Rzero: ");
  Serial.println(gasSensor.getRZero());
  timeClient.begin();
}


void loop() {
  // set value
  timeClient.update();

  float ppm = getMqSensorValue();
  boolean soundState = detectSound();
  String currentTime = timeClient.getFormattedTime();
  if (soundState == true) {
    //    Firebase.push("SoundQuality","LOUD");
    StaticJsonBuffer<100> jsonBuffer;
    JsonObject& clientData = jsonBuffer.createObject();
    clientData["sensor"] = "microphone";
    clientData["time"] = currentTime;
    clientData["SoundState"] = "LOUD";
    Firebase.push("SoundState", clientData);
    checkFirebaseFail();
  } else {
    //    Firebase.push("SoundQuality","Ambient");
    StaticJsonBuffer<100> jsonBuffer;
    JsonObject& clientData = jsonBuffer.createObject();
    clientData["sensor"] = "microphone";
    clientData["time"] = currentTime;
    clientData["SoundState"] = "Ambient";
    Firebase.push("SoundState", clientData);
    checkFirebaseFail();
  }
  //  Firebase.push("AirQuality", ppm);
  if (ppm > 0) {
    StaticJsonBuffer<100> jsonBuffer;
    JsonObject& clientData = jsonBuffer.createObject();
    clientData["sensor"] = "mq-135";
    clientData["time"] = currentTime;
    clientData["AirQuality"] = ppm;
    Firebase.push("QualityIndex", clientData);
    checkFirebaseFail();
  }

  delay(1000);
}

void checkFirebaseFail() {
  if (Firebase.failed()) {
    Serial.print("setting /number failed:");
    Serial.println(Firebase.error());
    firebaseReconnect();
    return;
  }
}

void firebaseReconnect() {
  Serial.println("Trying to reconnect to firebase");
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  delay(1000);
}

float getMqSensorValue() {
  float sum = 0;
  float ppm[20];
  int maxN = 20;
  for (int i = 0; i < maxN; i++) {
    ppm[i] = gasSensor.getPPM();
    Serial.print("CO2 ppm value : ");
    Serial.println(ppm[i]);
    sum += ppm[i];
    delay(1000);
  }
  float avg = sum / (float)maxN;
  Serial.println(avg);
  return avg;
}

boolean detectSound() {
  int soundValue = digitalRead(SOUNDPIN);
  if (!isSoundDetected && millis() - lastSoundDetectTime > 500) {
    if (soundValue == LOW) {
      lastSoundDetectTime = millis();
      isSoundDetected = true;
    } else {
      isSoundDetected = false;
    }
  }
  return isSoundDetected;
}
