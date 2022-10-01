
# Tutorials

## Table of contents

- [Make a server from scratch](https://github.com/Komrod/web-servo/blob/master/tutorials.md#make-a-server-from-scratch)
- [Create a HTTPS server](https://github.com/Komrod/web-servo/blob/master/tutorials.md#make-a-https-server)


## Make a server from scratch

Assuming you start from nothing, install Node (https://nodejs.org/en/download/) and open a console. Then create a directory for your project and install the web-servo module:
```
  mkdir myProject
  cd myProject
  npm install web-servo
```

Create the script "server.js" to launch the server in "myProject/":
```
  require('web-servo').start();
```
If you run the server now, it will show an error because the configuration is not set in the script and the server is supposed to use the file "config.json" that doesn't exist yet. It is also recommanded to create the WWW root directory and log directory so everything works fine.
```
  mkdir www
  mkdir log
```
Now create "config.json" in "myProject/":
```
{
  "server": {
    "port": "9000",
    "dir": "www/"
  },
  "log": {
    "access": {
      "enabled": true,
      "path": "log/access.log",
      "console": true
    },
    "error": {
      "enabled": true,
      "path": "log/error.log",
      "console": true,
      "debug": true
    }
  }
}
```
In this file, we defined the server to run on port 9000 and the WWW directory to "www/". I also add the log parameters to show access and errors in the console.
If you omit a parameter in this file, it will take the default value. For example, the default page is set by default to "index.html".

Now launch the server and it should run properly:
```
  node server.js
```

The console will output:
```
  Using config file "C:\Users\me\git\myProject\config.json"
  Using WWW directory "C:\Users\me\git\myProject\www"
  Server listening on: http://localhost:9000
```

Create a simple "index.html" file and put it in "myProject/www/":
```
  <!doctype html>
  <html>
    <head>
      <title>Hello world!</title>
    </head>
    <body>
      This is the Hello world page!
    </body>
  </html>
```

Now open a browser and request http://localhost:9000/ you should see the Hello world page. You can now build a whole website inside the WWW directory with images, CSS, JS ...


## Make a HTTPS server

You can run a web server over HTTPS protocol. You will need the SSL key file and the SSL certificate file.
If you want to run your server locally, you can generate those files on your computer with some commands, it will require OpenSSL installed. 

### Generate local SSL files by script

There is a shell script in the root directory that can do it for you. How to use it :
```
  ./generateSSL.sh example/ssl/ example
```
This will generate the files in the "example/ssl/" directory.
After succefull execution, the generated files are "example/ssl/example.key" and "example/ssl/example.crt".

### Generate local SSL files manually

You can generate manually those files by typing the commands yourself. You can go to the directory you want to create the SSL files "example.crt" and "example.key".

```
  cd example/ssl/
  openssl genrsa -des3 -passout pass:x -out example.pass.key 2048
  openssl rsa -passin pass:x -in example.pass.key -out example.key
```

You must know your local hostname or else your certificate will not work.
```
  hostname
```

Your host name is the response to field Common Name (CN or FQDN).
```
  openssl x509 -req -days 365 -in example.csr -signkey example.key -out example.crt
```

Cleanup temporary files.
```
  rm example.pass.key example.csr
```

If everything runs properly, you now have the 2 files "example.crt" and "example.key". They are ready to use with the example HTTPS server. They must be in the directory "example/ssl/".
If you use them in another project, you can also rename them.

### Configure the server

You now have the 2 SSL files. You need to configure the files in the config file of Web-servo, it may looks like this (in config.json):

```
  {
    "server": {
      "port": "443",
      "ssl": {
        "enabled": true,
        "key": "ssl/example.key",
        "cert": "ssl/example.crt"
      }
    }
  }
```
If you are using the example server, the config file is already ready in "example/config_https.json".
Then, you have to run your server with a simple line in a node script.

```
  require('web-servo').start();
```

The script is also ready in "example/server_https.js". You can run "node example/server_https.js".
Executing the example HTTPS server will have this result :

```
  Using config file "C:\Users\PR033\git\web-servo\example\config_https.json"
  Using WWW directory "C:\Users\PR033\git\web-servo\example\www"
  Server listening on: https://localhost:443
```

### Finally

You can now access the server on https://localhost/. If you are using a locally generated certificate, you may have a warning because your certificate is not validated by a trusted source. But it will run properly.

Way to disable the warning:
- [For Internet Explorer](https://www.poweradmin.com/help/sslhints/ie.aspx)
- [For Chrome](https://support.google.com/chrome/answer/99020)
- [For Firefox](http://ccm.net/faq/14655-firefox-disable-warning-when-accessing-secured-sites)

If your certificate files are invalid or corrupted, there might be no errors while running the server but your browser will prevent you to process the requests.

