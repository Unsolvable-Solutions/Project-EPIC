package info.projectepic.epicapp;

import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.net.wifi.WifiManager;
import android.nfc.NdefMessage;
import android.nfc.NfcAdapter;
import android.os.Parcelable;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;

import java.util.ArrayList;
import java.util.List;


public class MainActivity extends ActionBarActivity {

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


    /*Our coding*/
    @Override
    public void onResume() {
        super.onResume();
        Intent intent = getIntent();
        NdefMessage msg;
        if (NfcAdapter.ACTION_NDEF_DISCOVERED.equals(getIntent().getAction())) {
            Parcelable[] rawMsgs = intent.getParcelableArrayExtra(NfcAdapter.EXTRA_NDEF_MESSAGES);
            if (rawMsgs != null) {
                msg = (NdefMessage)rawMsgs[0];
                TextView tv = (TextView)findViewById(R.id.textView);
                tv.setText(new String(msg.getRecords()[0].getPayload()));
            }
        }
        //process the msgs array
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
}
