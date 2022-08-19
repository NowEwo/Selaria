var SelariaFileSystem = parent.SelariaFileSystem
function CreateFile(Object){
    SelariaFileSystem.open(Object , "w");
}
function DeleteFolder(Object){
    SelariaFileSystem.rmdir(Object);
}
function CreateFolder(Object){
    SelariaFileSystem.mkdir(Object);
}
function WriteFile(File , Content){
    SelariaFileSystem.writeFile(File, Content, function (Errors) {
        if (Errors) throw Errors;
    });
}
function ReadFile(Object){
    SelariaFileSystem.readFile(Object, 'utf8', function (Errors, Content) {
        if (Errors) throw Errors;
        return Content;
    });
}
function ListFolder(Object){
    SelariaFileSystem.readdir(Object, function(Errors , Content){
        if (Errors) throw Errors;
        return Content;
    });
}
function Informations(Object){
    SelariaFileSystem.stat(Object, function(Errors , Informations){
        if (Errors) throw Errors;
        return Informations;
    })
}