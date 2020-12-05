
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include "MQ135.h"

// Set these to run example.
#define FIREBASE_HOST "arduino-pollution-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "JLoueMInkwOXuDeFy6f20ZDDwLmwydXU42bWGmet"
#define WIFI_SSID "skynet"
#define WIFI_PASSWORD "9448893603"

// MQ-135 sensor values
#define ANALOGPIN A0    //  Define Analog PIN on Arduino Board
#define RZERO 312.11    //  Define RZERO Calibration Value
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
}


void loop() {
  // set value
  float ppm= getMqSensorValue();
  Firebase.set("AirQuality", ppm);
  // handle error
  if (Firebase.failed()) {
      Serial.print("setting /number failed:");
      Serial.println(Firebase.error());  
      firebaseReconnect();
      return;
  }
  delay(1000);
}

void firebaseReconnect(){
  Serial.println("Trying to reconnect to firebase");  
  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
  delay(1000);
}

float getMqSensorValue(){
    float sum=0;
    float ppm[20];
    int maxN = 20;
    for(int i = 0;i<maxN;i++){
      ppm[i] = gasSensor.getPPM(); 
      Serial.print("CO2 ppm value : ");
      Serial.println(ppm[i]);
      sum += ppm[i];
      delay(2000);
    }
    float avg = sum / (float)maxN;
    Serial.println(avg);
    return avg;
}
