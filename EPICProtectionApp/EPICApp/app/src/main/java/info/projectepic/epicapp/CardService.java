package info.projectepic.epicapp;

import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;

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
     * @param EmpIDFile - Stores the name of the file that has the employee ID registered.
     * @param fs - Opens a stream for data to be stored to a private file.
     * @param theData - Stores a string representation of the data read from a file.
     *
     * @return Returns a byte array carrying data to the requested reader.
     */
    public byte[] processCommandApdu(byte[] apdu, Bundle extras) {
        String EmpIDFile = "EMPID";
        String getData = "";
        try
        {
            FileInputStream fs = openFileInput(EmpIDFile);
            getData = convertStreamToString(fs);

            fs.close();
        }
        catch (Exception E)
        {}


        return getData.getBytes();
    }

    @Override
    public void onDeactivated(int reason) {

    }

    /**
     * The functionality provided by the convertStreamToString is to convert an input stream of
     * bytes to string format.
     *
     * @param is - The input stream that the bytes are coming from
     * @param reader - Creates a buffer reader for the input stream
     * @param sb - Saves a String of all the lines being read from the buffer.
     * @param line - Is used to temporaryrily store each line read from the buffer reader.
     *
     * @return A string representation of the bytes from the input stream.
     */
    public static String convertStreamToString(InputStream is) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line = null;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }
        reader.close();
        return sb.toString();
    }
}
