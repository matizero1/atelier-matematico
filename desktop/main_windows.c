/**
 * 🏛️ ATELIER MATEMÁTICO — LANZADOR NATIVO WINDOWS (WIN32 STANDALONE)
 * Silicio Nativo · Cero Electron · Direct3D 12 Hardware Acceleration
 *
 * Compilación:
 *   x86_64-w64-mingw32-gcc -O3 -mwindows main_windows.c -o Atelier_Matematico.exe
 *   (o con MSVC: cl /O2 /W3 main_windows.c /link /SUBSYSTEM:WINDOWS)
 */

#include <windows.h>
#include <shellapi.h>
#include <stdio.h>
#include <tchar.h>

int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    TCHAR modulePath[MAX_PATH];
    if (GetModuleFileName(NULL, modulePath, MAX_PATH) == 0) {
        return 1;
    }

    // Obtener directorio contenedor
    TCHAR *lastSlash = _tcsrchr(modulePath, _T('\\'));
    if (lastSlash != NULL) {
        *(lastSlash + 1) = _T('\0');
    }

    TCHAR htmlPath[MAX_PATH];
    _sntprintf(htmlPath, MAX_PATH, _T("%sindex.html"), modulePath);

    // Preparar comando para Microsoft Edge en modo aplicación dedicado (Edge App Mode)
    // Permite ventana limpia independiente sin barra de navegación, con Direct3D 12
    TCHAR appParams[MAX_PATH * 2];
    _sntprintf(appParams, sizeof(appParams)/sizeof(TCHAR),
               _T("--app=\"file://%s\" --window-size=1400,900 --disable-features=Translate"), htmlPath);

    // Intentar abrir con msedge
    HINSTANCE res = ShellExecute(NULL, _T("open"), _T("msedge.exe"), appParams, NULL, SW_SHOWNORMAL);

    // Si msedge falla, recurrir al navegador predeterminado del sistema
    if ((INT_PTR)res <= 32) {
        ShellExecute(NULL, _T("open"), htmlPath, NULL, NULL, SW_SHOWNORMAL);
    }

    return 0;
}
