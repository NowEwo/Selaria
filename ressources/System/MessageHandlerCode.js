window.onmessage = async function(event){
    var Content = JSON.parse(event.data);
    var Sender = document.querySelectorAll("[myAttribute="+Content.UUID+"]")[0];
    if(Content.Action == "Dialog"){
        ShowImmersiveDialog(Content.Title, Content.Text, Content.Cancellable, Content.Command);
    }else if(Content.Action == "CreateFS"){
        var AppFileSystem = IDBFS.FileSystem(Content.Name);
    }else if(Content.Action == "Execute"){
        ShowImmersiveDialog("User control !", Content.Software+" Want to execute unknown code in your computer !", true, Content.Code);
    }else if(Content.Action == "WriteFile"){
        var TempFileSystem = IDBFS.FileSystem(Content.FileSystem);
        TempFileSystem.writeFile(Content.Path, Content.Data, function (Errors) {
            if (Errors) throw Errors;
        });
    }
}