import http.server
import socketserver
import webbrowser

PORT = 49350
Handler = http.server.SimpleHTTPRequestHandler
with socketserver.TCPServer(("", PORT), Handler) as http:
    print("serving at port", PORT)
    webbrowser.open("http://localhost:49350")
    http.serve_forever()