package info.projectepic.epicapp;

import android.app.Activity;
import android.app.PendingIntent;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.net.wifi.WifiManager;
import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.NfcAdapter;
import android.nfc.Tag;
import android.os.Parcelable;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import android.widget.Toast;

import java.util.ArrayList;
import java.util.List;


public class MainActivity extends ActionBarActivity {

    //private variables used
    private PendingIntent pendingIntent;
    private IntentFilter[] intentFiltersArray;
    private NfcAdapter mAdapter;

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
        //handleIntent(getIntent());
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


    private void handleIntent(Intent intent)
    {
        NdefMessage msg;
        if (NfcAdapter.ACTION_NDEF_DISCOVERED.equals(getIntent().getAction())) {
            Parcelable[] rawMsgs = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);
            if (rawMsgs != null) {
                msg = (NdefMessage)rawMsgs[0];
                TextView tv = (TextView)findViewById(R.id.textView);
                tv.setText(new String(msg.getRecords()[0].getPayload()));
            }
        }
    }
    //Storing info
    List<String> restoreSettings = new ArrayList<String>();
    //My Functions
    private void StoreSnapshot()
    {
        //Store Settings
        NfcAdapter nfc = NfcAdapter.getDefaultAdapter(this);
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

        if(nfc!=null)
        {
            if(nfc.isEnabled())
            {
                restoreSettings.add("nfc");

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
    }

    private void LoadSnapShot()
    {
        NfcAdapter nfc = NfcAdapter.getDefaultAdapter(this);
        BluetoothAdapter bt = BluetoothAdapter.getDefaultAdapter();
        WifiManager wifi = (WifiManager)getSystemService(Context.WIFI_SERVICE);
        for(int i = 0; i < restoreSettings.size(); i++)
        {
            if(restoreSettings.get(i).equals("bt"))
            {
                bt.enable();
            }
            else if(restoreSettings.get(i).equals("nfc"))
            {
                //enable nfc
            }
            else if(restoreSettings.get(i).equals("wifi"))
            {
                wifi.setWifiEnabled(true);
            }
        }
    }

    /*FORGROUND DISPATCHING*/
    public void setupForegroundDispatch(final Activity activity, NfcAdapter adapter) {
        final Intent intent = new Intent(activity.getApplicationContext(), activity.getClass());
        intent.setFlags(Intent.FLAG_ACTIVITY_SINGLE_TOP);

        final PendingIntent pendingIntent = PendingIntent.getActivity(activity.getApplicationContext(), 0, intent, 0);

        IntentFilter[] filters = new IntentFilter[1];
        String[][] techList = new String[][]{};

        // Notice that this is the same filter as in our manifest.
        filters[0] = new IntentFilter();
        filters[0].addAction(NfcAdapter.ACTION_NDEF_DISCOVERED);
        filters[0].addCategory(Intent.CATEGORY_DEFAULT);
        try {
            filters[0].addDataType("text/plain");
        } catch (IntentFilter.MalformedMimeTypeException e) {
            throw new RuntimeException("Check your mime type.");
        }
        handleIntent(intent);
        adapter.enableForegroundDispatch(activity, pendingIntent, filters, techList);
    }

    public static void stopForegroundDispatch(final Activity activity, NfcAdapter adapter) {
        adapter.disableForegroundDispatch(activity);
    }

}
