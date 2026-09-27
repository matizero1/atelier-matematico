/**
 * 🏛️ ATELIER MATEMÁTICO — LANZADOR NATIVO LINUX (GTK3 + WEBKIT2GTK)
 * Silicio Nativo · Cero Electron · Alto Rendimiento WebGL
 *
 * Compilación:
 *   gcc -O3 main_linux.c $(pkg-config --cflags --libs gtk+-3.0 webkit2gtk-4.1) -o atelier-matematico-bin
 *   (o con webkit2gtk-4.0 en distros anteriores como Ubuntu 20.04)
 */

#include <gtk/gtk.h>
#include <webkit2/webkit2.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>
#include <libgen.h>
#include <limits.h>

static void on_destroy(GtkWidget *widget, gpointer data) {
    gtk_main_quit();
}

int main(int argc, char *argv[]) {
    gtk_init(&argc, &argv);

    // Obtener ruta absoluta del directorio del ejecutable
    char exe_path[PATH_MAX];
    ssize_t len = readlink("/proc/self/exe", exe_path, sizeof(exe_path) - 1);
    if (len == -1) {
        perror("readlink");
        return 1;
    }
    exe_path[len] = '\0';
    char *dir = dirname(exe_path);

    char html_uri[PATH_MAX + 16];
    snprintf(html_uri, sizeof(html_uri), "file://%s/../index.html", dir);

    // Crear ventana principal GTK
    GtkWidget *window = gtk_window_new(GTK_WINDOW_TOPLEVEL);
    gtk_window_set_title(GTK_WINDOW(window), "Atelier Matemático · Estación de Trabajo Soberana");
    gtk_window_set_default_size(GTK_WINDOW(window), 1400, 900);
    gtk_window_set_position(GTK_WINDOW(window), GTK_WIN_POS_CENTER);

    // Configurar ajustes de WebKit con aceleración gráfica completa
    WebKitSettings *settings = webkit_settings_new();
    webkit_settings_set_enable_webgl(settings, TRUE);
    webkit_settings_set_enable_accelerated_2d_canvas(settings, TRUE);
    webkit_settings_set_enable_smooth_scrolling(settings, TRUE);
    webkit_settings_set_allow_file_access_from_file_urls(settings, TRUE);
    webkit_settings_set_allow_universal_access_from_file_urls(settings, TRUE);
    webkit_settings_set_enable_developer_extras(settings, FALSE);

    // Crear WebView
    GtkWidget *web_view = webkit_web_view_new_with_settings(settings);
    gtk_container_add(GTK_CONTAINER(window), web_view);

    // Señales de ciclo de vida
    g_signal_connect(window, "destroy", G_CALLBACK(on_destroy), NULL);

    // Cargar interfaz local
    webkit_web_view_load_uri(WEBKIT_WEB_VIEW(web_view), html_uri);

    gtk_widget_show_all(window);
    gtk_main();

    return 0;
}
