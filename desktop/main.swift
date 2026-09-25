import Cocoa
import WebKit

// ─────────────────────────────────────────────────────────────────────────────
// 🛰️ ATELIER MATEMÁTICO — RUNNER NATIVO APPLE SILICON
// Nai Systems © 2026 · Arquitectura de Cero Latencia y Memoria Volátil
// ─────────────────────────────────────────────────────────────────────────────

class NativeBridge: NSObject, WKScriptMessageHandler {
    weak var webView: WKWebView?

    func userContentController(_ userContentController: WKUserContentController, didReceive message: WKScriptMessage) {
        guard let dict = message.body as? [String: Any],
              let action = dict["action"] as? String else {
            return
        }

        switch action {
        case "getSystemSpecs":
            handleGetSystemSpecs(dict: dict)
        case "saveFile":
            handleSaveFile(dict: dict)
        case "navigate":
            if let target = dict["target"] as? String {
                navigateTo(room: target)
            }
        default:
            print("[NativeBridge] Acción no reconocida: \(action)")
        }
    }

    private func handleGetSystemSpecs(dict: [String: Any]) {
        let callbackId = dict["callbackId"] as? Int ?? 0

        var chipName = "Apple Silicon"
        var size = 0
        sysctlbyname("machdep.cpu.brand_string", nil, &size, nil, 0)
        if size > 0 {
            var name = [CChar](repeating: 0, count: size)
            sysctlbyname("machdep.cpu.brand_string", &name, &size, nil, 0)
            chipName = String(cString: name)
        } else {
            var modelSize = 0
            sysctlbyname("hw.model", nil, &modelSize, nil, 0)
            if modelSize > 0 {
                var model = [CChar](repeating: 0, count: modelSize)
                sysctlbyname("hw.model", &model, &modelSize, nil, 0)
                chipName = "Apple Silicon (\(String(cString: model)))"
            }
        }

        let cores = ProcessInfo.processInfo.activeProcessorCount
        let memoryBytes = ProcessInfo.processInfo.physicalMemory
        let memoryGB = Double(memoryBytes) / (1024 * 1024 * 1024)

        let jsonPayload: [String: Any] = [
            "chip": chipName,
            "cores": cores,
            "memory": String(format: "%.1f GB Memoria Unificada", memoryGB),
            "architecture": "ARM64 Apple Silicon",
            "os": "macOS \(ProcessInfo.processInfo.operatingSystemVersionString)",
            "governance": "Timonel F2 (Nativo)",
            "casEngine": "Algebrite + TimonelCAS Client-Side"
        ]

        dispatchCallback(id: callbackId, data: jsonPayload)
    }

    private func handleSaveFile(dict: [String: Any]) {
        let callbackId = dict["callbackId"] as? Int ?? 0
        guard let filename = dict["filename"] as? String,
              let dataStr = dict["data"] as? String else {
            dispatchCallback(id: callbackId, data: ["success": false, "error": "Parámetros inválidos"])
            return
        }

        let isBase64 = dict["isBase64"] as? Bool ?? false
        let downloadsUrl = FileManager.default.urls(for: .downloadsDirectory, in: .userDomainMask).first!
        let fileUrl = downloadsUrl.appendingPathComponent(filename)

        do {
            if isBase64 {
                var cleanBase64 = dataStr
                if let commaIdx = dataStr.firstIndex(of: ",") {
                    cleanBase64 = String(dataStr[dataStr.index(after: commaIdx)...])
                }
                if let data = Data(base64Encoded: cleanBase64) {
                    try data.write(to: fileUrl)
                } else {
                    throw NSError(domain: "Base64Decode", code: 1, userInfo: nil)
                }
            } else {
                try dataStr.write(to: fileUrl, atomically: true, encoding: .utf8)
            }

            dispatchCallback(id: callbackId, data: [
                "success": true,
                "path": fileUrl.path,
                "filename": filename
            ])
            print("[NativeBridge] Archivo guardado con éxito: \(fileUrl.path)")
        } catch {
            dispatchCallback(id: callbackId, data: [
                "success": false,
                "error": error.localizedDescription
            ])
        }
    }

    func navigateTo(room: String) {
        guard let webView = self.webView else { return }
        if let resUrl = Bundle.main.resourceURL?.appendingPathComponent(room),
           FileManager.default.fileExists(atPath: resUrl.path) {
            webView.loadFileURL(resUrl, allowingReadAccessTo: Bundle.main.resourceURL!)
        } else {
            // Fallback directorio local
            let cwd = FileManager.default.currentDirectoryPath
            let localUrl = URL(fileURLWithPath: cwd).appendingPathComponent("gallery").appendingPathComponent(room)
            if FileManager.default.fileExists(atPath: localUrl.path) {
                webView.loadFileURL(localUrl, allowingReadAccessTo: localUrl.deletingLastPathComponent())
            }
        }
    }

    private func dispatchCallback(id: Int, data: [String: Any]) {
        guard let webView = self.webView,
              let jsonData = try? JSONSerialization.data(withJSONObject: data),
              let jsonStr = String(data: jsonData, encoding: .utf8) else {
            return
        }

        let js = "window.AtelierDesktop && window.AtelierDesktop._dispatchCallback(\(id), \(jsonStr));"
        DispatchQueue.main.async {
            webView.evaluateJavaScript(js, completionHandler: nil)
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// DELEGADO PRINCIPAL DE LA APLICACIÓN
// ─────────────────────────────────────────────────────────────────────────────

class AppDelegate: NSObject, NSApplicationDelegate, WKNavigationDelegate {
    var window: NSWindow!
    var webView: WKWebView!
    let bridge = NativeBridge()

    func applicationDidFinishLaunching(_ notification: Notification) {
        setupMenu()
        setupWindow()
        loadInitialRoom()
    }

    func setupMenu() {
        let mainMenu = NSMenu()

        // 1. Menú de Aplicación
        let appMenuItem = NSMenuItem()
        let appMenu = NSMenu()
        appMenu.addItem(withTitle: "Acerca de Atelier Matemático", action: #selector(showAbout), keyEquivalent: "")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Ocultar", action: #selector(NSApplication.hide(_:)), keyEquivalent: "h")
        appMenu.addItem(withTitle: "Ocultar Otros", action: #selector(NSApplication.hideOtherApplications(_:)), keyEquivalent: "h")
        appMenu.addItem(NSMenuItem.separator())
        appMenu.addItem(withTitle: "Salir de Atelier Matemático", action: #selector(NSApplication.terminate(_:)), keyEquivalent: "q")
        appMenuItem.submenu = appMenu
        mainMenu.addItem(appMenuItem)

        // 2. Menú de Salas (Navegación Rápida)
        let roomsMenuItem = NSMenuItem()
        let roomsMenu = NSMenu(title: "Salas")
        roomsMenu.addItem(withTitle: "Sala I · El Pórtico", action: #selector(gotoRoom1), keyEquivalent: "1")
        roomsMenu.addItem(withTitle: "Sala II · La Boutique Fine Art", action: #selector(gotoRoom2), keyEquivalent: "2")
        roomsMenu.addItem(withTitle: "Sala III · Mesa Técnica 2D", action: #selector(gotoRoom3), keyEquivalent: "3")
        roomsMenu.addItem(withTitle: "Sala IV · Observatorio 3D", action: #selector(gotoRoom4), keyEquivalent: "4")
        roomsMenu.addItem(withTitle: "Sala V · Aula Sincrónica & CAS", action: #selector(gotoRoom5), keyEquivalent: "5")
        roomsMenuItem.submenu = roomsMenu
        mainMenu.addItem(roomsMenuItem)

        // 3. Menú Ver
        let viewMenuItem = NSMenuItem()
        let viewMenu = NSMenu(title: "Ver")
        viewMenu.addItem(withTitle: "Recargar Sala", action: #selector(reloadPage), keyEquivalent: "r")
        viewMenu.addItem(withTitle: "Pantalla Completa", action: #selector(toggleFullScreen), keyEquivalent: "f")
        viewMenuItem.submenu = viewMenu
        mainMenu.addItem(viewMenuItem)

        NSApplication.shared.mainMenu = mainMenu
    }

    func setupWindow() {
        let initialWidth: CGFloat = 1440
        let initialHeight: CGFloat = 900
        let screenSize = NSScreen.main?.visibleFrame.size ?? CGSize(width: 1600, height: 1000)
        let rect = NSRect(
            x: (screenSize.width - initialWidth) / 2,
            y: (screenSize.height - initialHeight) / 2,
            width: initialWidth,
            height: initialHeight
        )

        window = NSWindow(
            contentRect: rect,
            styleMask: [.titled, .closable, .miniaturizable, .resizable, .fullSizeContentView],
            backing: .buffered,
            defer: false
        )

        window.title = "Atelier Matemático — Estación de Trabajo en Silicio"
        window.titlebarAppearsTransparent = true
        window.titleVisibility = .hidden
        window.backgroundColor = NSColor(red: 8/255.0, green: 8/255.0, blue: 10/255.0, alpha: 1.0)
        window.isMovableByWindowBackground = true

        // Configuración de WebKit
        let config = WKWebViewConfiguration()
        let userContent = WKUserContentController()

        bridge.webView = nil // set later
        userContent.add(bridge, name: "timonelDesktop")

        // Inyectar bridge.js
        if let bridgeScriptUrl = Bundle.main.resourceURL?.appendingPathComponent("bridge.js"),
           let bridgeCode = try? String(contentsOf: bridgeScriptUrl) {
            let script = WKUserScript(source: bridgeCode, injectionTime: .atDocumentStart, forMainFrameOnly: false)
            userContent.addUserScript(script)
        }

        config.userContentController = userContent
        config.preferences.setValue(true, forKey: "allowFileAccessFromFileURLs")

        webView = WKWebView(frame: window.contentView!.bounds, configuration: config)
        webView.autoresizingMask = [.width, .height]
        webView.navigationDelegate = self
        webView.setValue(false, forKey: "drawsBackground") // transparente para ver obsidian

        bridge.webView = webView
        window.contentView?.addSubview(webView)
        window.makeKeyAndOrderFront(nil)
    }

    func loadInitialRoom() {
        bridge.navigateTo(room: "classroom.html")
    }

    @objc func showAbout() {
        let alert = NSAlert()
        alert.messageText = "Atelier Matemático · Estación de Trabajo en Silicio"
        alert.informativeText = "Versión 2.4.0 (Silicio Nativo ARM64)\nAtelier Matemático © 2026 Nai Systems.\nGobernanza: Timonel F2 · Física Computacional en Silicio."
        alert.alertStyle = .informational
        alert.addButton(withTitle: "Entendido")
        alert.runModal()
    }

    @objc func gotoRoom1() { bridge.navigateTo(room: "index.html") }
    @objc func gotoRoom2() { bridge.navigateTo(room: "shop.html") }
    @objc func gotoRoom3() { bridge.navigateTo(room: "studio.html") }
    @objc func gotoRoom4() { bridge.navigateTo(room: "museum.html") }
    @objc func gotoRoom5() { bridge.navigateTo(room: "classroom.html") }
    @objc func reloadPage() { webView.reload() }
    @objc func toggleFullScreen() { window.toggleFullScreen(nil) }

    func applicationShouldTerminateAfterLastWindowClosed(_ sender: NSApplication) -> Bool {
        return true
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// PUNTO DE ENTRADA
// ─────────────────────────────────────────────────────────────────────────────

let app = NSApplication.shared
let delegate = AppDelegate()
app.delegate = delegate
app.setActivationPolicy(.regular)
app.run()
