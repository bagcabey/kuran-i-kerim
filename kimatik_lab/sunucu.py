"""Yerel sunucu (port 8000): dosyaları her açılışta güncel gönderir.

python -m http.server tarayıcının eski dosyaları önbellekten göstermesine izin
veriyordu; bu sürüm her yanıta "no-cache" ekler, böylece yapılan değişiklikler
sayfa yenilenince hemen görünür.
"""
import http.server
import socketserver
import sys

PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class NoCacheHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        self.send_header("Cache-Control", "no-cache, must-revalidate")
        super().end_headers()

    def log_message(self, *args):
        pass


class Server(socketserver.ThreadingMixIn, http.server.HTTPServer):
    daemon_threads = True
    allow_reuse_address = True


if __name__ == "__main__":
    with Server(("", PORT), NoCacheHandler) as httpd:
        httpd.serve_forever()
