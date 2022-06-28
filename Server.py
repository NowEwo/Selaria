from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess
import os
try:
    import pynput
except:
    os.system("pip3 install pynput")
import json
import sys

# subprocess.run("python Launcher.py", capture_output=True)

hostName = "localhost"
serverPort = 9000

class MyServer(BaseHTTPRequestHandler):
    def do_GET(self):
        self.send_response(200)
        self.send_header("Content-type", "text")
        self.end_headers()
    def do_POST(self):
        self.send_response(200)
        self.send_header("Content-type", "text")
        self.end_headers()
        content_length = int(self.headers['Content-Length'])
        body = self.rfile.read(content_length)
        body = body.decode('utf-8')
        body = json.loads(body)
        if(body["Action"] == "WriteFile"):
            with open(body["FileName"], body["Type"]) as f:
                f.write(body["FileContent"])
        elif(body["Action"] == "ReadFile"):
            with open(body["FileName"], "r") as f:
                self.wfile.write(bytes(f.read(), "utf-8"))
        elif(body["Action"] == "ExecuteCommand"):
            self.wfile.write(bytes(subprocess.run(body["Command"], capture_output=True).stdout, "utf-8"))
        elif(body["Action"] == "DeleteFile"):
            os.remove(body["FileName"])
        elif(body["Action"] == "CreateFile"):
            with open(body["FileName"], body["Type"]) as f:
                f.write("")
        elif(body["Action"] == "CreateFolder"):
            os.mkdir(body["FolderName"])
        elif(body["Action"] == "DeleteFolder"):
            os.rmdir(body["FolderName"])
        elif(body["Action"] == "KeyboardInput"):
            pynput.keyboard.Controller().type(body["Text"])
        elif(body["Action"] == "MouseInput"):
            PreviousPosition = pynput.mouse.Controller().position
            pynput.mouse.Controller().position = body["Position"]
            pynput.mouse.Controller().click("left")
            pynput.mouse.Controller().position = PreviousPosition
        elif(body["Action"] == "MouseMove"):
            pynput.mouse.Controller().position = body["Position"]
        elif(body["Action"] == "MouseScroll"):
            pynput.mouse.Controller().scroll(body["Scroll"])

if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print(f"Server started http://{hostName}:{serverPort}")
 
    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass
 
    webServer.server_close()
    print("Http server stopped.")