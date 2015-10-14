# Project-EPIC
`Eavesdropping Protection In Conclave`

The purpose of the EPIC(Eavesdropping protection in Conclave) project is to protect the confidential information discussed in a meeting. This is achieved by making sure the users phone or tablets data, wifi and GSM are switched off during the meeting.

This EPIC project consist of a server, Android application, NFC Node, Website, and an Intel Edison device. 
The Android device is held over the NFC Node. The NFC then sends a request to the server via the Edison to enter the meeting. The server then responds with access granted or not. If access is granted, the user may the proceed to the meeting and the data, wifi and GSM of the device is turned off. When the user then exists the meeting, the device is held over the Node again and the previous state of the phone is restored. 
The website is used to register, create a new meeting and to query the attendance log of any past meeting.
