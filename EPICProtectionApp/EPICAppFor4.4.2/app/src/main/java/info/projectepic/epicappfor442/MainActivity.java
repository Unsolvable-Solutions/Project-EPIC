package info.projectepic.epicappfor442;

import android.app.PendingIntent;
import android.app.ProgressDialog;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.net.wifi.WifiManager;
import android.nfc.NdefMessage;
import android.nfc.NdefRecord;
import android.nfc.NfcAdapter;
import android.os.Build;
import android.os.CountDownTimer;
import android.os.Parcelable;
import android.provider.Settings;
import android.support.v7.app.ActionBarActivity;
import android.os.Bundle;
import android.telephony.TelephonyManager;
import android.view.KeyEvent;
import android.view.Menu;
import android.view.MenuItem;
import android.view.View;
import android.view.inputmethod.InputMethodManager;
import android.widget.Button;
import android.widget.EditText;
import android.widget.TextView;
import android.widget.Toast;

import java.io.BufferedReader;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileOutputStream;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;


public class MainActivity extends ActionBarActivity {

    /**
     * @param pendingIntent - Stores the application that will proccess a function for this app.
     * @param intentFiltersArray - A list of pre conditions and triggers that need to be met
     *                           before the intent is going to be launched.
     * @param mAdapter - Stores a connection to access the NFC adapter's function.
     * @param FileName - Stores the name of the file that has the state of the app.
     * @param EmpIDFile - Stores the name of the file that has the employee ID registered.
     * @param restoreSettings - Stores the connections that were turned off via the app.
     * */
    private PendingIntent pendingIntent;
    private IntentFilter[] intentFiltersArray;
    private NfcAdapter mAdapter;
    private String FileName="APPDATA";
    private String UnitFileName="UnitTests";
    private String EmpIDFile = "EMPID";
    private List<String> restoreSettings = new ArrayList<String>();
    protected boolean isInSafeMode = false;
    private int compramized = 0;

    /**
     * The functionality provided by the onCreate function is to act as the constructor of the
     * application and initilize the variables. It will also create the listeners that will be
     * called and attatch them to the appropiate views. It will create and attatch the Intent filter
     * to the NFC adapter so that the NFC adapter can send data to the application when the data
     * has met the conditions specified by the intent. Events such as the enter button on the
     * virtual keyboard are also created and attach to the view that uses it.
     *
     * @param savedInstanceState - The previous state of the application.
     * @param ListenerEnter - An event is stored that will be attatched to the Enter button.
     * @param ListenerLeave - Stores an event that will be attatched to the Leave button.
     * @param saveClicked - Stores an event that will be attatched to the save button.
     * @param butEnter - Stores the Enter button from the view.
     * @param butLeav - Stores the leave button from the view.
     * @param btnSave - Stores the save button from the view.
     * @param ndef - Stores an intent to be used in the intent filter.
     * @param EmpIDSelected - Stores the event that happens when a edit text view is clicked.
     * @param empIDText - Stores the edit text view for the employee ID to attatch events to.
     * @param uname - Stores the edit text view for the employee ID.
     * @param upass - Stores the edit text view for the employee password.
     * @param tvEmpID - Stores the  text view to display employee's id.
     * @param file - Used to check if files exists by trying to load them.
     * @param fs - Opens a stream for data to be stored to a private file.
     * @param stext - Used to build a string to store to the file.
     * @param theData - Stores a string representation of the data read from a file.
     * @param strSplt - Stores an array of the data in theData.
     * @param  imm - Stores the input method manager class to access input services like th
     *             virtual keyboard.
     */
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
        View.OnClickListener EmpIDSelected=
                new View.OnClickListener(){
                    @Override
                    public void onClick(View view) {
                        //Implement event handling
                        ((EditText)view).setText("");
                    }
                };
        final TextView tvEmpID = (TextView)findViewById(R.id.tvEmpId);
        View.OnClickListener saveClicked=
                new View.OnClickListener(){
                    @Override
                    public void onClick(View view) {
                        //Implement event handling
                        //Save data to file
                        TextView uname = (TextView)findViewById(R.id.tvEmpId);
                        TextView upass = (TextView)findViewById(R.id.etPwd);
                        String stext =uname.getText().toString()+":"+upass.getText().toString();
                        StoreEmpID(stext);
                        tvEmpID.setText("Current ID: "+uname.getText());
                    }
                };

        Button btnSave = (Button)findViewById(R.id.btnSave);
        btnSave.setOnClickListener(saveClicked);

        //Load previous ID if it was stored
        //File file = new File(EmpIDFile);
        //if(file.exists())
        //{
        //Load the data because the file exists
        try
        {
            FileInputStream fs = openFileInput(EmpIDFile);
            String getData = convertStreamToString(fs);
            String[] strSplt = getData.split(":");
            fs.close();
            tvEmpID.setText("Current ID: "+strSplt[0]);
        }
        catch (Exception e)
        {tvEmpID.setText("No ID Stored");}
        //}
        // else
        //{tvEmpID.setText("file load fail");}
        //=================================================================
        final EditText empIDText = (EditText)findViewById(R.id.etEmpid);

        //Event for enter press on keyboard in empIDText view
        /*empIDText.setOnKeyListener(new View.OnKeyListener() {
            @Override
            public boolean onKey(View v, int keyCode, KeyEvent event) {
                if ((event.getAction() == KeyEvent.ACTION_DOWN) && (keyCode == KeyEvent.KEYCODE_ENTER)) {
                    InputMethodManager imm = (InputMethodManager) getSystemService(INPUT_METHOD_SERVICE);
                    imm.hideSoftInputFromWindow(empIDText.getWindowToken(), 0);
                    //Store new ID
                    StoreEmpID(empIDText.getText().toString());
                    //Change Text
                    tvEmpID.setText("Current ID: " + empIDText.getText().toString());
                    return true;
                }
                return false;
            }
        });*/

        Button butEnter = (Button)findViewById(R.id.button);
        butEnter.setOnClickListener(ListenerEnter);
        Button butLeav = (Button)findViewById(R.id.button2);
        butEnter.setVisibility(View.GONE);
        butLeav.setOnClickListener(ListenerLeave);
        butLeav.setVisibility(View.GONE);
        TextView tv = (TextView)findViewById(R.id.textView);
        tv.setText(getDeviceId());
        //tv.setVisibility(View.GONE);
        empIDText.setOnClickListener(EmpIDSelected);

        mAdapter = NfcAdapter.getDefaultAdapter(this);
        //Check if NFC is enabled and if not open connection manager of the device
        if (!mAdapter.isEnabled())
        {
            Toast.makeText(getApplicationContext(), "Please activate NFC and press Back to return to the application!", Toast.LENGTH_LONG).show();
            startActivity(new Intent(android.provider.Settings.ACTION_WIRELESS_SETTINGS));
        }
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

    /**
     * The functionality provided by the onPause function to stop current actions when the
     * application is paused (if another application is opened). This function will disable
     * the foregroundDispatch to this application.
     */
    @Override
    public void onPause() {

        mAdapter.disableForegroundDispatch(this);
        super.onPause();
    }

    /**
     * The functionality provided by the onResume function to continue the applications tasks
     * when the user resumes using this application (This method is also called when the
     * application is first opened). This function will enable the foregroundDispatch to this
     * application.
     */
    @Override
    public void onResume() {
        super.onResume();
        mAdapter.enableForegroundDispatch(this, pendingIntent, intentFiltersArray, null);
    }

    /**
     * The functionality provided by the onCreateOptionsMenu function is to add items to the action
     * bar if it is present. (This function is self generated)
     */
    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        // Inflate the menu; this adds items to the action bar if it is present.
        getMenuInflater().inflate(R.menu.menu_main, menu);
        return true;
    }

    /**
     * The functionality provided by the onNewIntent is to check whether the NFC adapter intent
     * was triggered and to parse the message if and NdefMessage was sent.
     *
     * @param intent - The intent that was triggered.
     * @param action - The action of the intent (To see if an NDEF message was discovered).
     * @param parcelables - Stores all the messages recieved from the NFC adapter including MIME
     *                    type.
     * @param inNdefMessage - Stores the data message found in parcelables[0].
     * @param inNdefRecords - Stores the messages from inNdefMessage as NDEF Records for easier
     *                      decoding.
     * @param NdefRecord_0 - The first record found in inNdefRecords is stored here.
     * @param inMsg - The messsage retrieved from NdefRecord_0 is stored in here.
     * @param tv - Stores a pointer to access the textview to display the data in.
     * @param tim - Stores a timer to use with the color changing.
     */
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

                //Handle the message that came in:
                if((inMsg.equals("0"))||inMsg.equals("en0"))
                {
                    //False - Denied access
                    //Flash screen red or someting similiar
                    Toast.makeText(getApplicationContext(), "Access Denied", Toast.LENGTH_LONG).show();
                    CountDownTimer tim = new CountDownTimer(3000,1000) {
                        public void onTick(long millisUntilFinished) {
                            setActivityBackgroundColor(Color.rgb(205,92,92));
                        }

                        public void onFinish() {
                            setActivityBackgroundColor(Color.WHITE);
                        }
                    };
                    tim.start();
                }
                else if((inMsg.equals("1"))||(inMsg.equals("en1")))
                {
                    //True - Allowed Access
                    //Check what was the previous state
                    Toast.makeText(getApplicationContext(), "Access Approved", Toast.LENGTH_LONG).show();
                    String getData = "";
                    try
                    {

                            FileInputStream fs = openFileInput(FileName);
                            getData = convertStreamToString(fs);
                            fs.close();


                        if (getData.length()>1)
                        {LoadSnapShot();}
                        else
                        {StoreSnapshot();}
                        //Flash screen green or something similiar
                        CountDownTimer tim = new CountDownTimer(3000,1000) {
                            public void onTick(long millisUntilFinished) {
                                setActivityBackgroundColor(Color.GREEN);
                            }

                            public void onFinish() {
                                setActivityBackgroundColor(Color.WHITE);
                            }
                        };
                        tim.start();

                    }
                    catch (Exception e)
                    {
                        //Toast.makeText(getApplicationContext(), e.toString(), Toast.LENGTH_LONG).show();
                        StoreSnapshot();
                        //Flash screen green or something similiar
                        CountDownTimer tim = new CountDownTimer(3000,1000) {
                            public void onTick(long millisUntilFinished) {
                                setActivityBackgroundColor(Color.GREEN);
                            }

                            public void onFinish() {
                                setActivityBackgroundColor(Color.WHITE);
                            }
                        };
                        tim.start();
                        //Toast.makeText(getApplicationContext(), e.toString(), Toast.LENGTH_LONG).show();
                    }

                }
                else if((inMsg.equals("2"))||(inMsg.equals("en2")))
                {
                    //Error - Something went wrong
                    CountDownTimer tim = new CountDownTimer(3000,1000) {
                        public void onTick(long millisUntilFinished) {
                            setActivityBackgroundColor(Color.rgb(255,65,0));
                        }

                        public void onFinish() {
                            setActivityBackgroundColor(Color.WHITE);
                        }
                    };
                    tim.start();
                }
                //Toast.makeText(getApplicationContext(), "Toasty: " + inMsg + action.toString(), Toast.LENGTH_LONG).show();
                //Proccess the text here
                TextView tv = (TextView)findViewById(R.id.textView);
                tv.setText(inMsg);
            }
        }
        catch(Exception e)
        {
            //Log.e("NFC", e.getMessage());
        }
    }

    /**
     * The functionality provided by the onOptionsItemSelected function is to handle action bar
     * item clicks. (This function is self generated)
     */
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
        /*if (isMobileDataEnabledFromLollipop(getApplicationContext()))
        {
            try {
                setMobileNetworkfromLollipop(getApplicationContext(),0);
                restoreSettings.add("mobi");
            }
            catch (Exception e)
            {}
        }*/

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
        isInSafeMode = true;
        /*Start thread to see if data is compramized*/
        Thread thread = new Thread() {
            @Override
            public void run() {
                try {
                    BluetoothAdapter bt = BluetoothAdapter.getDefaultAdapter();
                    WifiManager wifi = (WifiManager)getSystemService(Context.WIFI_SERVICE);
                    while(isInSafeMode) {

                        /*Check whether anything is turned on*/
                        if ((wifi.isWifiEnabled())||(bt.isEnabled()))
                        {compramized++;}
                        sleep(2000);
                    }
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        };

        thread.start();
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

    /**
     * The functionality provided by the LoadSnapShot is to get the previous state the phone's
     * connections were in before they were turned off by the storeSnapShot function and turn
     * them on if they were turned on. If the app was still in memory it simply reads from a list
     * otherwize it will read from a local file and reset that file.
     *
     * @param fs - Stores an input stream to the state file.
     * @param getData - Stores the String value of the input stream.
     * @param split - Stores the getData string as an array. Values are seperated by ":".
     * @param fos - Stores an output stream to the file to reset it.
     * @param bt - Stores the bluetooth object interface to interact with the adapter.
     * @param wifi - Stores the wifi service interface to interact with the wifi.
     * @param tv - Stores a text view object to display data in.
     */
    private void LoadSnapShot()
    {
        isInSafeMode = false;
        try
        {
            Thread.sleep(2000);
        }
        catch (Exception e)
        {}
        if (compramized>0)
        {//Warn that phone has been comramized
         }
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
                    //setMobileNetworkfromLollipop(getApplicationContext(), 1);
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
        //Reset list
        restoreSettings = new ArrayList<String>();
    }

    /**
     * The functionality provided by the isMobileDataEnabledFromLollipop is check what the
     * current state of the mobile data is and return it as a boolean value.
     *
     * @param state - Stores an input stream to the state file.
     * @param context - The context of the current state of the application. Used to get info
     *                on another part of this application.
     *
     * @return A boolean value according the the mobile data state is returned.
     */
    private static boolean isMobileDataEnabledFromLollipop(Context context) {
        boolean state = false;
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            state = Settings.Global.getInt(context.getContentResolver(), "mobile_data", 0) == 1;
        }
        return state;
    }

    /**
     * The functionality provided by the StoreEmpID is to store/change a given Employee ID on
     * the device that will be used with the NFC messages to see if the person is allowed into
     * a room
     *
     * @param EmployeeID - String representation of an ID inputed by the user.
     * @param context - The context of the current state of the application. Used to get info
     */
    private void StoreEmpID(String EmployeeID)
    {
        try
        {
            FileOutputStream fs = openFileOutput(EmpIDFile, Context.MODE_PRIVATE);
            fs.write(EmployeeID.getBytes());
            fs.close();

        }
        catch (Exception e)
        {TextView tvEmpID = (TextView)findViewById(R.id.textView);tvEmpID.setText("Store fail");}
    }

    /**The functionality provided by the StoreEmpID is to simply changes the background color
     * specified by an int value. This is to alert the user whether he was successful or not.
     *
     * @param color - The int value of the color to be set
     * @param view - Stores the whole activity view seen by the user.
     * */
    public void setActivityBackgroundColor(int color) {
        View view = this.getWindow().getDecorView();
        view.setBackgroundColor(color);
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

    public void unitTests(View v)
    {
        /*ProgressDialog dialog = new ProgressDialog(MainActivity.this);
        dialog.setProgressStyle(ProgressDialog.STYLE_SPINNER);
        dialog.setMessage("Loading. Please wait...");
        dialog.setIndeterminate(true);
        dialog.setCanceledOnTouchOutside(false);
        dialog.show();*/
        String testOne="";
        String testTwo="";
        String testThree="";
        String testFour="";
        String theData = "";

        BluetoothAdapter bt = BluetoothAdapter.getDefaultAdapter();
        WifiManager wifi = (WifiManager)getSystemService(Context.WIFI_SERVICE);
        /*Store and load snapshot needed to be tested together as they work together.*/

        //Store and load snapshot snapshot
        //Test bt and wifi on
        bt.enable();
        wifi.setWifiEnabled(true);
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        StoreSnapshot();
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        if ((!bt.isEnabled())&&(!wifi.isWifiEnabled()))
        {testOne="Wifi and bluetooth on. Called 'StoreSnapshot'. Test Passed.";}
        else
        {testOne="Wifi and bluetooth on. Called 'StoreSnapshot'. Test Failed.";}
        LoadSnapShot();
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        if ((bt.isEnabled())&&(wifi.isWifiEnabled()))

        {testOne+="\r\nWifi and bluetooth were on before 'StoreSnapshot' was called. Called 'LoadSnapshot'. Test Passed.";}
        else
        {testOne+="\r\nWifi and bluetooth on before 'StoreSnapshot' was called. Called 'LoadSnapshot'. Test Failed.";}

        //Test bt on wifi off
        bt.enable();
        wifi.setWifiEnabled(false);
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        StoreSnapshot();

        if ((!bt.isEnabled())&&(!wifi.isWifiEnabled()))
        {testTwo="Wifi off and bluetooth on. Called 'StoreSnapshot'. Test Passed.";}
        else
        {testTwo="Wifi off and bluetooth on. Called 'StoreSnapshot'. Test Failed.";}
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        LoadSnapShot();
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        if ((bt.isEnabled())&&(!wifi.isWifiEnabled()))
        {testTwo+="\r\nWifi off and bluetooth were on before 'StoreSnapshot' was called. Called 'LoadSnapshot'. Test Passed.";}
        else
        {testTwo+="\r\nWifi off and bluetooth on before 'StoreSnapshot' was called. Called 'LoadSnapshot'. Test Failed.";}

        //Test wifi on bt off
        bt.disable();
        wifi.setWifiEnabled(true);
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        StoreSnapshot();

        if ((!bt.isEnabled())&&(!wifi.isWifiEnabled()))
        {testThree="Wifi on and bluetooth off. Called 'StoreSnapshot'. Test Passed.";}
        else
        {testThree="Wifi on and bluetooth off. Called 'StoreSnapshot'. Test Failed.";}
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        LoadSnapShot();
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        if ((!bt.isEnabled())&&(wifi.isWifiEnabled()))
        {testThree+="\r\nWifi on and bluetooth were off before 'StoreSnapshot' was called. Called 'LoadSnapshot'. Test Passed.";}
        else
        {testThree+="\r\nWifi on and bluetooth off before 'StoreSnapshot' was called. Called 'LoadSnapshot'. Test Failed.";}

        //Test both off
        bt.disable();
        wifi.setWifiEnabled(false);
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        StoreSnapshot();

        if ((!bt.isEnabled())&&(!wifi.isWifiEnabled()))
        {testThree="Wifi off and bluetooth off. Called 'StoreSnapshot'. Test Passed.";}
        else
        {testThree="Wifi off and bluetooth off. Called 'StoreSnapshot'. Test Failed.";}
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        LoadSnapShot();
        try
        {Thread.sleep(5000);}
        catch (Exception e)
        {}
        if ((!bt.isEnabled())&&(!wifi.isWifiEnabled()))
        {testThree+="\r\nWifi off and bluetooth were off before 'StoreSnapshot' was called. Called 'LoadSnapshot'. Test Passed.";}
        else
        {testThree+="\r\nWifi off and bluetooth off before 'StoreSnapshot' was called. Called 'LoadSnapshot'. Test Failed.";}



        /*Write test results to file*/
        theData += testOne+"\r\n\r\n"+testTwo+"\r\n\r\n"+testThree+"\r\n\r\n"+testFour;
        try
        {
            FileOutputStream fs = openFileOutput(UnitFileName, Context.MODE_PRIVATE);
            fs.write(theData.getBytes());
            fs.close();
        }
        catch (Exception e)
        {}
       // dialog.dismiss();
        Toast.makeText(getApplicationContext(), "Unit Tests Done.", Toast.LENGTH_LONG).show();
        Intent i = new Intent(getApplicationContext(), UnitTest.class);
        startActivity(i);
    }
}
