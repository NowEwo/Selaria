from http.server import BaseHTTPRequestHandler, HTTPServer
import subprocess
import json
import sys
import os

# subprocess.run("python Launcher.py", capture_output=True)

hostName = "127.0.0.1"
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

if __name__ == "__main__":        
    webServer = HTTPServer((hostName, serverPort), MyServer)
    print(f"Server started http://{hostName}:{serverPort}")
 
    try:
        webServer.serve_forever()
    except KeyboardInterrupt:
        pass
 
    webServer.server_close()
    print("Http server stopped.")