package info.projectepic.epicapp;

import android.app.Activity;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.ConnectivityManager;
import android.net.wifi.WifiManager;
import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Build;
import android.os.Parcelable;
import android.provider.Settings;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.telephony.SubscriptionManager;
import android.telephony.TelephonyManager;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.lang.reflect.Field;
import java.lang.reflect.InvocationTargetException;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;


public class MainActivity extends ActionBarActivity {

    //private variables used
    private PendingIntent pendingIntent;
    private IntentFilter[] intentFiltersArray;
    private NfcAdapter mAdapter;
    private String FileName="APPDATA";
    //Storing info
    private List<String> restoreSettings = new ArrayList<String>();

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        //Event listeners for the buttons
        View.OnClickListener ListenerEnter=
                new View.OnClickListener(){
                    @Override
                    public void onClick(View view) {
                        StoreSnapshot();
                    }
                };
        View.OnClickListener ListenerLeave=
                new View.OnClickListener(){
                    @Override
                    public void onClick(View view) {
                        //Implement event handling
                        LoadSnapShot();
                    }
                };

        Button butEnter = (Button)findViewById(R.id.button);
        butEnter.setOnClickListener(ListenerEnter);
        Button butLeav = (Button)findViewById(R.id.button2);
        butLeav.setOnClickListener(ListenerLeave);
        mAdapter = NfcAdapter.getDefaultAdapter(this);
        pendingIntent = PendingIntent.getActivity(
                this, 0, new Intent(this, getClass()).addFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP), 0);
        IntentFilter ndef = new IntentFilter(NfcAdapter.ACTION_NDEF_DISCOVERED);
        try {
            ndef.addDataType("*/*");    /* Handles all MIME based dispatches.
                                       You should specify only the ones that you need. */
        }
        catch (IntentFilter.MalformedMimeTypeException e) {
            throw new RuntimeException("fail", e);
        }
        intentFiltersArray = new IntentFilter[] {ndef, };

    }
    @Override
    public void onPause() {

        mAdapter.disableForegroundDispatch(this);
        super.onPause();
    }
    @Override
    public void onResume() {
        super.onResume();
        mAdapter.enableForegroundDispatch(this, pendingIntent, intentFiltersArray, null);
    }
    @Override
    public void onNewIntent(Intent intent) {
        String action = intent.getAction();
        try
        {
            // NFC transfer. Receiving message here.
            if(action != null && action.equals(NfcAdapter.ACTION_NDEF_DISCOVERED))
            {
                Parcelable[] parcelables = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);
                NdefMessage inNdefMessage = (NdefMessage) parcelables[0];
                NdefRecord[] inNdefRecords = inNdefMessage.getRecords();
                NdefRecord NdefRecord_0 = inNdefRecords[0];
                String inMsg = new String(NdefRecord_0.getPayload());

                //Toast.makeText(getApplicationContext(), "Toasty: " + inMsg + action.toString(), Toast.LENGTH_LONG).show();
                TextView tv = (TextView)findViewById(R.id.textView);
                tv.setText(inMsg);
            }
        }
        catch(Exception e)
        {
            //Log.e("NFC", e.getMessage());
        }
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        // Handle action bar item clicks here. The action bar will
        // automatically handle clicks on the Home/Up button, so long
        // as you specify a parent activity in AndroidManifest.xml.
        int id = item.getItemId();

        //noinspection SimplifiableIfStatement
        if (id == R.id.action_settings) {
            return true;
        }

        return super.onOptionsItemSelected(item);
    }






    /**
     * The functionality provided by the StoreSnapshot function is to store the state of all the
     * communication networks and there devices to a local device and turn off all the communication
     * devices that were turned on.
     *
     * @param bt - Stores an object that connects and controls the Bluetooth Adapter.
     * @param wifi - Stores an object that connects and controls the WiFi service.
     * @param theData - A string of the devices that were on sperated by a ':'.
     * @param fs - Opens a stream for data to be stored to a private file.
     */
    private void StoreSnapshot()
    {

        BluetoothAdapter bt = BluetoothAdapter.getDefaultAdapter();
        WifiManager wifi = (WifiManager)getSystemService(Context.WIFI_SERVICE);

        if(bt!=null)
        {
            if(bt.isEnabled())
            {
                restoreSettings.add("bt");
                bt.disable();
            }
        }

        if (wifi!=null)
        {
            if(wifi.isWifiEnabled()) {
                restoreSettings.add("wifi");
                wifi.setWifiEnabled(false);
            }
        }
        //Turn mobile off (Is trickey to do)
        if (isMobileDataEnabledFromLollipop(getApplicationContext()))
        {
            try {
                setMobileNetworkfromLollipop(getApplicationContext(),0);
                restoreSettings.add("mobi");
            }
            catch (Exception e)
            {}
        }

        //Store data locally on the device
        String theData = "";

        for(int i = 0; i < restoreSettings.size(); i++)
        {
            theData += restoreSettings.get(i);
            if (i < (restoreSettings.size()-1))
            {
                theData += ":";
            }
        }
        try
        {
            FileOutputStream fs = openFileOutput(FileName, Context.MODE_PRIVATE);
            fs.write(theData.getBytes());
            fs.close();

        }
        catch (Exception e)
        {}

    }

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

    private void LoadSnapShot()
    {
        //Get data from file if array is empty
        if (restoreSettings.size() == 0)
        {
            try
            {
                FileInputStream fs = openFileInput(FileName);
                String getData = convertStreamToString(fs);
                String[] split = getData.split(":");
                fs.close();
                for (int i = 0; i < split.length;i++)
                {
                    restoreSettings.add(split[i]);
                }
                //Reset data on file
                FileOutputStream fos = openFileOutput(FileName, Context.MODE_PRIVATE);

                fos.close();
            }
            catch (Exception e)
            {}
        }

        BluetoothAdapter bt = BluetoothAdapter.getDefaultAdapter();
        WifiManager wifi = (WifiManager)getSystemService(Context.WIFI_SERVICE);
        for(int i = 0; i < restoreSettings.size(); i++)
        {
            if(restoreSettings.get(i).equals("bt"))
            {
                bt.enable();
            }
            else if(restoreSettings.get(i).equals("mobi"))
            {
                try {
                    setMobileNetworkfromLollipop(getApplicationContext(), 1);
                }
                catch (Exception e)
                {
                    TextView tv = (TextView)findViewById(R.id.textView);
                    tv.setText(e.toString());
                }
            }
            else if(restoreSettings.get(i).equals("wifi"))
            {
                wifi.setWifiEnabled(true);
            }
        }
    }

   /*Functions to enable and disable mobile data (3g/4g)*/
   private static boolean isMobileDataEnabledFromLollipop(Context context) {
       boolean state = false;
       if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
           state = Settings.Global.getInt(context.getContentResolver(), "mobile_data", 0) == 1;
       }
       return state;
   }

    private static String getTransactionCode(Context context) throws Exception {
        try {
            final TelephonyManager mTelephonyManager = (TelephonyManager) context.getSystemService(Context.TELEPHONY_SERVICE);
            final Class<?> mTelephonyClass = Class.forName(mTelephonyManager.getClass().getName());
            final Method mTelephonyMethod = mTelephonyClass.getDeclaredMethod("getITelephony");
            mTelephonyMethod.setAccessible(true);
            final Object mTelephonyStub = mTelephonyMethod.invoke(mTelephonyManager);
            final Class<?> mTelephonyStubClass = Class.forName(mTelephonyStub.getClass().getName());
            final Class<?> mClass = mTelephonyStubClass.getDeclaringClass();
            final Field field = mClass.getDeclaredField("TRANSACTION_setDataEnabled");
            field.setAccessible(true);
            return String.valueOf(field.getInt(null));
        } catch (Exception e) {
            // The "TRANSACTION_setDataEnabled" field is not available,
            // or named differently in the current API level, so we throw
            // an exception and inform users that the method is not available.
            throw e;
        }
    }

    private static void executeCommandViaSu(Context context, String option, String command) {
        boolean success = false;
        String su = "su";
        for (int i=0; i < 3; i++) {
            // Default "su" command executed successfully, then quit.
            if (success) {
                break;
            }
            // Else, execute other "su" commands.
            if (i == 1) {
                su = "/system/xbin/su";
            } else if (i == 2) {
                su = "/system/bin/su";
            }
            try {
                // Execute command as "su".
                Runtime.getRuntime().exec(new String[]{su, option, command});
            } catch (IOException e) {
                success = false;
                // Oops! Cannot execute `su` for some reason.
                // Log error here.
            } finally {
                success = true;
            }
        }
    }

    public static void setMobileNetworkfromLollipop(Context context,int mobileState) throws Exception {
        String command = null;
        int state = mobileState;
        try {
            // Get the current state of the mobile network.
            state = mobileState;
            // Get the value of the "TRANSACTION_setDataEnabled" field.
            String transactionCode = getTransactionCode(context);
            // Android 5.1+ (API 22) and later.
            if (Build.VERSION.SDK_INT > Build.VERSION_CODES.LOLLIPOP) {
                //noinspection ResourceType
                SubscriptionManager mSubscriptionManager = (SubscriptionManager) context.getSystemService(Context.TELEPHONY_SUBSCRIPTION_SERVICE);
                // Loop through the subscription list i.e. SIM list.
                for (int i = 0; i < mSubscriptionManager.getActiveSubscriptionInfoCountMax(); i++) {
                    if (transactionCode != null && transactionCode.length() > 0) {
                        // Get the active subscription ID for a given SIM card.
                        int subscriptionId = mSubscriptionManager.getActiveSubscriptionInfoList().get(i).getSubscriptionId();
                        // Execute the command via `su` to turn off
                        // mobile network for a subscription service.
                        command = "service call phone " + transactionCode + " i32 " + subscriptionId + " i32 " + state;
                        executeCommandViaSu(context, "-c", command);
                    }
                }
            } else if (Build.VERSION.SDK_INT == Build.VERSION_CODES.LOLLIPOP) {
                // Android 5.0 (API 21) only.
                if (transactionCode != null && transactionCode.length() > 0) {
                    // Execute the command via `su` to turn off mobile network.
                    command = "service call phone " + transactionCode + " i32 " + state;
                    executeCommandViaSu(context, "-c", command);
                }
            }
        } catch(Exception e) {
            // Oops! Something went wrong, so we throw the exception here.
            throw e;
        }
    }


}
