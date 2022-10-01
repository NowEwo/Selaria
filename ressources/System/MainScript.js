console.time("Boot");
console.group("Loading");
console.log("Defining the Func and Uuid functions !");
function func() {
    return ( ( ( 1+Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 );
}
function Uuid(){
    // For calling it, stitch '3' in the 3rd group
    UUID = (func() + func() + "-" + func() + "-3" + func().substr(0,2) + "-" + func() + "-" + func() + func() + func()).toLowerCase();
    return UUID;
}
console.group("Starting the shell");
console.log("Defining the taskbar menus system");
function open_menu(id)
{
    if(document.getElementById(id).style.visibility=="hidden")
        {
            document.getElementById(id).style.visibility="visible";
        }
    else
        {
            document.getElementById(id).style.visibility="hidden";
        }
    return true;
}
console.log("Defining the softwares system");
function open_app(path){
    App_uuid = Uuid()
    apps_title[App_uuid] = path
    apps[App_uuid] = new WinBox({
        class: ["win"],
        border: "0.15em",
        url: path,
        title: path,
        background: localStorage.getItem('window_color'),
        x: "center",
        y: "center",
        top: "35px",
        root: document.body,
        Uuid: App_uuid,
        id: App_uuid,
    });
    apps[App_uuid].i
    for(Item in document.getElementsByTagName("iframe")){
        Item.contentWindow.postMessage("{'UUID' : '"+App_uuid+"' }")
    }
    apps[App_uuid].title = document.getElementById(App_uuid).contentWindow.document.title
    if(document.getElementById("bar_menu_apps").style.visibility == "visible"){
        open_menu("bar_menu_apps");
    }
    if(document.getElementById("bar_menu_O").style.visibility == "visible"){
        open_menu("bar_menu_O");
    }
}
console.groupEnd("Loading");
console.group("Booting");
async function load()
{
    console.log("Executing the LocalStorage verification");
    if(localStorage.getItem('localStorageVerification') == undefined){
        console.error("Error on the Localstorage");
        document.location.href="system_page/important_error.html?error=localStorageCorrupted";
    }else if(localStorage.getItem('Configured') != "true"){
        console.error("Selaria is not configured well redirecting to OBBE");
        document.location.href="system_page/Obbe.html";
    }
    console.log("Executing the password verification");
    if(localStorage.getItem("Password") != ""){
        console.warn("No password detected");
        ShowUserControl("OFF" , "Login");
    }
    console.log("Defining shell varibles");
    apps_title = {};
    apps = {};
    console.log("Get the boot arguments");
    var $_GET = [];
    var parts = window.location.search.substr(1).split("&");
    for (var i = 0; i < parts.length; i++){
        var temp = parts[i].split("=");
        $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }
    console.log("Defining the notes content");
    document.getElementById("notes").value = localStorage.getItem('notes');
    var selected = "none";
    console.log("Detecting the device used");
    if( navigator.userAgent.match(/iPhone/i)
     || navigator.userAgent.match(/webOS/i)
     || navigator.userAgent.match(/Android/i)
     || navigator.userAgent.match(/iPad/i)
     || navigator.userAgent.match(/iPod/i)
     || navigator.userAgent.match(/BlackBerry/i)
     || navigator.userAgent.match(/Windows Phone/i)
     ){
         if($_GET["fromphone"]=="true"){
            return true;
         }
         else{
            console.warn("Device is mobile");
            console.warn("Rediceting to thge mobile Index");
            document.location.href="index mobile.html";
         }
    };
}
console.log("Defining shell functions");
function apps_installer(){
    new WinBox('Apps Installer', {
        border: "0px",
        url:'apps/Installer.html',
        x: "center",
        y: "center",
        root: document.body,
    });
}
function ReloadGlobalMenu(){
    document.getElementById("GlobalMenu").innerHTML=`
    <button class="bar_button" onclick="open_app('apps/about.html')">About</button>
    <button class="bar_button" onclick="open_app('apps/terminal.html')">Terminal</button>
    <button class="bar_button" onclick="document.getElementById('Screensaver').style.display = 'block'">Screensaver</button>
    `;
}
function error(error){
    document.location.href="system_page/important_error.html?error="+error;
}
function notification(title, message, command){
    notification_to_execute = command;
    document.getElementById("Notification").style.textAlign = "center";
    document.getElementById("Notification_title").style.fontWeight = "bold";
    document.getElementById("Notification_title").innerHTML = title;
    document.getElementById("Notification").style.visibility = "visible";
    document.getElementById("Notification_message").style.fontWeight = "normal";
    document.getElementById("Notification_message").innerHTML = message;
    setTimeout(function(){
        document.getElementById("Notification").style.visibility = "hidden";
        document.getElementById("Notification").style.textAlign = "left";
    }, 5000);
}
console.log("Running the clock");
function allsecondsfunction(){
    document.getElementById('time_base_button').innerHTML=new Date().toLocaleTimeString();
}
setInterval(allsecondsfunction, 1000);
console.log("Loading the context menu");
document.addEventListener('contextmenu', function (e){
    var context_menu = document.getElementById('context_menu_desktop');
    context_menu.style.display = 'none';
    context_menu.style.visibility = 'hidden';
    var context_menu = document.getElementById('context_menu');
    context_menu.style.display = 'none';
    context_menu.style.visibility = 'hidden';
    var context_menu = document.getElementById('context_menu_O');
    context_menu.style.display = 'none';
    context_menu.style.visibility = 'hidden';
    e.preventDefault();
    var x = e.clientX;
    var y = e.clientY;
    if(e.target.id == "bar_base_button_O"){
        var context_menu = document.getElementById('context_menu_O');
        context_menu.style.left = x + 'px';
        context_menu.style.top = y + 'px';
        context_menu.style.display = 'block';
        context_menu.style.visibility = 'visible';
        var window_width = window.innerWidth;
        var window_height = window.innerHeight;
    }
    if(e.target.className == "desktop_button"){
        var context_menu = document.getElementById('context_menu_desktop');
        to_execute = e.target.getAttribute('onclick');
        selected_element = e.target;
        context_menu.style.left = x + 'px';
        context_menu.style.top = y + 'px';
        context_menu.style.display = 'block';
        context_menu.style.visibility = 'visible';
        var window_width = window.innerWidth;
        var window_height = window.innerHeight;
    }
    else{
        var context_menu = document.getElementById('context_menu');
        context_menu.style.left = x + 'px';
        context_menu.style.top = y + 'px';
        context_menu.style.display = 'block';
        context_menu.style.visibility = 'visible';
        var window_width = window.innerWidth;
        var window_height = window.innerHeight;
    } 
});
document.addEventListener('click', function (e){
    var context_menu = document.getElementById('context_menu_desktop');
    context_menu.style.display = 'none';
    context_menu.style.visibility = 'hidden';
    var context_menu = document.getElementById('context_menu');
    context_menu.style.display = 'none';
    context_menu.style.visibility = 'hidden';
    var context_menu = document.getElementById('context_menu_O');
    context_menu.style.display = 'none';
    context_menu.style.visibility = 'hidden';
});
console.log("Defining shell functions");
function SetBackground(ID , STATE){
    if(STATE == "ON"){
        document.getElementById("App_"+ID).style.display = "none";
    }
    else{
        document.getElementById("App_"+ID).style.display = "block";
    }
}
function InstallApp(app_name , app_url){
    LocalAppsList = localStorage.getItem("LocalAppsList");
    if(LocalAppsList == null){
        LocalAppsList = {};
    }else{
        LocalAppsList = JSON.parse(LocalAppsList);
    }
    LocalAppsList[app_name] = app_url;
    localStorage.setItem("LocalAppsList", JSON.stringify(LocalAppsList));
}
function ShowUserControl(CANCELABLE , APPNAME="Unknown" , COMMAND=""){
    CommandToExecuteUserControl = COMMAND;
    UserControlState = "WAITING";
    document.getElementById("UserControlText").innerHTML = "The application "+APPNAME+" asks for your password to access this content .";
    document.getElementById("UserControl").style.display = "block";
    if(CANCELABLE == "ON"){
        document.getElementById("UserControlCancel").style.display = "block";
    }
    else{
        document.getElementById("UserControlCancel").style.display = "none";
    }
}
function UserControlValidation(){
    if(document.getElementById("UserControlPassword").value != localStorage.getItem("Password")){
        document.getElementById("UserControlInvalidPassword").style.display = "block";
        document.getElementById("UserControlPassword").value = "";
    }
    else{
        document.getElementById("UserControlInvalidPassword").style.display = "none";
        document.getElementById("UserControl").style.display = "none";
        document.getElementById("UserControlPassword").value = "";
        UserControlState = "VALIDATED";
        eval(CommandToExecuteUserControl);
    }
}
function ShowImmersiveDialog(TITLE , TEXT , CANCELABLE=true , COMMAND=""){
    document.getElementById("DialogText").innerHTML=TEXT;
    document.getElementById("DialogTitle").innerHTML=TITLE;
    document.getElementById("ImmersiveDialog").style.display="block";
    CommandToExecuteImmersiveDialog=COMMAND;
    if(CANCELABLE == true){
        document.getElementById("DialogCancel").style.display="block";
    }
    else{
        document.getElementById("DialogCancel").style.display="none";
    }
}
function TerminalModeO(){
    ShowImmersiveDialog("Terminal mode !" , "Click Continue to go on terminal mode ." , CANCELABLE=true , COMMAND="document.location.href='apps/terminal.html'");
};
console.log("Loading the drag-and-drop");
document.addEventListener("dragover", (event) => {
    event.preventDefault();
  });
document.addEventListener("drop", (Event) => {
    Event.preventDefault();
    open_app(Event.dataTransfer.getData("text/plain"));
});
console.log("Defining the Background and the username and the UAC state");
var Background = localStorage.getItem("Background");
var UserControlState = "OFF";
load();
console.groupEnd("Booting");
console.timeEnd("Boot");