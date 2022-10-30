import http.server
import socketserver
import webbrowser
import subprocess

proc= subprocess.Popen("python WebSockets.py", shell=True, stdout=subprocess.PIPE, stderr=subprocess.STDOUT)

PORT = 49350
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as http:
    print("serving at port", PORT)
    webbrowser.open("http://localhost:49350")
    http.serve_forever()