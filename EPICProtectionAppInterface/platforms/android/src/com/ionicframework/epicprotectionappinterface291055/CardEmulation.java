package com.ionicframework.epicprotectionappinterface291055;

import android.content.Context;
import android.nfc.cardemulation.HostApduService;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;


public class CardEmulation extends HostApduService {

    @Override
    public void onDeactivated(int reason)
    {}

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
    @Override
    public byte[] processCommandApdu(byte[] commandApdu, Bundle extras)
    {
        String EmpIDFile = "EMPID";
        String getData = "No";
        try
        {
            //FileInputStream fs = openFileInput(EmpIDFile);
            getData = "*" + getDeviceId().trim()+"#";
            //Toast.makeText(getApplicationContext(), getData, Toast.LENGTH_LONG).show();
            //fs.close();
        }
        catch (Exception E)
        {}

        /*byte[] dataToEncrypt = getData.getBytes();
        byte[] keyStrt = "wZ148gNdk4Eytt6".getBytes();

        try {
            KeyGenerator kgen = KeyGenerator.getInstance("AES");
            SecureRandom sr = SecureRandom.getInstance("SHA1PRNG");

            sr.setSeed(keyStrt);
            kgen.init(128, sr); // 192 and 256 bits may not be available
            SecretKey skey = kgen.generateKey();
            byte[] key = skey.getEncoded();
            try {
                byte[] encryptedData = encrypt(key, keyStrt);
                return encryptedData;
            } catch (Exception e) {
            }
        }
        catch (Exception ee){}*/
        return getData.getBytes();
    }

    /**
     * The functionality provided by the convertStreamToString is to convert an input stream of
     * bytes to string format.
     *
     * @param is - The input stream that the bytes are coming from
     * @param reader - Creates a buffer reader for the input stream
     * @param sb - Saves a String of all the lines being read from the buffer.
     * @param line - Is used to temporaryrily store each line read from the buffer reader.
     * @param sendStr - Stores the complete string to be transfered.
     *
     * @return A string representation of the bytes from the input stream.
     */

    //If problem exists this method was static
    public String convertStreamToString(InputStream is) throws Exception {
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        StringBuilder sb = new StringBuilder();
        String line = null;
        while ((line = reader.readLine()) != null) {
            sb.append(line).append("\n");
        }
        reader.close();
        //String sendStr = ""+getDeviceId()+":"+sb.toString();
        return sb.toString();
    }

    /**The functionality provided by the getDeviceId is to get the unique id of the android device
     * and return it. This is an extra security autentication method.
     *
     * @param tm - Stores a service that can retrieve the device's id.
     * @param id - the device id is stored here
     *
     * @return A string representation of the id is returned.
     * */
    private String getDeviceId()
    {
        final TelephonyManager tm = (TelephonyManager) getBaseContext().getSystemService(Context.TELEPHONY_SERVICE);
        String id = tm.getDeviceId();

        return id;
    }

    /*The encrypt converts raw byte data to "garbage" to be transfered for protection.*/
    private static byte[] encrypt(byte[] raw, byte[] clear) throws Exception {
        SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.ENCRYPT_MODE, skeySpec);
        byte[] encrypted = cipher.doFinal(clear);
        return encrypted;
    }

    /*if we need to decrypt the data*/
    private static byte[] decrypt(byte[] raw, byte[] encrypted) throws Exception {
        SecretKeySpec skeySpec = new SecretKeySpec(raw, "AES");
        Cipher cipher = Cipher.getInstance("AES");
        cipher.init(Cipher.DECRYPT_MODE, skeySpec);
        byte[] decrypted = cipher.doFinal(encrypted);
        return decrypted;
    }
}
