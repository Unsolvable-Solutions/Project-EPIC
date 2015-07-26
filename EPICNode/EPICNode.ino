// ***********************INCLUDES & DEFINES************************** //
#include <SPI.h>
#include <PN532_SPI.h>
#include <PN532Interface.h>
#include <PN532.h>
#include <emulatetag.h>
#include <NdefMessage.h>
#include <Adafruit_NeoPixel.h>
#ifdef __AVR__
  #include <avr/power.h>
#endif
#define PIN 3

// ***********************GLOBALS************************** //
PN532_SPI pn532spi(SPI, 10);
EmulateTag nfcEmulate(pn532spi);
uint8_t ndefBuf[120];
NdefMessage message;
int messageSize;
uint8_t uid[3] = { 0x12, 0x34, 0x56 };
PN532 nfc(pn532spi);
Adafruit_NeoPixel strip = Adafruit_NeoPixel(8, PIN, NEO_GRB + NEO_KHZ800);

// ***********************SETUP************************** //
void setup()
{    
    Serial.begin(115200);
    //Serial.println("-------Peer to Peer HCE--------");
    
    nfc.begin();
    
    uint32_t versiondata = nfc.getFirmwareVersion();
    if (! versiondata) {
      Serial.print("Didn't find PN53x board");
      while (1); // halt
    }
    
    // Got ok data, print it out!
    //Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX); 
    //Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
    //Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
    
    // Set the max number of retry attempts to read from a card
    // This prevents us from waiting forever for a card, which is
    // the default behaviour of the PN532.
    nfc.setPassiveActivationRetries(0x00);
    
    // configure board to read RFID tags
    nfc.SAMConfig();
    
    #if defined (__AVR_ATtiny85__)
      if (F_CPU == 16000000) clock_prescale_set(clock_div_1);
    #endif
    
    strip.begin();
    strip.show(); // Initialize all pixels to 'off'
}

// ***********************LOOP************************** //
void loop()
{
  // configure board to read RFID tags
  nfc.SAMConfig();
  bool success;
  
  uint8_t responseLength = 32;
  
  //Serial.println("Waiting for an ISO14443A card");
  waiting();
  
  // set shield to inListPassiveTarget
  success = nfc.inListPassiveTarget();

  if(success) 
  {
    Serial.println("Found something!");           
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
      
      uint8_t apdu[] = "requestUserId";
      uint8_t back[32];
      uint8_t length = 32; 

      success = nfc.inDataExchange(apdu, sizeof(apdu), back, &length);
      
      if(success) 
      {
        Serial.print("responseLength: "); Serial.println(length);
        nfc.PrintHexChar(back, length);
        sendMessage(isAllowed());
      }
      else 
      {
        setColor(255, 0, 0);  // red
        Serial.println("Broken connection?"); 
      }
    }
    else 
    {
      delay(1000);
      setColor(255, 0, 0);  // red
      Serial.println("Failed sending SELECT AID"); 
    }
  }
}

// ***********************WAITING************************** //
void waiting()
{
  for (int q=0; q < 8; q++) {
    for (int i=0; i < strip.numPixels(); i++) {
      strip.setPixelColor(i, strip.Color(255, 165, 0));
    }
    for (int i=0; i < 4; i++) {
      strip.setPixelColor((i+q)%8, strip.Color(255, 65, 0));
    }
    strip.show();
    delay(50);
  }
}

// ***********************IS ALLOWED************************** //
int isAllowed()
{
  for(int x=0; x<8; x++) // For each light that must turn blue
  {
    int side = (x%2)?-7:0; // Define which side to start
    int direct = (x%2)?-1:1; // Define direction of travel
    for(int runner=0; runner<8; runner++) // For each light where the runner will go
    {
      strip.setPixelColor(abs(runner+side), strip.Color(255, 255, 255)); // Move runner to new position
      strip.setPixelColor(abs(runner+side)-direct, 
                         (abs(runner+side)-direct > x)?0:strip.Color(0, 0, 255)); // Remove runner from previous position
      strip.show(); // Apply updates to the lights
      delay(50); // Wait a moment
    }
  }
  
  int permission = Serial.read(); // Check results from the server
  return permission;
}

// ***********************PRINT RESPONSE************************** //
void printResponse(uint8_t *response, uint8_t responseLength)
{
  
   String respBuffer;

    for (int i = 0; i < responseLength; i++) {
      
      if (response[i] < 0x10) 
        respBuffer = respBuffer + "0"; //Adds leading zeros if hex value is smaller than 0x10
      
      respBuffer = respBuffer + String(response[i], HEX) + " ";                        
    }

    Serial.print("response: "); Serial.println(respBuffer);
}

// ***********************SETUP NFC************************** //
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

// ***********************SET COLOR************************** //
void setColor(int red, int green, int blue)
{
  for(int x=0; x<8; x++) // For each light
  {
    strip.setPixelColor(x, strip.Color(red, green, blue));
  }
  strip.show(); // Apply updates to the lights 
}

// ***********************SEND MESSSAGE************************** //
void sendMessage(int result)
{
    message = NdefMessage();
    message.addTextRecord((result == 116)?"Access Approved":"Access Denied");
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
    
    for(int x=0; x<8; x++) // Turn each light either red or green
    {
      (result == 116)?strip.setPixelColor(x, strip.Color(0, 255, 0)):strip.setPixelColor(x, strip.Color(255, 0, 0));
    }
    strip.show(); // Apply updates to the lights
    
    // or start emulation with timeout
    if(!nfcEmulate.emulate(500))
    {
      Serial.println("timed out");
    }
    
    delay(2000); // Wait a moment
}
