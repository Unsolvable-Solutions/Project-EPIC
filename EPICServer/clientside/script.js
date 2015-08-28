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

function logIn()
{
	resetAllMenuitems();
	
	var el = document.getElementById("logIn");
	el.style.backgroundColor = "indianred";
	el.style.color = "white";
	document.getElementById("contentpage").innerHTML='<object type="text/html" data="http://projectepic.info/login/" height="600px" width="700px" style="margin-left:150px"></object>';


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
	document.getElementById("contentpage").innerHTML='<object type="text/html" data="http://projectepic.info/meetings/" height="600px" width="700px" style="margin-left:150px"></object>';
	
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
//	viewmyprofile();
	document.getElementById("contentpage").innerHTML='<object type="text/html" data="viewMyProfile.html" height="600px" width="700px" style="margin-left:150px"></object>';
}

function register()
{
	resetAllMenuitems();
	document.getElementById("contentpage").innerHTML='';
	var el = document.getElementById("register");
	el.style.backgroundColor = "indianred";
	el.style.color = "white";
	document.getElementById("contentpage").innerHTML='<object type="text/html" data="http://projectepic.info/register"  height="600px" width="700px" style="margin-left:150px"></object>';
	
}
function viewMyMeetings()
{
	resetAllMenuitems();
	document.getElementById("contentpage").innerHTML='';
	var el = document.getElementById("viewMyMeetings");
	el.style.backgroundColor = "indianred";
	el.style.color = "white";
	document.getElementById("contentpage").innerHTML='<object type="text/html" data="http://projectepic.info/meetings/" height="600px" width="700px" style="margin-left:150px"></object>';
	
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
	if(loggedin)
	{
		if(alert("Are you sure you want this?"))
			loggedin="false";
	}	
	else
	{
		alert("You are not logged in so, why would you try??");
	}
	
}
