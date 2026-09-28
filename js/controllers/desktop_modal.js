/**
 * 🛰️ ATELIER MATEMÁTICO — DESKTOP WORKSTATION CONVERSION CONTROLLER
 * Ecosistema de Doble Nivel (Web Showcase <-> Native Desktop Pro)
 * Gobernanza: Timonel F2 · Silicio Nativo · Cero Falsas Expectativas
 */

(function(root) {
  'use strict';

  let currentOS = 'macos-arm';

  const OS_BUILDS = {
    'macos-arm': {
      label: 'macOS Apple Silicon (M1 / M2 / M3 / M4)',
      filename: 'Atelier_Matematico_Silicon_arm64.dmg',
      arch: 'Universal ARM64 / Apple Accelerate & Metal',
      badge: 'Silicio Nativo',
      size: '2.5 MB',
      sha256: 'b094de966ae878498922e425d4a191de60be7270eec97edfa901565270599377',
      reqs: 'macOS 12.0 Monterrey o superior (Recomendado M-Series)'
    },
    'macos-intel': {
      label: 'macOS Intel (x86_64)',
      filename: 'Atelier_Matematico_Intel_x64.dmg',
      arch: 'Intel AVX2 / SSE4.2 / Accelerate',
      badge: 'Legacy x86',
      size: '2.5 MB',
      sha256: 'c81b1301d641bf62242d13f78a88f33720cf6ac50564ccb47933d2a07414be2d',
      reqs: 'macOS 11.0 Big Sur o superior'
    },
    'linux': {
      label: 'Linux (Portable .tar.gz)',
      filename: 'Atelier_Matematico_Linux_Portable.tar.gz',
      arch: 'Linux x86_64 / POSIX + WebKitGTK / Chromium',
      badge: 'Portable Standalone',
      size: '2.1 MB',
      sha256: '1de02c4f691e87e4f1cbd45c41fa3098b7e00a4a2a09d14f49ed84e69c7cdfd9',
      reqs: 'Cualquier distribución Linux x86_64 (glibc 2.31+)'
    },
    'windows': {
      label: 'Windows 11 / 10 (Portable .zip)',
      filename: 'Atelier_Matematico_Windows_Portable.zip',
      arch: 'Windows x64 / Direct3D 12 Edge App Mode',
      badge: 'Portable Standalone',
      size: '2.1 MB',
      sha256: 'd60c79662b957ec4ff88878cfc53682eed0ea349dd3c746b5648233737f57f13',
      reqs: 'Windows 10 versión 1903 o superior / Windows 11'
    }
  };

  function detectOS() {
    if (typeof navigator === 'undefined') return 'macos-arm';
    const ua = (navigator.userAgent || '').toLowerCase();
    if (ua.includes('mac')) {
      return 'macos-arm';
    } else if (ua.includes('linux')) {
      return 'linux';
    } else if (ua.includes('win')) {
      return 'windows';
    }
    return 'macos-arm';
  }

  function injectModalMarkup() {
    if (typeof document === 'undefined') return;
    if (document.getElementById('desktop-workstation-modal')) return;

    const modal = document.createElement('div');
    modal.id = 'desktop-workstation-modal';
    modal.className = 'fixed inset-0 z-[100] bg-[#08080a]/92 backdrop-blur-md flex items-center justify-center p-4 hidden';
    modal.innerHTML = `
      <div class="max-w-3xl w-full max-h-[90vh] overflow-y-auto rounded-2xl bg-[#101014] p-6 md:p-8 space-y-6 luxury-gold-border relative text-left shadow-2xl">
        
        <!-- Botón de Cerrar -->
        <button onclick="closeDesktopModal()" class="absolute top-5 right-5 text-[#a1a1aa] hover:text-[#f4f1ea] mono text-lg transition">✕</button>

        <!-- Cabecera Institucional -->
        <div class="border-b border-white/[0.08] pb-4">
          <div class="flex items-center gap-2 mb-1.5">
            <span class="w-2 h-2 rounded-full bg-[#c5a059] animate-pulse"></span>
            <span class="text-[11px] mono uppercase tracking-[0.2em] text-[#c5a059]">Atelier Desktop Workstation · Nivel II</span>
          </div>
          <h2 class="serif text-2xl md:text-3xl text-[#f4f1ea] font-normal">Estación de Trabajo Soberana en Silicio</h2>
          <p class="text-xs text-[#a1a1aa] mt-1 leading-relaxed">
            Descarga la suite offline y autónoma de física matemática nativa para tu plataforma. Sin sobrecoste de navegador, 100% desconectada y con aceleración gráfica completa.
          </p>
        </div>

        <!-- Selector de Sistema Operativo -->
        <div>
          <label class="block text-[10px] mono uppercase tracking-wider text-[#71717a] mb-2">Selecciona tu Plataforma:</label>
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button onclick="switchOSBuild('macos-arm')" id="os-btn-macos-arm" class="os-tab-btn py-2.5 px-3 rounded-lg border text-center transition text-xs mono">
              macOS Apple Silicon
            </button>
            <button onclick="switchOSBuild('macos-intel')" id="os-btn-macos-intel" class="os-tab-btn py-2.5 px-3 rounded-lg border text-center transition text-xs mono">
              macOS Intel
            </button>
            <button onclick="switchOSBuild('linux')" id="os-btn-linux" class="os-tab-btn py-2.5 px-3 rounded-lg border text-center transition text-xs mono">
              Linux x64
            </button>
            <button onclick="switchOSBuild('windows')" id="os-btn-windows" class="os-tab-btn py-2.5 px-3 rounded-lg border text-center transition text-xs mono">
              Windows x64
            </button>
          </div>
        </div>

        <!-- Tarjeta de Descarga del Paquete Seleccionado -->
        <div class="bg-[#08080a] p-4 rounded-xl luxury-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <div class="space-y-1.5 text-center sm:text-left">
            <div class="flex items-center gap-2 justify-center sm:justify-start">
              <span class="text-sm text-[#f4f1ea] font-medium" id="build-label">macOS Apple Silicon (M1 / M2 / M3 / M4)</span>
              <span class="text-[9px] mono px-2 py-0.5 rounded border border-[#c5a059]/40 text-[#c5a059] bg-[#c5a059]/10" id="build-badge">Silicio Nativo</span>
            </div>
            <div class="text-[11px] mono text-[#71717a]" id="build-reqs">macOS 12.0 Monterrey o superior · Arquitectura: Universal ARM64</div>
            <div class="text-[10px] mono text-[#c5a059]" id="build-specs">
              Archivo: <span id="build-filename" class="text-[#f4f1ea]">Atelier_Matematico_Silicon_arm64.dmg</span> · Tamaño: <span id="build-size" class="text-[#f4f1ea]">2.4 MB</span>
            </div>
            <div class="text-[9px] mono text-[#52525b] truncate max-w-xs md:max-w-md" id="build-hash">
              SHA-256: ac11bd68918bdd82b82aa7da37cb36ad636a38160400f8de819bfef885ef65ae
            </div>
          </div>
          <div class="flex flex-col items-center gap-2 w-full sm:w-auto">
            <button onclick="triggerDesktopDownload()" class="w-full sm:w-auto bg-[#c5a059] hover:bg-[#dfc285] text-[#08080a] font-semibold py-2.5 px-6 rounded-full text-xs uppercase tracking-wider mono transition shadow-md flex items-center justify-center gap-2 cursor-pointer">
              <span>📥 Descargar Gratuito</span>
            </button>
            <a href="downloads/SHA256SUMS.txt" target="_blank" class="text-[10px] mono text-[#a1a1aa] hover:text-[#c5a059] underline">
              Verificar SHA256SUMS.txt
            </a>
          </div>
        </div>

        <!-- Banner de Estado de Descarga en Vivo -->
        <div id="download-status-banner" class="hidden"></div>

        <!-- Matriz Comparativa Honesta: Free Web/Desktop vs Pro Unlock -->
        <div class="space-y-3">
          <h3 class="serif text-base text-[#f4f1ea]">Matriz de Capacidades: Nivel Libre vs. Desbloqueo Pro</h3>
          <div class="overflow-x-auto rounded-xl luxury-border">
            <table class="w-full text-left text-xs">
              <thead class="bg-[#08080a] border-b border-white/[0.08] text-[#71717a] mono text-[10px] uppercase">
                <tr>
                  <th class="py-2.5 px-3.5">Capacidad / Dimensión</th>
                  <th class="py-2.5 px-3.5">Web & App Gratis</th>
                  <th class="py-2.5 px-3.5 text-[#c5a059]">App Desktop PRO (Silicio)</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-white/[0.05] text-[#a1a1aa]">
                <tr>
                  <td class="py-2 px-3.5 font-medium text-[#f4f1ea]">Catálogo de Ecuaciones</td>
                  <td class="py-2 px-3.5">100 Obras Canónicas</td>
                  <td class="py-2 px-3.5 text-[#c5a059] font-medium">8.000+ Fórmulas & EDPs en SQLite</td>
                </tr>
                <tr>
                  <td class="py-2 px-3.5 font-medium text-[#f4f1ea]">Rendimiento & Núcleos</td>
                  <td class="py-2 px-3.5">1 hilo en JS Canvas / WebGL</td>
                  <td class="py-2 px-3.5 text-[#c5a059] font-medium">100% CPU multi-hilo (OpenMP/GCD)</td>
                </tr>
                <tr>
                  <td class="py-2 px-3.5 font-medium text-[#f4f1ea]">Aceleración Gráfica</td>
                  <td class="py-2 px-3.5">Shaders WebGL básicos</td>
                  <td class="py-2 px-3.5 text-[#c5a059] font-medium">Metal Compute nativo en Apple Silicon</td>
                </tr>
                <tr>
                  <td class="py-2 px-3.5 font-medium text-[#f4f1ea]">Límites de Memoria</td>
                  <td class="py-2 px-3.5">Restringido a cuota de navegador (2-4 GB)</td>
                  <td class="py-2 px-3.5 text-[#c5a059] font-medium">Hasta 64 GB RAM Unificada</td>
                </tr>
                <tr>
                  <td class="py-2 px-3.5 font-medium text-[#f4f1ea]">Exportación 3D CAD/DFAM</td>
                  <td class="py-2 px-3.5">PNG / WebM</td>
                  <td class="py-2 px-3.5 text-[#c5a059] font-medium">Sólidos paramétricos STEP / STL / IGES</td>
                </tr>
                <tr>
                  <td class="py-2 px-3.5 font-medium text-[#f4f1ea]">Auditoría Timonel F2</td>
                  <td class="py-2 px-3.5">Linter algebraico básico</td>
                  <td class="py-2 px-3.5 text-[#c5a059] font-medium">Verificación formal de tensores y FEM</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Pie Institucional con Garantías de Ingeniería -->
        <div class="pt-3 border-t border-white/[0.08] flex flex-col sm:flex-row justify-between items-center gap-3 text-[10px] mono text-[#71717a]">
          <div class="flex items-center gap-3">
            <span>🛡️ Cero telemetría</span>
            <span>•</span>
            <span>🔒 100% Local y Desconectado</span>
            <span>•</span>
            <span>⚖️ Licencia Académica & Comercial</span>
          </div>
          <div class="text-[#c5a059]">
            Desarrollado en Silicio Nativo · Santiago de Chile
          </div>
        </div>

      </div>
    `;

    document.body.appendChild(modal);
  }

  function switchOSBuild(osKey) {
    if (!OS_BUILDS[osKey]) return;
    currentOS = osKey;
    const b = OS_BUILDS[osKey];

    const label = document.getElementById('build-label');
    const badge = document.getElementById('build-badge');
    const reqs = document.getElementById('build-reqs');
    const filename = document.getElementById('build-filename');
    const size = document.getElementById('build-size');
    const hash = document.getElementById('build-hash');

    if (label) label.textContent = b.label;
    if (badge) badge.textContent = b.badge;
    if (reqs) reqs.textContent = `${b.reqs} · Arquitectura: ${b.arch}`;
    if (filename) filename.textContent = b.filename;
    if (size) size.textContent = b.size;
    if (hash) hash.textContent = `SHA-256: ${b.sha256}`;

    // Actualizar estilos activos de los botones
    if (typeof document !== 'undefined') {
      document.querySelectorAll('.os-tab-btn').forEach(btn => {
        btn.className = 'os-tab-btn py-2.5 px-3 rounded-lg border text-center transition text-xs mono border-white/10 text-[#a1a1aa] hover:border-white/20';
      });
      const activeBtn = document.getElementById(`os-btn-${osKey}`);
      if (activeBtn) {
        activeBtn.className = 'os-tab-btn py-2.5 px-3 rounded-lg border text-center transition text-xs mono border-[#c5a059] text-[#c5a059] bg-[#c5a059]/10 font-semibold';
      }
    }
  }

  function openDesktopModal() {
    injectModalMarkup();
    const modal = document.getElementById('desktop-workstation-modal');
    if (modal) {
      modal.classList.remove('hidden');
      switchOSBuild(detectOS());
    }
  }

  function closeDesktopModal() {
    const modal = document.getElementById('desktop-workstation-modal');
    if (modal) modal.classList.add('hidden');
  }

  function triggerDesktopDownload() {
    const b = OS_BUILDS[currentOS] || OS_BUILDS['macos-arm'];
    
    // Iniciar descarga directa del paquete real físico
    const link = document.createElement('a');
    link.href = 'downloads/' + b.filename;
    link.download = b.filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Notificación visual en interfaz sobria y honesta
    const statusEl = document.getElementById('download-status-banner');
    if (statusEl) {
      statusEl.classList.remove('hidden');
      statusEl.innerHTML = `
        <div class="flex items-center justify-between text-xs mono text-[#c5a059] bg-[#c5a059]/10 border border-[#c5a059]/30 rounded-lg p-3">
          <span>✓ Descarga iniciada: <strong>${b.filename}</strong> (${b.size})</span>
          <span class="text-[10px] text-[#a1a1aa]">SHA-256: ${b.sha256.substring(0, 16)}...</span>
        </div>
      `;
    }
  }

  // Exportar a nivel global
  root.openDesktopModal = openDesktopModal;
  root.closeDesktopModal = closeDesktopModal;
  root.switchOSBuild = switchOSBuild;
  root.triggerDesktopDownload = triggerDesktopDownload;
  root.OS_BUILDS = OS_BUILDS;

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = { openDesktopModal, closeDesktopModal, switchOSBuild, triggerDesktopDownload, OS_BUILDS };
  }

  // Auto-inyectar al cargar el DOM
  if (typeof document !== 'undefined') {
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', () => {
        injectModalMarkup();
        switchOSBuild(detectOS());
      });
    } else {
      injectModalMarkup();
      switchOSBuild(detectOS());
    }
  }

})(typeof window !== 'undefined' ? window : globalThis);
