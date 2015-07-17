package info.projectepic.epicapp;

import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;

/**
 * Created by Draak Koning on 2015-07-13.
 */
public class CardService extends HostApduService {
    @Override
    /**
     * This class is used to emulate a NFC tag that will be readable by the arduino NFC reader.*/

    /**
     * The functionality provided by the processCommandApdu is to return a byte array containing
     * the data that the NFC reader has requested for.
     *
     * @return Returns a byte array carrying data to the requested reader.
     */
    public byte[] processCommandApdu(byte[] apdu, Bundle extras) {
        return "IT WORKS!".getBytes();
    }

    @Override
    public void onDeactivated(int reason) {

    }
}
