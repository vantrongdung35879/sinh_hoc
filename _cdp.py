"""CDP helper for BioGalaxy regression checks."""
import json, subprocess, time, urllib.request, os, base64, sys
import websocket

CHROME = r"C:\Program Files\Google\Chrome\Application\chrome.exe"
PROFILE = r"C:\Users\Asus\AppData\Local\Temp\bg4prof"
PORT = 9333


def launch(width=1366, height=800):
    subprocess.run(["taskkill", "/F", "/IM", "chrome.exe"], capture_output=True)
    time.sleep(0.6)
    args = [CHROME, f"--remote-debugging-port={PORT}", f"--user-data-dir={PROFILE}",
            "--no-first-run", "--no-default-browser-check", "--disable-features=Translate",
            "--disable-backgrounding-occluded-windows", "--disable-renderer-backgrounding",
            f"--window-size={width},{height}", "--window-position=0,0", "about:blank"]
    subprocess.Popen(args)
    for _ in range(60):
        try:
            urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json/version", timeout=1)
            break
        except Exception:
            time.sleep(0.3)
    time.sleep(0.8)


class Tab:
    def __init__(self, url):
        tabs = json.load(urllib.request.urlopen(f"http://127.0.0.1:{PORT}/json"))
        page = [t for t in tabs if t["type"] == "page"][0]
        self.ws = websocket.create_connection(page["webSocketDebuggerUrl"], timeout=40)
        self.i = 0
        self.send("Page.enable")
        self.send("Runtime.enable")
        self.send("Log.enable")
        self.send("Page.navigate", {"url": url})
        self.wait_load()

    def send(self, method, params=None):
        self.i += 1
        self.ws.send(json.dumps({"id": self.i, "method": method, "params": params or {}}))
        while True:
            msg = json.loads(self.ws.recv())
            if msg.get("id") == self.i:
                return msg

    def wait_load(self, extra=3.0):
        t0 = time.time()
        while time.time() - t0 < 30:
            r = self.send("Runtime.evaluate", {
                "expression": "document.readyState + '|' + location.href",
                "returnByValue": True})
            v = r.get("result", {}).get("result", {}).get("value") or ""
            if v.startswith("complete|http") and "sinh.html" in v:
                break
            time.sleep(0.25)
        time.sleep(extra)

    def ev(self, expr, timeout=30):
        r = self.send("Runtime.evaluate", {
            "expression": expr, "returnByValue": True, "awaitPromise": True,
            "userGesture": True})
        res = r.get("result", {})
        if "exceptionDetails" in res:
            return {"__err": res["exceptionDetails"].get("text"),
                    "desc": str(res["exceptionDetails"].get("exception", {}).get("description"))[:400]}
        return res.get("result", {}).get("value")

    def shot(self, path, full=False):
        p = {"format": "png"}
        if full:
            p["captureBeyondViewport"] = True
        r = self.send("Page.captureScreenshot", p)
        data = r.get("result", {}).get("data")
        if not data:
            return False
        with open(path, "wb") as f:
            f.write(base64.b64decode(data))
        return True

    def metrics(self, w, h, mobile=False, dpr=1):
        self.send("Emulation.setDeviceMetricsOverride", {
            "width": w, "height": h, "deviceScaleFactor": dpr, "mobile": mobile})
        time.sleep(0.5)

    def tap(self, x, y):
        self.send("Input.dispatchMouseEvent", {"type": "mouseMoved", "x": x, "y": y})
        self.send("Input.dispatchMouseEvent", {"type": "mousePressed", "x": x, "y": y,
                                               "button": "left", "clickCount": 1})
        time.sleep(0.05)
        self.send("Input.dispatchMouseEvent", {"type": "mouseReleased", "x": x, "y": y,
                                               "button": "left", "clickCount": 1})
        time.sleep(0.25)

    def key(self, k, code=None, vk=0):
        self.send("Input.dispatchKeyEvent", {"type": "keyDown", "key": k,
                                             "code": code or k, "windowsVirtualKeyCode": vk})
        self.send("Input.dispatchKeyEvent", {"type": "keyUp", "key": k,
                                             "code": code or k, "windowsVirtualKeyCode": vk})
        time.sleep(0.2)

    def close(self):
        try:
            self.ws.close()
        except Exception:
            pass


def report(name, val):
    print(f"[{name}] {json.dumps(val, ensure_ascii=False)[:1500]}")
