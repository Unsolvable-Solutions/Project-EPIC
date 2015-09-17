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
PN532_SPI         pn532spi(SPI, 10);
EmulateTag        nfcEmulate(pn532spi);
uint8_t           ndefBuf[120];
NdefMessage       message;
int               messageSize;
uint8_t           uid[3] = { 0x12, 0x34, 0x56 };
PN532             nfc(pn532spi);
Adafruit_NeoPixel strip = Adafruit_NeoPixel(16, PIN, NEO_GRB + NEO_KHZ800);

// ***********************SETUP************************** //
/* The setup() function initializes some global variables and starts some proses that the program will use later. */
void setup()
{    
    Serial.begin(115200);
    nfc.begin();
    uint32_t versiondata = nfc.getFirmwareVersion();
    if (! versiondata) 
    {
      //Serial.print("Didn't find PN53x board");
      while (1); // halt
    }
    
    // To see more details about the board in the node, uncomment the following code.
    /*Serial.print("Found chip PN5"); Serial.println((versiondata>>24) & 0xFF, HEX); 
      Serial.print("Firmware ver. "); Serial.print((versiondata>>16) & 0xFF, DEC); 
      Serial.print('.'); Serial.println((versiondata>>8) & 0xFF, DEC);
     */
    
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
    
    while (Serial.read()!=114)
    {}
    //Serial.println("Node is now online");
}

// ***********************LOOP************************** //
/* The loop() function is a recuring block that will continue to check for any phone or tags being scanned. */
void loop()
{
  // configure board to read RFID tags
  nfc.SAMConfig();
  bool success;
  waiting();
  
  // set shield to inListPassiveTarget
  success = nfc.inListPassiveTarget();
  
  if (success) 
  {
    //Serial.println("Found something!");
    
    uint8_t selectApdu[] = { 
                             0x00,                                     /* CLA */
                             0xA4,                                     /* INS */
                             0x04,                                     /* P1  */
                             0x00,                                     /* P2  */
                             0x07,                                     /* Length of AID  */
                             0xF0, 0x39, 0x41, 0x48, 0x14, 0x81, 0x00, /* AID defined on Android App */
                             0x00                                      /* Le  */ 
                           };
    uint8_t responseLength = 32;
    uint8_t response[32];  
    uint8_t apdu[] = "requestUserId";
    uint8_t back[32];
    uint8_t length = 32;

    success = nfc.inDataExchange(selectApdu, sizeof(selectApdu), response, &responseLength);

    if (success) 
    {
      //Serial.print("responseLength: "); Serial.println(responseLength);
      //nfc.PrintHexChar(response, responseLength);
      success = nfc.inDataExchange(apdu, sizeof(apdu), back, &length);
      
      if (success) 
      {
        //Serial.print("responseLength: "); Serial.println(length);
        //nfc.PrintHexChar(back, length);
        char charArr[length];
        //Serial.print('*');
        while (Serial.available()) Serial.read();
        for (int x = 0; x < length; x++)
        {
          charArr[x] = back[x];
          Serial.print(charArr[x]);
        }
        while (Serial.available()) Serial.read();
        
        //Serial.println("");
        //String backStr = charArr;
        //Serial.println(backStr);
        sendMessage(isAllowed());
      }
      else 
      {
        setColor(255, 0, 0);  // red
        delay(1000);
        //Serial.println("Broken connection?"); 
      }
    }
    else 
    {
      setColor(255, 0, 0);  // red
      delay(1000);
      //Serial.println("Failed sending SELECT AID"); 
    }
  }
}

// ***********************WAITING************************** //
/* The waiting() function will make the lights run with orange bars. */
void waiting()
{
  for (int q=0; q < 16; q++) 
  {
    //for (int i=0; i < strip.numPixels(); i++)
      //strip.setPixelColor(i, strip.Color(0, 0, 20));
    
    for (int i=0; i < 13; i++)
      strip.setPixelColor((i+q)%16, strip.Color(0, 0, i*7));
    
    strip.show();
    delay(50);
  }
}

// ***********************IS ALLOWED************************** //
/* The isAllowed() function will check the servers' response and return the value. */
int isAllowed()
{
  for (int x=0; x<21; x+=3) // For each light that must turn blue
  {
    for (int runner=0; runner<17; runner++) // For each light where the runner will go
    {
      strip.setPixelColor(runner, strip.Color(255, 255, 255)); // Move runner to new position
      strip.setPixelColor((runner-1)%16, (runner > x)?0:strip.Color(255, 65, 0)); // Remove runner from previous position
      strip.show(); // Apply updates to the lights
      delay(20); // Wait a moment
    }
  }
  
  int permission = Serial.read(); // Check response from the server
  return permission;
}

// ***********************SET COLOR************************** //
/* The setColor() function takes the three values that make up the RGB (Red-Green-Blue) value of a color and sets all the lights to that color. */
void setColor(int red, int green, int blue)
{
  for (int x=0; x<16; x++) // For each light
    strip.setPixelColor(x, strip.Color(red, green, blue));
    
  strip.show(); // Apply updates to the lights 
}

// ***********************SEND MESSSAGE************************** //
/* The sendMessage() function emulates a NFC Tag with a certain value on it depending on what the value of the response is from the server. */
void sendMessage(int result)
{
    message = NdefMessage();
    String msg;
    if(result == 116)
      msg = "1";
    else if(result == 101)
      msg = "2";
    else
      msg = "0";
    message.addMimeMediaRecord("text/plain", msg);
    messageSize = message.getEncodedSize();
    if (messageSize > sizeof(ndefBuf)) 
    {
        //Serial.println("ndefBuf is too small");
        while (1);
    }
  
    //Serial.print("Ndef encoded message size: ");
    //Serial.println(messageSize);

    message.encode(ndefBuf);
  
    // comment out this command for no ndef message
    nfcEmulate.setNdefFile(ndefBuf, messageSize);
  
    // uid must be 3 bytes!
    nfcEmulate.setUid(uid);
  
    nfcEmulate.init();
  
    if (result == 116)
      setColor(0, 255, 0);
    else if(result == 101)
      setColor(255, 65, 0);
    else
      setColor(255, 0, 0);
    
    // or start emulation with timeout
    if (!nfcEmulate.emulate(500))
      //Serial.println("timed out");
    
    delay(2000); // Wait a moment
}

