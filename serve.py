#!/usr/bin/env python3
"""
Local development server for DreamWaQ++ website.

Usage:
    python serve.py [port]
    
Examples:
    python serve.py        # Serves on port 8000
    python serve.py 3000   # Serves on port 3000

The server will automatically open your default browser.
Press Ctrl+C to stop the server.
"""

import http.server
import socketserver
import webbrowser
import sys
import os
from functools import partial

# Configuration
DEFAULT_PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))


class QuietHTTPRequestHandler(http.server.SimpleHTTPRequestHandler):
    """Custom handler with reduced logging and proper MIME types."""
    
    # Extended MIME types for modern web assets
    extensions_map = {
        **http.server.SimpleHTTPRequestHandler.extensions_map,
        '.js': 'application/javascript',
        '.mjs': 'application/javascript',
        '.json': 'application/json',
        '.woff': 'font/woff',
        '.woff2': 'font/woff2',
        '.ttf': 'font/ttf',
        '.otf': 'font/otf',
        '.svg': 'image/svg+xml',
        '.webp': 'image/webp',
        '.mp4': 'video/mp4',
        '.webm': 'video/webm',
        '.wasm': 'application/wasm',
    }
    
    def log_message(self, format, *args):
        """Quieter logging - only show requests, not all details."""
        if args[1] == '200':
            # Only log non-200 responses or specific files
            return
        sys.stderr.write(f"[{self.log_date_time_string()}] {format % args}\n")
    
    def end_headers(self):
        """Add CORS headers for local development."""
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()


def run_server(port=DEFAULT_PORT):
    """Start the development server."""
    os.chdir(DIRECTORY)
    
    handler = partial(QuietHTTPRequestHandler, directory=DIRECTORY)
    
    try:
        with socketserver.TCPServer(("", port), handler) as httpd:
            url = f"http://localhost:{port}"
            print(f"""
╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   🤖 DreamWaQ++ Development Server                           ║
║                                                              ║
║   Local:   {url:<47} ║
║                                                              ║
║   Press Ctrl+C to stop the server                            ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝
""")
            # Open browser
            webbrowser.open(url)
            
            # Serve forever
            httpd.serve_forever()
            
    except KeyboardInterrupt:
        print("\n\n✨ Server stopped. Goodbye!")
        sys.exit(0)
    except OSError as e:
        if e.errno == 98:  # Address already in use
            print(f"\n❌ Error: Port {port} is already in use.")
            print(f"   Try: python serve.py {port + 1}")
            sys.exit(1)
        raise


if __name__ == "__main__":
    port = DEFAULT_PORT
    
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            print(f"❌ Invalid port number: {sys.argv[1]}")
            print(f"   Usage: python serve.py [port]")
            sys.exit(1)
    
    run_server(port)


