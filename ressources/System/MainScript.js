function func() {
    return ( ( ( 1+Math.random() ) * 0x10000 ) | 0 ).toString( 16 ).substring( 1 );
}
function Uuid(){
    // For calling it, stitch '3' in the 3rd group
    UUID = (func() + func() + "-" + func() + "-3" + func().substr(0,2) + "-" + func() + "-" + func() + func() + func()).toLowerCase();
    return UUID;
}
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
function open_app(path){
    App_uuid = Uuid()
    apps_title[App_uuid] = path
    apps[App_uuid] = new WinBox({
        class: ["win"],
        border: "0.15em",
        url: path+"?app_id="+App_uuid,
        title: path,
        background: localStorage.getItem('window_color'),
        x: "center",
        y: "center",
        top: "35px",
        root: document.body,
        Uuid: App_uuid,
        id: "App_"+App_uuid,
    });
}
function AppToBackground(Uuid){
    apps[Uuid].hide();
}
function AppDisableBackground(Uuid){
    apps[Uuid].show();
}
async function load()
{
    if(localStorage.getItem('localStorageVerification') == undefined){
        document.location.href="system_page/important_error.html?error=localStorageCorrupted";
    }else if(localStorage.getItem('Configured') != "true"){
        document.location.href="system_page/Obbe.html";
    }
    if(localStorage.getItem('Password') != ""){
        ShowUserControl("OFF" , "Login");
    }
    document.body.style.backgroundImage = "url('"+localStorage.getItem('BackgroundSelected')+"')";
    apps_title = {};
    apps = {};
    var $_GET = [];
    var parts = window.location.search.substr(1).split("&");
    for (var i = 0; i < parts.length; i++){
        var temp = parts[i].split("=");
        $_GET[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
    }
    if(typeof $_GET["Command"]!=undefined){
        return eval($_GET["Command"])
    }
    document.getElementById("notes").value = localStorage.getItem('notes');
    var selected = "none";
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
             document.location.href="index mobile.html";
         }
    }
    AppsList = JSON.parse(localStorage.getItem("LocalAppsList"));
    for(Apps in AppsList){
        Button = document.createElement("button");
        Button.className = "bar_button";
        Button.innerHTML = JSON.stringify(Apps).replace('"','').replace('"','');
        Button.onclick = function(){
            open_app(JSON.stringify(AppsList[Apps]).replace('"','').replace('"',''));
        }
        Button.style.width = "100%";
        document.getElementById("bar_menu_apps").appendChild(Button);
    }
}
function open_vm(){
    new WinBox('Virtual Machine', {
        class: ["win"],
        border: "0.15em",
        url:'index.html',
        background: localStorage.getItem('window_color'),
        x: "center",
        y: "center",
        top: "35px",
        root: document.body
    });
}
function apps_installer(){
    new WinBox('Apps Installer', {
        border: "0px",
        url:'apps/Installer.html',
        x: "center",
        y: "center",
        root: document.body,
    });
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
function allsecondsfunction(){
    document.getElementById('time_base_button').innerHTML=new Date().toLocaleTimeString();
}
setInterval(allsecondsfunction, 1000);
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
        var context_menu_width = barmenu_O.offsetWidth;
        var context_menu_height = barmenu_O.offsetHeight;
        if(x + context_menu_width > window_width) {
            context_menu.style.left = (x - context_menu_width) + 'px';
        }
        if(y + context_menu_height > window_height) {
            context_menu.style.top = (y - context_menu_height) + 'px';
        }
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
        var context_menu_width = barmenu_O.offsetWidth;
        var context_menu_height = barmenu_O.offsetHeight;
        if(x + context_menu_width > window_width) {
            context_menu.style.left = (x - context_menu_width) + 'px';
        }
        if(y + context_menu_height > window_height) {
            context_menu.style.top = (y - context_menu_height) + 'px';
        }
    }
    else{
        var context_menu = document.getElementById('context_menu');
        context_menu.style.left = x + 'px';
        context_menu.style.top = y + 'px';
        context_menu.style.display = 'block';
        context_menu.style.visibility = 'visible';
        var window_width = window.innerWidth;
        var window_height = window.innerHeight;
        var context_menu_width = barmenu_O.offsetWidth;
        var context_menu_height = barmenu_O.offsetHeight;
        if(x + context_menu_width > window_width) {
            context_menu.style.left = (x - context_menu_width) + 'px';
        }
        if(y + context_menu_height > window_height) {
            context_menu.style.top = (y - context_menu_height) + 'px';
        }
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
var UserControlState = "OFF";