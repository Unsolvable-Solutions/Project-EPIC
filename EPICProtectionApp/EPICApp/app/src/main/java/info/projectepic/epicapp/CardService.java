package info.projectepic.epicapp;

import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;

/**
 * Created by Draak Koning on 2015-07-13.
 */
public class CardService extends HostApduService {
    @Override
    public byte[] processCommandApdu(byte[] apdu, Bundle extras) {
        return "IT WORKS!".getBytes();
    }

    @Override
    public void onDeactivated(int reason) {

    }
}
