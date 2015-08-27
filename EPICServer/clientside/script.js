var loggedin = false;
var curruser = new Object;
curruser.name = "Johan";
curruser.surname="du Preez";
//curruser.username="11071762";
curruser.email="jdpisawesome@gmail.com";
curruser.id = "1";
function logOut()
{
	resetAllMenuitems();
	document.getElementById("contentpage").innerHTML='';
	var el = document.getElementById("logOut");
	el.style.backgroundColor = "indianred";
	el.style.color = "white";
}

function logIn(email,passw)
{
	
}
function setCurrUser(id,na, sn,  em)
{
	curruser.id=id;
	curruser.name = na;
	curruser.surname=sn;
	//curruser.username=un;
	curruser.email=em;
}


function enablemenu(){
	document.getElementById("menu").disable=false;
}
function createMeeting()
{
	resetAllMenuitems();
	var el = document.getElementById("createMeeting");
	el.style.backgroundColor = "indianred";
	el.style.color = "white";
	document.getElementById("contentpage").innerHTML='<object type="text/html" data="http://projectepic.info/meetings/" height="400px" width="100%"></object>';
	
	//document.getElementById("contentpage").style.height="95%";
}
function viewmyprofile()
{
	var el = document.getElementById("myprofile");
	el.style.marginLeft="120px";
	el.style.marginTop="50px";
	el.style.fontFamily="Tahoma";
	el.style.textAlign="left";
	var k = '';
	k= k+'<table >';
	//k=k+'<tr><th>Username: </th><th>'+ curruser.username+'</th></tr>';
	k=k+'<tr><th>Name: </th><th>'+ curruser.name+'</th></tr>';
	k=k+'<tr><th>Surname: </th><th>'+ curruser.surname+'</th></tr>';
	k=k+'<tr><th>Email: </th><th>'+ curruser.email+'</th></tr>';
	
	
	k=k+'</table>';
	el.innerHTML=k;
}
function viewProfile()
{
	resetAllMenuitems();
	document.getElementById("contentpage").innerHTML='';
	var el = document.getElementById("viewProfile");
	el.style.backgroundColor = "indianred";
	el.style.color = "white";
	document.getElementById("contentpage").innerHTML='<object type="text/html" data="viewMyProfile.html" height="400px" width="100%"></object>';
}

function register()
{
	resetAllMenuitems();
	document.getElementById("contentpage").innerHTML='';
	var el = document.getElementById("register");
	el.style.backgroundColor = "indianred";
	el.style.color = "white";
	document.getElementById("contentpage").innerHTML='<object type="text/html" data="http://projectepic.info/register"  height="500px" width="100%"></object>';
	
}
function viewMyMeetings()
{
	resetAllMenuitems();
	document.getElementById("contentpage").innerHTML='';
	var el = document.getElementById("viewMyMeetings");
	el.style.backgroundColor = "indianred";
	el.style.color = "white";
	document.getElementById("contentpage").innerHTML='<object type="text/html" data="http://projectepic.info/meetings/" height="400px" width="100%"></object>';
	
}


function resetAllMenuitems()
{
	var el = document.getElementsByName("menuitem");
	for(i=0;i<el.length;i++)
	{
		el[i].style.backgroundColor="#D0D0D0";
		el[i].style.color="black";
	}
}

function submitmeeting()
{
	/*var k = "";
	k=k+"http://projectepic.info/user/";
	k=k+"curruser.id"+"/add?title="+getElementById("meetingTitle");
	k=k+"description"
	
eg. /user/5/meetingsOwned/add?title=NewMeeting&description=OurMeetingTodayAtOffice&location=Office 
alert(document.getElementById("meetingLoc").value);
*/
}
function resetAllfootitems()
{
	var el = document.getElementsByName("footitem");
	for(i=0;i<el.length;i++)
	{
		el[i].style.backgroundColor="black";
	}
}
function admin()
{
	document.getElementById("contentpage").innerHTML='';
		resetAllMenuitems();
	var el = document.getElementById("admin");
	el.style.backgroundColor = "indianred";
	el.style.color = "white";
}

function deleteProfile()
{
	document.getElementById("contentpage").innerHTML='';
	resetAllMenuitems();
	var el = document.getElementById("deleteProfile");
	el.style.backgroundColor = "indianred";
	el.style.color = "white";
	alert("Are you sure you want this?");
	
}


function showWhoAreWe()
{
	resetAllfootitems();
	var el = document.getElementById("prefooter");
	el.innerHTML="We are Unsolvable Solutions";
	var k = document.getElementById("whoarewe");
	k.style.backgroundColor="indianred";
	}
function showWhy()
{
	resetAllfootitems();
	var el = document.getElementById("prefooter");
	el.innerHTML="Wel it started as an assignment";
	var k = document.getElementById("whywouldwedothis");
	k.style.backgroundColor="indianred";
	}

function showWhatDoWeDo()
{
	resetAllfootitems();
	var el = document.getElementById("prefooter");
	el.innerHTML="We solve software problems creatively.";
	var k = document.getElementById("whatdowedo");
	k.style.backgroundColor="indianred";
	}
function showWhatIsThis()
{ 
	resetAllfootitems();
	var el = document.getElementById("prefooter");
	el.innerHTML="For more information view thegithub page. This is a project that works on many platforms";
	var k = document.getElementById("whatisthis");
	k.style.backgroundColor="indianred";
}
function showContactUs()
{
	resetAllfootitems();
	var el = document.getElementById("prefooter");
	el.innerHTML="<b>Unsolvable Solutions</b><br>Owner: The University of Pretoria 012 346 0012<br><br> <b>Project Leader:</b> Edwin Fullard - 0827569228";
		var k = document.getElementById("contactus");
	k.style.backgroundColor="indianred";
}