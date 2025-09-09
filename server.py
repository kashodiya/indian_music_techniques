
import http.server
import socketserver
import os

PORT = 54330  # Using the port provided in the runtime information
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)
    
    def end_headers(self):
        # Add headers to allow CORS and iframe embedding
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        super().end_headers()

if __name__ == "__main__":
    handler = Handler
    
    with socketserver.TCPServer(("0.0.0.0", PORT), handler) as httpd:
        print(f"Server started at http://localhost:{PORT}")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("Server stopped.")
            httpd.server_close()
