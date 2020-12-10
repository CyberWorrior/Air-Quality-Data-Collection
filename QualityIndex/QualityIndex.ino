
#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <ArduinoJson.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <WiFiClient.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
#include "MQ135.h"

// Set these to run example.
#define WIFI_SSID "skynet"
#define WIFI_PASSWORD "9448893603"


// MQ-135 sensor values
#define ANALOGPIN A0    //  Define Analog PIN on Arduino Board
#define RZERO 783.05    //  Define RZERO Calibration Value

//sound sensor values
#define SOUNDPIN D5
boolean isSoundDetected = false;
unsigned long lastSoundDetectTime;

//UTC time offsets in millis
const long utcOffsetInSeconds = 19800;
String server = "http://secret-fjord-75464.herokuapp.com";
float sum = 0.0;
float ppm[20];
int maxN = 20;
int N = 0;

//NTP client to get time
WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, "pool.ntp.org", utcOffsetInSeconds);

//http to connect to nodejs server running in web
HTTPClient http;
int httpResponseCode;

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

  Serial.print("Rzero: ");
  Serial.println(gasSensor.getRZero());
  timeClient.begin();
}


void loop() {
  // set value
  timeClient.update();

  boolean soundState = detectSound();
  String currentTime = timeClient.getFormattedTime();
  long unsigned int epocTime = timeClient.getEpochTime();

  ppm[N] = gasSensor.getPPM();
  Serial.print("CO2 ppm value : ");
  Serial.print(ppm[N]);
  Serial.print("     ");
  Serial.print("Sound State : ");
  Serial.println(soundState);
  sum += ppm[N];
  N++;

  if (N == 20) {
    if (soundState == true) {
      String serverPath = server + "/soundstate" + "/?sensor=microphone" + "&soundstate=LOUD" + "&timestamp=" + epocTime + "&stringtime=" + currentTime;
      http.begin(serverPath.c_str());
      httpResponseCode = http.GET();
      checkHttpFail();
    } else {
      String serverPath = server + "/soundstate" + "/?sensor=microphone" + "&soundstate=AMBIENT" + "&timestamp=" + epocTime + "&stringtime=" + currentTime;
      http.begin(serverPath.c_str());
      httpResponseCode = http.GET();
      checkHttpFail();
    }
    float avg = sum / (float)maxN;
    N = 0;
    sum = 0;
    String serverPath = server + "/airquality" + "/?sensor=mq-135" + "&airquality=" + avg + "&timestamp=" + epocTime + "&stringtime=" + currentTime;
    http.begin(serverPath.c_str());
    httpResponseCode = http.GET();
    checkHttpFail();
  }

  delay(30000);
}

void checkHttpFail() {
  if (httpResponseCode > 0) {
    Serial.print("HTTP Response code: ");
    Serial.println(httpResponseCode);
    String payload = http.getString();
    Serial.println(payload);
  }
  else {
    Serial.print("Error code: ");
    Serial.println(httpResponseCode);
  }
  http.end();
}


boolean detectSound() {
  int soundValue = digitalRead(SOUNDPIN);
  if (millis() - lastSoundDetectTime > 500) {
    if (soundValue == HIGH) {
      lastSoundDetectTime = millis();
      isSoundDetected = true;
    } else {
      isSoundDetected = false;
    }
  }
  return isSoundDetected;
}
