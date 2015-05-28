#include <EEPROM.h>  // We are going to read and write PICC's UIDs from/to EEPROM
#include <SPI.h>      // RC522 Module uses SPI protocol
#include <MFRC522.h>   // Library for Mifare RC522 Devices

#define COMMON_ANODE

#ifdef COMMON_ANODE
#define LED_ON LOW
#define LED_OFF HIGH
#else
#define LED_ON HIGH
#define LED_OFF LOW
#endif

#define redLed 7
#define greenLed 6
#define blueLed 5

boolean red = false; // initialize to false
boolean green = false; // initialize to false
boolean orange = false; // initialize to false

int successRead; // Variable integer to keep if we have Successful Read from Reader

int recieved; // temporarily saves input from gateway

byte storedCard[4];   // Stores an ID read from EEPROM
byte readCard[4];           // Stores scanned ID read from RFID Module
byte masterCard[4]; // Stores master card's ID read from EEPROM

/* MOSI: Pin 11
 * MISO: Pin 12
 * SCK : Pin 13
 * SS : Pin 10
 * RST : Pin 9
 */

#define SS_PIN 10
#define RST_PIN 9
MFRC522 mfrc522(SS_PIN, RST_PIN);	// Create MFRC522 instance.

///////////////////////////////////////// Setup ///////////////////////////////////
void setup() {
  //Arduino Pin Configuration
  pinMode(redLed, OUTPUT);
  pinMode(greenLed, OUTPUT);
  pinMode(blueLed, OUTPUT);
  digitalWrite(redLed, LED_OFF); // Make sure led is off
  digitalWrite(greenLed, LED_OFF); // Make sure led is off
  digitalWrite(blueLed, LED_OFF); // Make sure led is off
  
  //Protocol Configuration
  Serial.begin(9600);	 // Initialize serial communications with PC
  SPI.begin();           // MFRC522 Hardware uses SPI protocol
  mfrc522.PCD_Init();    // Initialize MFRC522 Hardware
  Serial.println("Waiting PICCs to bo scanned :)");
  cycleLeds();    // Everything ready lets give user some feedback by cycling leds
}


///////////////////////////////////////// Main Loop ///////////////////////////////////
void loop () {
  getID(); // sets successRead to 1 when we get read from reader otherwise 0
  normalModeOn(); // Normal mode, blue Power LED is on, all others are off
  recieved = Serial.read();
  if (recieved != -1)
  {
    Serial.print("Recieved: ");
    Serial.println(recieved);
    if(recieved == 116)
    {
      green = true;
      orange = false;
      red = false;
    }
    else if(recieved == 102)
    {
      red = true;
      orange = false;
      green = false;
    }
  }
}

///////////////////////////////////////// Get PICC's UID ///////////////////////////////////
void getID() {
  // Getting ready for Reading PICCs
  if ( ! mfrc522.PICC_IsNewCardPresent()) { //If a new PICC placed to RFID reader continue
    return;
  }
  if ( ! mfrc522.PICC_ReadCardSerial()) { //Since a PICC placed get Serial and continue
    return;
  }
  /*byte sendData = 10111010;
  int result = mfrc522.PCD_CommunicateWithPICC(mfrc522.PCD_Transmit, 0x30, &sendData, 8);
  Serial.print("result: ");Serial.println(result);*/
  orange = true;
  red = false;
  green = false;
  //Serial.println("Phone scanned");
  for (int i = 0; i < 4; i++) {  // 
    readCard[i] = mfrc522.uid.uidByte[i];
    Serial.print(readCard[i], HEX);
  }
  Serial.println("");
  mfrc522.PICC_HaltA(); // Stop reading
  return;
}

///////////////////////////////////////// Cycle Leds (Program Mode) ///////////////////////////////////
void cycleLeds() {
  digitalWrite(redLed, LED_OFF); // Make sure red LED is off
  digitalWrite(greenLed, LED_ON); // Make sure green LED is on
  digitalWrite(blueLed, LED_OFF); // Make sure blue LED is off
  delay(200);
  digitalWrite(redLed, LED_OFF); // Make sure red LED is off
  digitalWrite(greenLed, LED_OFF); // Make sure green LED is off
  digitalWrite(blueLed, LED_ON); // Make sure blue LED is on
  delay(200);
  digitalWrite(redLed, LED_ON); // Make sure red LED is on
  digitalWrite(greenLed, LED_OFF); // Make sure green LED is off
  digitalWrite(blueLed, LED_OFF); // Make sure blue LED is off
  delay(200);
}

//////////////////////////////////////// Normal Mode Led  ///////////////////////////////////
void normalModeOn () {
  if (green)
  {
    digitalWrite(blueLed, LED_OFF); // Blue LED ON and ready to read card
    digitalWrite(redLed, LED_OFF); // Make sure Red LED is off
    digitalWrite(greenLed, LED_ON); // Make sure Green LED is off
    delay(1000);
    orange = false;
    red = false;
    green = false;
  }
  else if (red)
  {
    digitalWrite(blueLed, LED_OFF); // Blue LED ON and ready to read card
    digitalWrite(redLed, LED_ON); // Make sure Red LED is off
    digitalWrite(greenLed, LED_OFF); // Make sure Green LED is off
    delay(1000);
    orange = false;
    red = false;
    green = false;
  }
  else if (orange)
  {
    /*digitalWrite(blueLed, LED_ON); // Blue LED ON and ready to read card
    digitalWrite(redLed, LED_ON); // Make sure Red LED is off
    digitalWrite(greenLed, LED_ON); // Make sure Green LED is off*/
    cycleLeds();
  }
  else 
  {
    digitalWrite(blueLed, LED_ON); // Blue LED ON and ready to read card
    digitalWrite(redLed, LED_OFF); // Make sure Red LED is off
    digitalWrite(greenLed, LED_OFF); // Make sure Green LED is off
  }
}

