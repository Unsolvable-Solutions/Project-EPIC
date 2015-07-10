#include <SPI.h>
#include <PN532_SPI.h>
#include <PN532Interface.h>
#include <PN532.h>


#include <emulatetag.h>
#include <NdefMessage.h>

PN532_SPI pn532spi(SPI, 10);

EmulateTag nfcEmulate(pn532spi);
uint8_t ndefBuf[120];
NdefMessage message;
int messageSize;

uint8_t uid[3] = { 0x12, 0x34, 0x56 };


PN532 nfc(pn532spi);


int redPin = 6;
int greenPin = 3;
int bluePin = 5;

//uncomment this line if using a Common Anode LED
#define COMMON_ANODE

void setup()
{    
    Serial.begin(115200);
    Serial.println("-------Peer to Peer HCE--------");
    
    pinMode(redPin, OUTPUT);
    pinMode(greenPin, OUTPUT);
    pinMode(bluePin, OUTPUT);  
    
    setColor(255, 0, 0);  // red
    
    nfc.begin();
    
    uint32_t versiondata = nfc.getFirmwareVersion();
    if (! versiondata) {
      Serial.print("Didn't find PN53x board");
      while (1); // halt
    }
    
    // Got ok data, print it out!
    Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX); 
    Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
    Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
    
    // Set the max number of retry attempts to read from a card
    // This prevents us from waiting forever for a card, which is
    // the default behaviour of the PN532.
    //nfc.setPassiveActivationRetries(0xFF);
    
    // configure board to read RFID tags
    nfc.SAMConfig();
}

void loop()
{
  // configure board to read RFID tags
  nfc.SAMConfig();
  bool success;
  
  uint8_t responseLength = 32;
  
  Serial.println("Waiting for an ISO14443A card");
  
  // set shield to inListPassiveTarget
  success = nfc.inListPassiveTarget();

  if(success) 
  {
   
    Serial.println("Found something!");
    setColor(255, 255, 255);  // white             
    uint8_t selectApdu[] = { 0x00, /* CLA */
                              0xA4, /* INS */
                              0x04, /* P1  */
                              0x00, /* P2  */
                              0x07, /* Length of AID  */
                              0xF0, 0x39, 0x41, 0x48, 0x14, 0x81, 0x00, /* AID defined on Android App */
                              0x00  /* Le  */ };
                              
    uint8_t response[32];  
     
    success = nfc.inDataExchange(selectApdu, sizeof(selectApdu), response, &responseLength);
    
    if(success) 
    {
      
      Serial.print("responseLength: "); Serial.println(responseLength);
       
      nfc.PrintHexChar(response, responseLength);
      
      //do 
      //{
        uint8_t apdu[] = "requestUserId";
        uint8_t back[32];
        uint8_t length = 32; 

        success = nfc.inDataExchange(apdu, sizeof(apdu), back, &length);
        
        if(success) 
        {
         
          Serial.print("responseLength: "); Serial.println(length);
          nfc.PrintHexChar(back, length);
          sendMessage();
          setColor(0, 255, 0);  // green
        }
        else 
        {
          setColor(255, 0, 0);  // red
          Serial.println("Broken connection?"); 
        }
      //}
      //while(success);
    }
    else 
    {
      delay(1000);
      setColor(255, 0, 0);  // red
      Serial.println("Failed sending SELECT AID"); 
    }
  }

  delay(2000);
  setColor(255, 0, 0);  // red
}

void printResponse(uint8_t *response, uint8_t responseLength) {
  
   String respBuffer;

    for (int i = 0; i < responseLength; i++) {
      
      if (response[i] < 0x10) 
        respBuffer = respBuffer + "0"; //Adds leading zeros if hex value is smaller than 0x10
      
      respBuffer = respBuffer + String(response[i], HEX) + " ";                        
    }

    Serial.print("response: "); Serial.println(respBuffer);
}

void setupNFC() {
 
  nfc.begin();
    
  uint32_t versiondata = nfc.getFirmwareVersion();
  if (! versiondata) {
    Serial.print("Didn't find PN53x board");
    while (1); // halt
  }
  
  // Got ok data, print it out!
  Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX); 
  Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
  Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
  
  // configure board to read RFID tags
  //nfc.SAMConfig(); 
}

void setColor(int red, int green, int blue)
{
  #ifdef COMMON_ANODE
    red = 255 - red;
    green = 255 - green;
    blue = 255 - blue;
  #endif
  analogWrite(redPin, red);
  analogWrite(greenPin, green);
  analogWrite(bluePin, blue);  
}


void sendMessage()
{
    message = NdefMessage();
    message.addTextRecord("Android Test");
    messageSize = message.getEncodedSize();
    if (messageSize > sizeof(ndefBuf)) 
    {
        Serial.println("ndefBuf is too small");
        while (1) { }
    }
  
    Serial.print("Ndef encoded message size: ");
    Serial.println(messageSize);

    message.encode(ndefBuf);
  
    // comment out this command for no ndef message
    nfcEmulate.setNdefFile(ndefBuf, messageSize);
  
    // uid must be 3 bytes!
    nfcEmulate.setUid(uid);
  
    nfcEmulate.init();
  
  
    // uncomment for overriding ndef in case a write to this tag occured
    //nfc.setNdefFile(ndefBuf, messageSize); 
    
    // start emulation (blocks)
    //nfcEmulate.emulate();
        
    // or start emulation with timeout
    if(!nfcEmulate.emulate(2000))
    {
      Serial.println("timed out");
    }
}

