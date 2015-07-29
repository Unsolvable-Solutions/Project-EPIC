package info.projectepic.epicappfor442;

import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;

/**
 * Created by Diaman on 7/27/2015.
 */
public class CardEmulation extends HostApduService {

    @Override
    public void onDeactivated(int reason)
    {}

    @Override
    public byte[] processCommandApdu(byte[] commandApdu, Bundle extras)
    {
        return "IT WORKS!".getBytes();
    }

}
