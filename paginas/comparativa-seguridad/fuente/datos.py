# -*- coding: utf-8 -*-
"""
Datos de la comparativa de seguridad por plataforma.

Todo lo que es tabla vive aquí, no en el HTML. `generar.py` lo convierte en
HTML estático (la página se lee sin JavaScript) y numera las fuentes en el
orden en que aparecen. Fecha de consulta de toda la evidencia: 2-oct-2026.

Escenarios (claves de columna):
  w  · Windows: Windows 11 Pro Education/Education + Intune + Entra ID (+ Defender)
  i  · iPad: iPad supervisado + Apple School Manager + MDM + Apple Classroom
  c  · Chromebook + Securly: ChromeOS + Chrome Education Upgrade + Google Workspace
       for Education + Securly Filter y Classroom
  s  · iPad + Securly: el escenario i + Securly Filter (SmartPAC) y Aware

Escala de la Tabla 1 y afines: 5 Excelente · 4 Bueno · 3 Parcial · 2 Limitado ·
1 Débil · 0 No disponible.
"""

FECHA_CONSULTA = "2 de octubre de 2026"

ESCENARIOS = [
    ("w", "Windows", "Laptop Windows"),
    ("i", "iPad", "iPad supervisado"),
    ("c", "Chromebook + Securly", "Chromebook administrada"),
    ("s", "iPad + Securly", "iPad supervisado"),
]

ESCALA = {
    5: ("✅", "Excelente"),
    4: ("🟢", "Bueno"),
    3: ("🟡", "Parcial"),
    2: ("🟠", "Limitado"),
    1: ("🔴", "Débil"),
    0: ("➖", "No disponible"),
}

NIVEL = {
    "alto":   ("🔴", "Riesgo alto"),
    "medio":  ("🟠", "Riesgo medio"),
    "bajo":   ("🟢", "Riesgo bajo"),
    "bloq":   ("🔒", "Bloqueable"),
    "dep":    ("⚠️", "Depende de configuración"),
}

# ════════════════════════════════════════════════════════════════════
# FUENTES · clave → (título, emisor, url, tipo)
# tipo: primaria · comunidad (anecdótica) · prensa · academica · revendedor
# ════════════════════════════════════════════════════════════════════
F = {
    # ── Microsoft ──
    "ms-se": ("Windows 11 SE: preguntas frecuentes y fin de soporte", "Microsoft Learn", "https://learn.microsoft.com/en-us/education/windows/windows-11-se-faq", "primaria"),
    "ms-esu": ("Windows 10: actualizaciones de seguridad extendidas (ESU)", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/whats-new/extended-security-updates", "primaria"),
    "ms-esu-edu": ("Fin de soporte de Windows 10: precios ESU para educación", "Microsoft Education Blog", "https://www.microsoft.com/en-us/education/blog/2024/04/windows-10-end-of-support-updates-for-education/", "primaria"),
    "ms-26h2": ("Novedades de Windows 11, versión 26H2", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/whats-new/whats-new-windows-11-version-26h2", "primaria"),
    "ms-ediciones": ("Requisitos de licencia y edición de la seguridad de Windows", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/security/licensing-and-edition-requirements", "primaria"),
    "ms-bitlocker": ("BitLocker: visión general", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/security/operating-system-security/data-protection/bitlocker/", "primaria"),
    "ms-hvci": ("Integridad de memoria (HVCI) y seguridad basada en virtualización", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/security/hardware-security/enable-virtualization-based-protection-of-code-integrity", "primaria"),
    "ms-secureboot": ("Vencimiento de los certificados de Secure Boot de 2011", "Microsoft Support", "https://support.microsoft.com/en-us/topic/windows-secure-boot-certificate-expiration-and-ca-updates-7ff40d33-95dc-4c3c-8725-a9b95457578e", "primaria"),
    "ms-tamper": ("Protección contra manipulación de Defender", "Microsoft Learn", "https://learn.microsoft.com/en-us/defender-endpoint/manage-tamper-protection-intune", "primaria"),
    "ms-appcontrol": ("App Control for Business (antes WDAC)", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/appcontrol", "primaria"),
    "ms-script": ("App Control: aplicación de reglas a scripts y PowerShell", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/security/application-security/application-control/app-control-for-business/design/script-enforcement", "primaria"),
    "ms-autopatch": ("Windows Autopatch: requisitos", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/deployment/windows-autopatch/prepare/windows-autopatch-prerequisites", "primaria"),
    "ms-autopilot": ("Perfiles de implementación de Windows Autopilot", "Microsoft Learn", "https://learn.microsoft.com/en-us/autopilot/profiles", "primaria"),
    "ms-autopilot-reset": ("Autopilot Reset", "Microsoft Learn", "https://learn.microsoft.com/en-us/autopilot/tutorial/reset/autopilot-reset-overview", "primaria"),
    "ms-dfci": ("DFCI: administrar el firmware desde Intune", "Microsoft Learn", "https://learn.microsoft.com/en-us/intune/device-configuration/templates/configure-dfci-windows", "primaria"),
    "ms-ife": ("Qué es Intune for Education", "Microsoft Learn", "https://learn.microsoft.com/en-us/intune-education/what-is-intune-for-education", "primaria"),
    "ms-ife-news": ("Intune for Education: novedades (bloquear apps administrativas)", "Microsoft Learn", "https://learn.microsoft.com/en-us/intune-education/whats-new-in-edu", "primaria"),
    "ms-intune-lic": ("Licencias de Microsoft Intune", "Microsoft Learn", "https://learn.microsoft.com/en-us/intune/fundamentals/licensing", "primaria"),
    "ms-takeatest": ("Take a Test en Windows", "Microsoft Learn", "https://learn.microsoft.com/en-us/education/windows/take-tests-in-windows", "primaria"),
    "ms-store": ("Apps de Microsoft Store en Intune", "Microsoft Learn", "https://learn.microsoft.com/en-us/intune/app-management/deployment/add-microsoft-store", "primaria"),
    "ms-shared": ("Equipos compartidos (Shared PC)", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/configuration/shared-pc/shared-devices-concepts", "primaria"),
    "ms-edge-url": ("Política URLBlocklist de Microsoft Edge", "Microsoft Learn", "https://learn.microsoft.com/en-us/deployedge/microsoft-edge-browser-policies/urlblocklist", "primaria"),
    "ms-edge-inprivate": ("Política InPrivateModeAvailability de Edge", "Microsoft Learn", "https://learn.microsoft.com/en-us/deployedge/microsoft-edge-browser-policies/inprivatemodeavailability", "primaria"),
    "ms-edge-yt": ("Política ForceYouTubeRestrict de Edge", "Microsoft Learn", "https://learn.microsoft.com/en-us/deployedge/microsoft-edge-browser-policies/forceyoutuberestrict", "primaria"),
    "ms-edge-perfiles": ("Política BrowserAddProfileEnabled de Edge", "Microsoft Learn", "https://learn.microsoft.com/en-us/deployedge/microsoft-edge-browser-policies/browseraddprofileenabled", "primaria"),
    "ms-edge-pol": ("Catálogo de políticas de Microsoft Edge", "Microsoft Learn", "https://learn.microsoft.com/en-us/deployedge/microsoft-edge-policies", "primaria"),
    "ms-wcf": ("Web Content Filtering de Defender for Endpoint", "Microsoft Learn", "https://learn.microsoft.com/en-us/defender-endpoint/web-content-filtering", "primaria"),
    "ms-netprot": ("Network Protection", "Microsoft Learn", "https://learn.microsoft.com/en-us/defender-endpoint/network-protection", "primaria"),
    "ms-mde-p1": ("Defender for Endpoint Plan 1 incluido en M365 E3/A3", "Microsoft Tech Community", "https://techcommunity.microsoft.com/blog/microsoftdefenderatpblog/microsoft-defender-for-endpoint-plan-1-now-included-in-m365-e3a3-licenses/3060639", "primaria"),
    "ms-p1": ("Defender for Endpoint Plan 1: funciones", "Microsoft Learn", "https://learn.microsoft.com/en-us/defender-endpoint/defender-endpoint-plan-1", "primaria"),
    "ms-learningzone": ("Centro de mensajes MC1187396 (Learning Zone)", "Microsoft 365 Message Center, vía mc.merill.net", "https://mc.merill.net/message/MC1187396", "primaria"),
    "ms-insights": ("Insights en Microsoft Teams for Education", "Microsoft Support", "https://support.microsoft.com/en-us/topic/educator-s-guide-to-insights-in-microsoft-teams-27b56255-90c0-47aa-bac3-1c9f50157181", "primaria"),
    "ms-entra-lic": ("Licencias de Microsoft 365 Education", "Microsoft Learn", "https://learn.microsoft.com/en-us/microsoft-365/education/guide/0-start/all-license", "primaria"),
    "ms-entra-sms": ("Retiro de SMS y voz como métodos de MFA en Entra ID", "Microsoft Learn", "https://learn.microsoft.com/en-us/entra/identity/authentication/concept-sms-voice-retirement", "primaria"),
    "ms-federated": ("Inicio de sesión federado en Windows (Google, Clever)", "Microsoft Learn", "https://learn.microsoft.com/en-us/education/windows/federated-sign-in", "primaria"),
    "ms-accounts": ("Policy CSP: Accounts (cuentas Microsoft personales)", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/client-management/mdm/policy-csp-accounts", "primaria"),
    "ms-familysafety": ("¿Family Safety funciona en equipos Intune con cuenta escolar?", "Microsoft Q&A", "https://learn.microsoft.com/en-us/answers/questions/5428165/can-microsoft-family-safety-be-enabled-on-an-intun", "comunidad"),
    "ms-licencias": ("Licenciamiento de Microsoft 365 Education", "Microsoft", "https://www.microsoft.com/en-us/licensing/product-licensing/microsoft-365-education", "primaria"),
    "ms-a1plus": ("Retiro de Office 365 A1 Plus", "Microsoft", "https://www.microsoft.com/en-us/education/products/office-365-a1-plus", "primaria"),
    "ms-diag": ("Datos de diagnóstico de Windows en la organización", "Microsoft Learn", "https://learn.microsoft.com/en-us/windows/privacy/configure-windows-diagnostic-data-in-your-organization", "primaria"),
    "ms-laps": ("Windows LAPS", "Microsoft Learn", "https://learn.microsoft.com/en-us/intune/device-security/laps/overview", "primaria"),
    # ── Apple ──
    "ap-boot": ("Proceso de arranque de iPhone y iPad", "Apple Platform Security", "https://support.apple.com/guide/security/boot-process-for-iphone-and-ipad-devices-secb3000f149/web", "primaria"),
    "ap-enclave": ("Secure Enclave", "Apple Platform Security", "https://support.apple.com/guide/security/secure-enclave-sec59b0b31ff/web", "primaria"),
    "ap-datos": ("Protección de datos (cifrado por archivo)", "Apple Platform Security", "https://support.apple.com/guide/security/data-protection-overview-secf6276da8a/web", "primaria"),
    "ap-sandbox": ("Seguridad de procesos en ejecución (sandbox)", "Apple Platform Security", "https://support.apple.com/guide/security/security-of-runtime-process-sec15bfe098e/web", "primaria"),
    "ap-firma": ("Firma de código de apps", "Apple Platform Security", "https://support.apple.com/guide/security/app-code-signing-process-sec7c917bf14/web", "primaria"),
    "ap-updates": ("Instalar y forzar actualizaciones de software", "Apple Platform Deployment", "https://support.apple.com/guide/deployment/install-and-enforce-software-updates-depd30715cbb/web", "primaria"),
    "ap-26": ("Novedades de gestión en iOS y iPadOS 26", "Apple Support", "https://support.apple.com/en-us/125073", "primaria"),
    "ap-supervision": ("Acerca de la supervisión de dispositivos Apple", "Apple Platform Deployment", "https://support.apple.com/guide/deployment/about-apple-device-supervision-dep1d89f0bff/web", "primaria"),
    "ap-ade": ("Inscripción automática de dispositivos (ADE)", "Apple Platform Deployment", "https://support.apple.com/guide/deployment/automated-device-enrollment-management-dep73069dd57/web", "primaria"),
    "ap-restricciones": ("Restricciones para iPhone y iPad", "Apple Platform Deployment", "https://support.apple.com/guide/deployment/restrictions-for-iphone-and-ipad-dep0f7dd3d8/web", "primaria"),
    "ap-restr-dev": ("Payload Restrictions (referencia de MDM)", "Apple Developer", "https://developer.apple.com/documentation/devicemanagement/restrictions", "primaria"),
    "ap-vpp": ("Compra de apps y libros en educación", "Apple", "https://support.apple.com/guide/deployment-education/app-and-book-purchases-edub2bcccc1f/web", "primaria"),
    "ap-wcf": ("Payload WebContentFilter (filtro nativo)", "Apple Developer", "https://developer.apple.com/documentation/devicemanagement/webcontentfilter", "primaria"),
    "ap-wcf-payload": ("Ajustes del filtro de contenido web", "Apple Platform Deployment", "https://support.apple.com/guide/deployment/web-content-filter-payload-settings-depc77c9609/web", "primaria"),
    "ap-tn3134": ("TN3134: despliegue de extensiones de red (filtros de terceros)", "Apple Developer", "https://developer.apple.com/documentation/technotes/tn3134-network-extension-provider-deployment", "primaria"),
    "ap-guias": ("Guías de revisión del App Store (2.5.6, WebKit)", "Apple Developer", "https://developer.apple.com/app-store/review/guidelines/", "primaria"),
    "ap-safari": ("Configuración declarativa de Safari", "Apple Developer", "https://developer.apple.com/documentation/devicemanagement/safarisettings", "primaria"),
    "ap-dns": ("Payload DNSSettings", "Apple Developer", "https://developer.apple.com/documentation/devicemanagement/dnssettings", "primaria"),
    "ap-classroom-req": ("Requisitos de clases en Apple Classroom", "Apple", "https://support.apple.com/guide/deployment-education/requirements-classes-synced-apple-school-edud491bf924/web", "primaria"),
    "ap-wwdc26": ("WWDC26 · Novedades en gestión de dispositivos Apple", "Apple Developer", "https://developer.apple.com/videos/play/wwdc2026/206/", "primaria"),
    "ap-classroom": ("Guía de Classroom: ver pantallas", "Apple Support", "https://support.apple.com/en-au/guide/classroom/cla6d39b9338/web", "primaria"),
    "ap-schoolwork": ("Schoolwork", "Apple Support", "https://support.apple.com/en-us/102890", "primaria"),
    "ap-perdido": ("Modo Perdido administrado y borrado remoto", "Apple Platform Security", "https://support.apple.com/guide/security/managed-lost-mode-and-remote-wipe-secc46f3562c/web", "primaria"),
    "ap-activacion": ("Bloqueo de activación en equipos de la organización", "Apple Platform Deployment", "https://support.apple.com/guide/deployment/activation-lock-depf4ab94ef1/web", "primaria"),
    "ap-cuentas": ("Managed Apple Accounts: acceso a servicios", "Apple Platform Deployment", "https://support.apple.com/guide/deployment/service-access-with-managed-apple-ids-depdc4ba8d82/web", "primaria"),
    "ap-federacion": ("Federación de Apple School Manager con Google Workspace", "Apple Support", "https://support.apple.com/guide/apple-school-manager/federated-authentication-google-workspace-axmaef1a0154/web", "primaria"),
    "ap-solo-inst": ("Apple School Manager: inicio de sesión solo con cuentas institucionales", "Apple Education", "https://education.apple.com/story/250014751", "primaria"),
    "ap-shared": ("Shared iPad", "Apple Platform Deployment", "https://support.apple.com/guide/deployment/shared-ipad-overview-dep9a34c2ba2/web", "primaria"),
    "ap-business": ("Presentación de Apple Business (abril de 2026)", "Apple Newsroom", "https://www.apple.com/newsroom/2026/03/introducing-apple-business-a-new-all-in-one-platform-for-businesses-of-all-sizes/", "primaria"),
    "ap-asm": ("Introducción a Apple School Manager", "Apple Support", "https://support.apple.com/guide/apple-school-manager/intro-to-apple-school-manager-axm7909096bf/web", "primaria"),
    "ap-privacidad": ("Datos y privacidad: visión general para escuelas", "Apple", "https://www.apple.com/education/docs/Data_and_Privacy_Overview_for_Schools.pdf", "primaria"),
    "mosyle": ("Precios de Mosyle para escuelas", "Mosyle", "https://school.mosyle.com/pricing", "primaria"),
    "jamf": ("Precios educativos de Jamf", "Jamf", "https://www.jamf.com/pricing/education-pricing/", "primaria"),
    # ── Google ──
    "g-verified": ("Verified Boot (documento de diseño)", "Chromium Project", "https://www.chromium.org/chromium-os/chromiumos-design-docs/verified-boot/", "primaria"),
    "g-seguridad": ("Seguridad de ChromeOS", "Google", "https://chromeos.google/resources/security/", "primaria"),
    "g-cifrado": ("Protección de datos de usuario en caché", "Chromium Project", "https://www.chromium.org/chromium-os/chromiumos-design-docs/protecting-cached-user-data/", "primaria"),
    "g-aue": ("Política de actualizaciones automáticas (AUE)", "Google Support", "https://support.google.com/chrome/a/answer/6220366?hl=en", "primaria"),
    "g-googlebook": ("Anuncio de Googlebook y futuro de ChromeOS (23-sep-2026)", "Google Support", "https://support.google.com/chrome/a/answer/16634428?hl=en", "primaria"),
    "g-atredis": ("Análisis competitivo de ChromeOS (encargado por Google)", "Atredis Partners", "https://static1.squarespace.com/static/576323cfd482e984e113fe9c/t/65fb62162a8fa265a0fc09bf/1710973468814/Atredis-Partners-Google-ChromeOS-Competitive-Analysis.pdf", "academica"),
    "g-ceu": ("Chrome Education Upgrade: ficha", "Google for Education", "https://services.google.com/fh/files/newsletters/chrome_education_upgrade_one_pager.pdf", "primaria"),
    "g-ceu-compra": ("Comprar licencias de upgrade de ChromeOS", "Google Support", "https://support.google.com/chrome/a/answer/7613771", "primaria"),
    "g-inscribir": ("Inscribir dispositivos ChromeOS", "Google Support", "https://support.google.com/chrome/a/answer/1360534?hl=en", "primaria"),
    "g-reinscripcion": ("Reinscripción forzada tras un borrado", "Google Support", "https://support.google.com/chrome/a/answer/6352858?hl=en", "primaria"),
    "g-devmode": ("Política DeviceBlockDevmode", "Chrome Enterprise", "https://chromeenterprise.google/intl/en_uk/policies/device-block-devmode/", "primaria"),
    "g-pol-disp": ("Políticas de dispositivo ChromeOS", "Google Support", "https://support.google.com/chrome/a/answer/1375678?hl=en", "primaria"),
    "g-desactivar": ("Desactivar o desaprovisionar dispositivos", "Google Support", "https://support.google.com/chrome/a/answer/3523633?hl=en", "primaria"),
    "g-pol-usr": ("Políticas de usuario de Chrome", "Google Support", "https://support.google.com/chrome/a/answer/2657289?hl=en", "primaria"),
    "g-safebrowsing": ("Política SafeBrowsingProtectionLevel", "Chrome Enterprise", "https://chromeenterprise.google/intl/en_ca/policies/safe-browsing-protection-level/", "primaria"),
    "g-doh": ("Política DnsOverHttpsMode", "Chrome Enterprise", "https://chromeenterprise.google/policies/dns-over-https-mode/", "primaria"),
    "g-ext": ("Administrar extensiones y apps", "Google Support", "https://support.google.com/chrome/a/answer/6177431?hl=en", "primaria"),
    "g-android": ("Apps de Android en ChromeOS administrado", "Google Support", "https://support.google.com/chrome/a/answer/7131624?hl=en", "primaria"),
    "g-linux": ("Política VirtualMachinesAllowed (Linux)", "Chrome Enterprise", "https://chromeenterprise.google/policies/virtual-machines-allowed/", "primaria"),
    "g-cuentas": ("Política AllowedDomainsForApps (cuentas secundarias)", "Chrome Enterprise", "https://chromeenterprise.google/policies/allowed-domains-for-apps/", "primaria"),
    "g-saml": ("SSO con SAML en ChromeOS", "Google Support", "https://support.google.com/chrome/a/answer/12103994?hl=en", "primaria"),
    "g-ediciones": ("Comparar ediciones de Workspace for Education", "Google for Education", "https://edu.google.com/workspace-for-education/editions/compare-editions/", "primaria"),
    "g-privacidad": ("Privacidad y seguridad: preguntas frecuentes", "Google for Education", "https://edu.google.com/intl/ALL_us/our-values/privacy-security/frequently-asked-questions/", "primaria"),
    "g-edad": ("Controlar el acceso a servicios de Google por edad", "Google Workspace", "https://knowledge.workspace.google.com/admin/getting-started/editions/control-access-to-google-services-by-age", "primaria"),
    "g-classtools": ("Class Tools en Chromebook", "Google Support", "https://support.google.com/chrome/a/answer/16178588?hl=en", "primaria"),
    "g-classtools-req": ("Requisitos de Class Tools", "Google Support", "https://support.google.com/chrome/a/answer/16058433?hl=en", "primaria"),
    "g-classtools-priv": ("Class Tools: privacidad de funciones opcionales", "Google Support", "https://support.google.com/chrome/a/answer/16178392?hl=en", "primaria"),
    "g-iste": ("Chromebook en ISTE 2025", "Blog de Google", "https://blog.google/products-and-platforms/products/education/chromebook-iste-2025/", "primaria"),
    "g-precios": ("Precios y licencias de Workspace for Education", "Google Workspace", "https://knowledge.workspace.google.com/admin/getting-started/editions/google-workspace-for-education-pricing-and-licensing", "primaria"),
    "g-gemini": ("Activar o desactivar la app Gemini (Education)", "Google Workspace", "https://knowledge.workspace.google.com/admin/gemini/turn-the-gemini-app-on-or-off?co=DASHER._Family=Education&hl=en", "primaria"),
    "g-gemini-edu": ("Gemini for Education", "Google for Education", "https://edu.google.com/intl/ALL_us/ai/gemini-for-education/", "primaria"),
    "g-forms": ("Modo bloqueado de Google Forms", "Google Support", "https://support.google.com/docs/answer/7634943?hl=en", "primaria"),
    "parallels": ("Fin de soporte de Parallels Desktop for ChromeOS", "Parallels", "https://kb.parallels.com/en/130939", "primaria"),
    "sh1mmer": ("SH1MMER: exploit que desinscribía Chromebooks (2023)", "BleepingComputer", "https://www.bleepingcomputer.com/news/security/new-sh1mmer-chromebook-exploit-unenrolls-managed-devices/", "prensa"),
    # ── Securly ──
    "s-comparativa": ("Securly Filtering: comparación de soluciones y compatibilidad", "Securly Support", "https://support.securly.com/hc/en-us/articles/14387613870231-Filter-Securly-Filtering-Solutions-Comparison-and-Compatibility", "primaria"),
    "s-metodo": ("Cómo elegir el método de filtrado", "Securly Support", "https://support.securly.com/hc/en-us/articles/33474972845847-Filter-Securly-Filtering-How-to-choose-the-right-filtering-method", "primaria"),
    "s-extension": ("Cómo funciona la extensión de Securly", "Securly Support", "https://support.securly.com/hc/en-us/articles/360001053407-Filter-How-does-Securly-s-extension-work", "primaria"),
    "s-taskmgr": ("Evitar que el alumno desactive la extensión en Chromebook", "Securly Support", "https://support.securly.com/hc/en-us/articles/360023905973-Filter-How-to-stop-students-from-disabling-the-Securly-extension-on-Chromebooks", "primaria"),
    "s-dns": ("Protección reforzada contra bypass de DNS", "Securly Support", "https://support.securly.com/hc/en-us/articles/38847438046103-Filter-Enabling-Enhanced-DNS-Bypass-Protection-for-Chromebooks", "primaria"),
    "s-ipad": ("Securly Filter para iPad (SmartPAC)", "Securly", "https://www.securly.com/site/assets/pdf/iPad-Filter.pdf", "primaria"),
    "ap-proxy": ("Payload Global HTTP Proxy: requiere supervisión", "Apple (repositorio device-management)", "https://github.com/apple/device-management/blob/release/mdm/profiles/com.apple.proxy.http.global.yaml", "primaria"),
    "s-cert": ("Desplegar el certificado SSL de Securly en iOS", "Securly Support", "https://support.securly.com/hc/en-us/articles/206978437-Filter-How-to-deploy-Securly-SSL-certificate-to-iOS", "primaria"),
    "s-pinning": ("Por qué algunas apps fallan en iPad", "Securly Support", "https://support.securly.com/hc/en-us/articles/33455301790615-Filter-Why-do-some-applications-break-on-iPads-or-Tablets", "primaria"),
    "s-aware-best": ("Aware: buenas prácticas de configuración", "Securly Support", "https://support.securly.com/hc/en-us/articles/115004837048-Aware-Best-Practices-for-Aware-setup", "primaria"),
    "s-youtube": ("Administrar el acceso a YouTube", "Securly Support", "https://support.securly.com/hc/en-us/articles/360050706514-Filter-How-do-I-manage-access-to-YouTube", "primaria"),
    "s-userinj": ("SmartPAC: inyección de usuario desde el MDM", "Securly Support", "https://support.securly.com/hc/en-us/articles/360041375734-Filter-How-do-I-configure-SmartPAC-user-injection", "primaria"),
    "s-applog": ("Por qué los padres no ven actividad de apps", "Securly Support", "https://support.securly.com/hc/en-us/articles/360009718733-Home-Why-can-t-parents-see-any-app-activity-in-the-activity-log", "primaria"),
    "s-classroom": ("Securly Classroom", "Securly", "https://www.securly.com/classroom", "primaria"),
    "s-classroom-tareas": ("Classroom: qué hacer si un alumno está fuera de la tarea", "Securly Support", "https://support.securly.com/hc/en-us/articles/7308774532119-Classroom-What-to-do-when-a-student-is-off-task", "primaria"),
    "s-classroom-limite": ("Por qué Classroom no ve toda la actividad del Chromebook", "Securly Support", "https://support.securly.com/hc/en-us/articles/35325612002583-Why-can-t-Securly-Classroom-monitor-all-Chromebook-activities-and-how-can-I-manage-this-limitation", "primaria"),
    "s-classroom-win": ("Securly Classroom en Windows (agente)", "Securly Support", "https://support.securly.com/hc/en-us/articles/4414796485271-Classroom-How-do-I-use-Securly-Classroom-with-Windows-devices", "primaria"),
    "s-mdm": ("Securly MDM: ficha de producto", "Securly", "https://www.securly.com/site/assets/product-briefs/mdm.pdf", "primaria"),
    "s-teachertools": ("Securly Teacher Tools en el App Store", "Apple App Store", "https://apps.apple.com/us/app/securly-teacher-tools/id1072154023", "primaria"),
    "s-aware": ("Aware: funciones incluidas y complementos", "Securly Support", "https://support.securly.com/hc/en-us/articles/8889578014743-Aware-Which-features-are-part-of-Aware-s-subscription-and-which-are-available-as-add-ons", "primaria"),
    "s-aichat": ("Securly AI Chat", "Securly", "https://www.securly.com/aichat", "primaria"),
    "s-pausa": ("Pausa de internet en equipos escolares (Home)", "Securly Support", "https://support.securly.com/hc/en-us/articles/360014103214-Home-How-do-I-start-using-pause-internet-on-school-owned-devices", "primaria"),
    "s-reveal": ("Reveal: preguntas frecuentes", "Securly Support", "https://support.securly.com/hc/en-us/articles/17625787538071-Reveal-Reveal-FAQs", "primaria"),
    "s-privmode": ("Aware: modo de privacidad reforzada", "Securly Support", "https://support.securly.com/hc/en-us/articles/11977538811799-Aware-What-is-Enhanced-Privacy-Mode", "primaria"),
    "s-confianza": ("Confianza y seguridad (certificaciones)", "Securly", "https://www.securly.com/trust-and-safety", "primaria"),
    "s-privacidad": ("Política de privacidad de Securly (19-ene-2026)", "Securly", "https://www.securly.com/privacy", "primaria"),
    "s-inicio": ("Sitio de Securly (cifras del proveedor)", "Securly", "https://www.securly.com/", "primaria"),
    "s-revendedor": ("Securly Filter Premium: precio de lista de un revendedor de EE. UU.", "Genesis Technologies", "https://www.genesis-technologies.com/products/securly-filter-premium-1-year-subscription-license", "revendedor"),
    "jamf-2017": ("Apps que fallan con el proxy global de Securly en iOS", "Jamf Nation", "https://community.jamf.com/t5/jamf-pro/securly-filtering-global-proxy-ios-app-problems/m-p/212320", "comunidad"),
    "jamf-ipados15": ("iPadOS 15 incompatible con Securly (2021)", "Jamf Nation", "https://community.jamf.com/t5/jamf-pro/ipados15-not-compatible-with-securly/m-p/247208", "comunidad"),
    "k12dive": ("Demanda colectiva de padres de California contra Securly (2023)", "K-12 Dive", "https://www.k12dive.com/news/california-parents-class-action-lawsuit-securly/688615/", "prensa"),
    # ── Privacidad y regulación ──
    "ferpa": ("Privacidad estudiantil y servicios educativos en línea (FERPA)", "U.S. Department of Education", "https://studentprivacy.ed.gov/sites/default/files/resource_document/file/Student%20Privacy%20and%20Online%20Educational%20Services%20(February%202014)_0.pdf", "primaria"),
    "coppa": ("COPPA Rule (reforma 2025)", "Federal Trade Commission", "https://www.ftc.gov/legal-library/browse/rules/childrens-online-privacy-protection-rule-coppa", "primaria"),
    "cipa": ("Children's Internet Protection Act (CIPA)", "FCC", "https://www.fcc.gov/consumers/guides/childrens-internet-protection-act", "primaria"),
    "pledge": ("Student Privacy Pledge (retirado el 25-abr-2025)", "Future of Privacy Forum", "https://fpf.org/student-privacy-pledge/", "primaria"),
    "gdpr": ("RGPD, artículo 8: consentimiento de menores", "gdpr-info.eu", "https://gdpr-info.eu/art-8-gdpr/", "primaria"),
    "ico": ("Children's Code y tecnología educativa", "ICO (Reino Unido)", "https://ico.org.uk/for-organisations/uk-gdpr-guidance-and-resources/childrens-information/childrens-code-guidance-and-resources/the-children-s-code-and-education-technologies-edtech/", "primaria"),
    "lfpdppp": ("Ley Federal de Protección de Datos Personales en Posesión de los Particulares (DOF 20-mar-2025)", "Cámara de Diputados", "https://www.diputados.gob.mx/LeyesBiblio/pdf/LFPDPPP.pdf", "primaria"),
    "reglamento": ("Reglamento de la LFPDPPP (2011, vigencia incierta)", "Cámara de Diputados", "https://www.diputados.gob.mx/LeyesBiblio/regley/Reg_LFPDPPP.pdf", "primaria"),
    "lgdnna": ("Ley General de los Derechos de Niñas, Niños y Adolescentes", "Cámara de Diputados", "https://www.diputados.gob.mx/LeyesBiblio/pdf/LGDNNA.pdf", "primaria"),
    "dk": ("Datatilsynet: crítica a 51 municipios en el caso Chromebook (ene-2026)", "Datatilsynet (Dinamarca)", "https://www.datatilsynet.dk/afgoerelser/afgoerelser/2026/jan/datatilsynet-giver-51-kommuner-alvorlig-kritik-i-chromebook-sag", "primaria"),
    "nl-google": ("Verificación: riesgos altos de Google Workspace for Education resueltos", "Privacy Company (para SURF/SIVON)", "https://www.privacycompany.eu/blog/verification-research-google-workspace-for-education-known-high-risks-resolved", "academica"),
    "nl-copilot": ("DPIA de Microsoft 365 Copilot (2.ª actualización, may-2026)", "SURF", "https://vendorcompliance.surf.nl/wp-content/uploads/2026/05/20260527-SURF-2nd-Update-DPIA-Microsoft-365-Copilot-public-version.pdf", "academica"),
    "nl-jamf": ("DPIA central de Jamf School (mar-2025)", "SIVON", "https://sivon.nl/2025/03/dpia-jamf-school/", "academica"),
    "de-hessen": ("Microsoft 365 puede usarse conforme a la ley (nov-2025)", "HBDI (Hesse, Alemania)", "https://datenschutz.hessen.de/presse/hbdi-microsoft-365-kann-datenschutzkonform-genutzt-werden", "primaria"),
    "at-noyb": ("Microsoft 365 Education rastrea a alumnos: resolución de la DSB (oct-2025)", "noyb", "https://noyb.eu/en/noyb-win-microsoft-365-education-tracks-school-children", "prensa"),
    "es-aepd": ("Sanción a un colegio privado por Google Workspace for Education", "ECIJA (despacho)", "https://www.ecija.com/en/news-and-insights/sancion-por-el-uso-de-google-workspace-for-education-a-un-centro-educativo/", "prensa"),
    "warren": ("Investigación Warren-Markey sobre vigilancia estudiantil (2022)", "Senado de EE. UU.", "https://www.warren.senate.gov/oversight/reports/warren-markey-investigation-finds-that-edtech-student-surveillance-platforms-need-urgent-federal-action-to-protect-students", "primaria"),
    "g-terminos": ("Aviso de privacidad de Google Workspace for Education", "Google", "https://workspace.google.com/terms/education_privacy.html", "primaria"),
    "cdt": ("Off Task: amenazas de la edtech a la privacidad y la equidad (2023)", "Center for Democracy & Technology", "https://cdt.org/insights/report-off-task-edtech-threats-to-student-privacy-and-equity-in-the-age-of-ai/", "academica"),
    "markup": ("Escuelas que solo querían bloquear pornografía y censuraron tareas (2024)", "The Markup", "https://themarkup.org/digital-book-banning/2024/04/13/schools-were-just-supposed-to-block-porn-instead-they-sabotaged-homework-and-censored-suicide-prevention-sites", "prensa"),
    "uso-resp": ("Uso responsable de la tecnología: el acuerdo de la SEP sobre celulares", "activa", "https://sanoapro.github.io/activa/paginas/uso-responsable/", "primaria"),
}

# ════════════════════════════════════════════════════════════════════
# TABLA 1 · COMPARACIÓN GENERAL
# fila: (área, aspecto, [fuentes], {esc: (puntos, justificación)})
# ════════════════════════════════════════════════════════════════════
AREAS = [
    ("so", "Seguridad del sistema operativo"),
    ("admin", "Administración centralizada"),
    ("nav", "Control del navegador"),
    ("filtro", "Filtrado de internet"),
    ("apps", "Control de aplicaciones"),
    ("aula", "Control del profesor"),
    ("fuera", "Fuera del colegio"),
    ("id", "Identidad y cuentas"),
    ("priv", "Privacidad del alumno"),
]

T1 = [
    ("so", "Arranque, cifrado y aislamiento", ["ms-ediciones", "ms-hvci", "ms-bitlocker", "ms-secureboot", "ap-boot", "ap-datos", "g-verified", "g-cifrado"], {
        "w": (4, "TPM 2.0, Secure Boot, integridad de memoria (HVCI) y BitLocker automático. Los certificados de Secure Boot de 2011 vencen en 2026 y hay que renovarlos."),
        "i": (5, "Cadena de arranque verificada desde la Boot ROM, Secure Enclave y cifrado por archivo, todo activo de fábrica."),
        "c": (5, "Verified Boot en cada arranque, sistema de solo lectura y cifrado por usuario obligatorio, ligado al TPM."),
        "s": (5, "Igual que el iPad: Securly no toca el sistema operativo."),
    }),
    ("so", "Malware y ransomware", ["ms-tamper", "ms-appcontrol", "ap-firma", "ap-sandbox", "g-seguridad", "g-atredis"], {
        "w": (3, "Defender viene incluido y protegido contra manipulación. Pero por diseño corre cualquier .exe hasta que el antivirus lo detecta."),
        "i": (5, "Solo corre código firmado por Apple, cada app en su sandbox, y en México no hay instalación fuera del App Store."),
        "c": (5, "No ejecuta .exe y todo corre en sandbox. Google afirma cero ransomware exitoso registrado (dato del fabricante)."),
        "s": (5, "Igual que el iPad."),
    }),
    ("so", "Actualizaciones y ciclo de vida", ["ms-se", "ms-esu", "ms-autopatch", "ap-updates", "g-aue", "g-googlebook"], {
        "w": (3, "Autopatch exige A3/A5. Windows 10 quedó sin soporte en oct-2025 y Windows 11 SE termina en oct-2026: hay flotas por migrar."),
        "i": (5, "El MDM fuerza versión y fecha límite mediante gestión declarativa."),
        "c": (4, "Automáticas cada 4 semanas, con 10 años por modelo. Google anunció que ChromeOS se mantiene hasta mediados de 2034 y evoluciona a Googlebook OS."),
        "s": (5, "Igual que el iPad."),
    }),
    ("admin", "Consola, grupos e inscripción", ["ms-ife", "ms-autopilot", "ap-ade", "ap-asm", "g-inscribir", "g-pol-disp"], {
        "w": (4, "Intune con Autopilot es muy completo, pero exige especialización. Políticas por usuario, grupo y equipo."),
        "i": (4, "Apple School Manager más un MDM de terceros: Apple no ofrece MDM escolar propio."),
        "c": (5, "Google Admin con Chrome Education Upgrade: políticas por usuario, unidad organizativa y equipo en una sola consola."),
        "s": (4, "Las piezas del iPad más la consola de Securly: tres consolas en total."),
    }),
    ("admin", "Bloqueo, borrado e inventario remotos", ["ms-ife", "ap-perdido", "g-desactivar"], {
        "w": (5, "Bloqueo, borrado, Autopilot Reset e inventario desde Intune."),
        "i": (5, "Modo Perdido administrado (con ubicación aunque esté apagada) y borrado remoto."),
        "c": (5, "Desactivación remota con mensaje en pantalla, powerwash remoto e inventario."),
        "s": (5, "Igual que el iPad."),
    }),
    ("admin", "Que el alumno no pueda quitar la administración", ["ms-autopilot", "ms-dfci", "ap-ade", "g-reinscripcion", "g-devmode"], {
        "w": (4, "El alumno queda como usuario estándar y Autopilot reinscribe el equipo. El firmware solo se blinda con DFCI en algunos fabricantes."),
        "i": (5, "Un iPad supervisado con «Prevent unenrollment» no puede desinscribirse."),
        "c": (5, "La reinscripción forzada tras un borrado y el bloqueo del modo de desarrollador vienen por defecto con la licencia."),
        "s": (5, "Igual que el iPad. Además, SmartPAC exige supervisión."),
    }),
    ("nav", "Sitios, incógnito, historial y extensiones", ["ms-edge-url", "ms-edge-inprivate", "ap-safari", "g-pol-usr", "g-ext"], {
        "w": (4, "Edge controla listas (hasta 1,000), InPrivate, extensiones y descargas. Pero solo gobierna Edge."),
        "i": (3, "Safari permite bloquear la navegación privada desde iPadOS 26. Los navegadores de terceros tienen su propio incógnito, que no se controla."),
        "c": (5, "Chrome es el único navegador: incógnito, historial, extensiones y descargas por política."),
        "s": (4, "Lo del iPad, más el filtro de Securly sobre el tráfico web de cualquier navegador."),
    }),
    ("nav", "Navegadores alternativos", ["ms-appcontrol", "ap-restricciones", "g-android"], {
        "w": (2, "Los navegadores portables se ejecutan salvo que haya una política de App Control."),
        "i": (4, "No pueden instalarse si el App Store está bloqueado."),
        "c": (5, "No hay otro navegador. Las apps de Android solo entran desde una lista permitida."),
        "s": (4, "Igual que el iPad."),
    }),
    ("filtro", "Filtro por categorías (adulto, apuestas, juegos, redes)", ["ms-wcf", "ms-mde-p1", "ap-wcf", "s-comparativa", "s-ipad", "s-pinning"], {
        "w": (3, "Web Content Filtering de Defender: unas 30 categorías, con Defender for Endpoint (incluido en M365 A3/A5). Fuera de Edge solo bloquea dominios completos."),
        "i": (2, "Filtro nativo: contenido adulto automático o «solo sitios específicos». Sin categorías, con coincidencia por texto y tope de 500 sitios."),
        "c": (5, "Securly por extensión: categorías y bloqueo de sitios sin categorizar, sin certificado ni inspección SSL."),
        "s": (4, "Securly SmartPAC: mismas políticas y categorías. Pero exige iPad supervisado y certificado SSL, y las apps con certificate pinning fallan."),
    }),
    ("filtro", "SafeSearch y YouTube", ["ms-edge-yt", "ap-wcf", "mosyle", "g-pol-usr", "s-youtube"], {
        "w": (4, "Edge fuerza SafeSearch y el modo restringido de YouTube (no aplica a perfiles con cuenta personal)."),
        "i": (2, "Apple no tiene forma nativa de forzar SafeSearch ni YouTube restringido; algunos MDM lo ofrecen."),
        "c": (5, "SafeSearch y YouTube restringido forzados por Google Admin, más control de canales y videos en Securly."),
        "s": (3, "Con SmartPAC, YouTube solo tiene modos de restricción: las listas de canales y videos no están disponibles."),
    }),
    ("filtro", "Historial, reportes y alertas", ["ms-wcf", "ap-wcf", "s-comparativa", "s-aware-best"], {
        "w": (3, "Reportes de Defender por categoría. Sin alertas de bienestar del alumno."),
        "i": (1, "El filtro nativo no genera historial, reportes ni alertas."),
        "c": (5, "Historial por alumno, escaneo de búsquedas, alertas de Aware y app para padres."),
        "s": (4, "Historial y alertas vía SmartPAC, sin las funciones que solo da la extensión (Think Twice, widget de bienestar)."),
    }),
    ("apps", "Instalación y tiendas", ["ms-store", "ap-restr-dev", "ap-vpp", "g-android", "g-ext"], {
        "w": (4, "La Store se bloquea por política y las apps se distribuyen desde Intune."),
        "i": (5, "App Store desactivable en iPad supervisado; las apps se instalan con Apps and Books."),
        "c": (5, "Play y Chrome Web Store solo con lista permitida; en dominios educativos no existe «permitir todo»."),
        "s": (5, "Igual que el iPad."),
    }),
    ("apps", "Software externo y sideloading", ["ms-appcontrol", "ap-restricciones", "g-linux", "g-devmode"], {
        "w": (2, "Corre todo el código salvo detección. Cerrarlo exige App Control, que es potente pero complejo de mantener."),
        "i": (5, "En México no hay instalación fuera del App Store."),
        "c": (5, "No ejecuta binarios externos. Linux y el modo de desarrollador se bloquean por política."),
        "s": (5, "Igual que el iPad."),
    }),
    ("aula", "Ver pantallas y pestañas", ["ms-learningzone", "ms-insights", "ap-classroom", "s-classroom-tareas", "g-classtools", "s-classroom"], {
        "w": (0, "Microsoft no ofrece una herramienta nativa para ver pantallas o pestañas: hace falta un tercero."),
        "i": (3, "Apple Classroom ve la pantalla y la app activa, pero no lista pestañas ni historial."),
        "c": (5, "Securly Classroom: miniaturas, pestañas abiertas, cerrar pestañas y prompts de IA. Google suma Class Tools (Education Plus)."),
        "s": (3, "Securly Classroom no existe para iPad: el profesor usa Apple Classroom, igual que sin Securly."),
    }),
    ("aula", "Bloquear, enviar páginas y limitar a sitios", ["ms-takeatest", "ap-classroom-req", "ap-wwdc26", "s-classroom-tareas", "s-mdm"], {
        "w": (1, "Solo Take a Test, para evaluaciones."),
        "i": (4, "Classroom abre apps y páginas y bloquea pantallas en el salón. iPadOS 27 agrega navegación guiada (anunciada en WWDC26)."),
        "c": (5, "Enviar URL, Site Lock, planes de acceso y bloqueo de pantalla, en segundos y por el profesor."),
        "s": (4, "Apple Classroom. Securly Teacher Tools (fijar sitio o app) solo si el MDM es el de Securly."),
    }),
    ("fuera", "Políticas y filtro en casa, hotspot o datos", ["ms-wcf", "ap-wcf", "g-pol-usr", "s-comparativa"], {
        "w": (3, "Las políticas de Intune viajan con el equipo; el filtro solo si hay Defender con Web Content Filtering."),
        "i": (3, "Las restricciones y el filtro nativo viajan con el equipo, pero sin categorías ni visibilidad."),
        "c": (5, "Las políticas de la cuenta y la extensión de Securly aplican en cualquier red, con política para casa y app para padres."),
        "s": (4, "SmartPAC filtra en cualquier red; los padres no ven actividad de apps que no sea web."),
    }),
    ("id", "Cuentas administradas, SSO y MFA", ["ms-entra-lic", "ms-federated", "ap-federacion", "g-saml", "g-ediciones"], {
        "w": (5, "Entra ID con MFA, passkeys y pase temporal sin teléfono; inicio federado con Google en ediciones Education."),
        "i": (4, "Managed Apple Accounts federadas con Google Workspace o Entra ID."),
        "c": (5, "Cuenta de Workspace con verificación en dos pasos y SSO por SAML."),
        "s": (4, "Igual que el iPad."),
    }),
    ("id", "Bloquear cuentas personales e invitado", ["ms-accounts", "ms-edge-perfiles", "ap-solo-inst", "ap-26", "g-pol-disp", "g-cuentas"], {
        "w": (4, "Políticas para impedir cuentas Microsoft personales y perfiles personales en Edge."),
        "i": (5, "Desde sep-2025, Apple School Manager limita el inicio de sesión a cuentas institucionales; iPadOS 26 cerró huecos."),
        "c": (5, "Inicio de sesión restringido al dominio, sin invitado y sin cuentas secundarias."),
        "s": (5, "Igual que el iPad."),
    }),
    ("priv", "Datos del alumno y publicidad", ["at-noyb", "ap-privacidad", "g-privacidad", "s-privacidad", "dk"], {
        "w": (3, "Compromiso de no usar datos educativos para publicidad. Austria resolvió en 2025 que M365 Education usó cookies de rastreo sin base legal."),
        "i": (5, "Apple no rastrea ni vende datos de alumnos, y Apple School Manager importa datos mínimos."),
        "c": (3, "Sin anuncios ni entrenamiento de IA en servicios principales. Securly agrega navegación, búsquedas, prompts y contenido de correo (Aware)."),
        "s": (3, "Al iPad se suma Securly, con la misma recolección que en Chromebook."),
    }),
    ("priv", "Residencia de datos en México", ["ms-licencias", "g-ediciones", "s-privacidad"], {
        "w": (4, "La única con opción de alojamiento en México: el complemento de residencia avanzada, por contrato educativo por volumen."),
        "i": (2, "Apple no publica región mexicana."),
        "c": (2, "Workspace solo ofrece EE. UU. o UE (Standard/Plus). Securly aloja en EE. UU."),
        "s": (2, "Apple y Securly sin región mexicana."),
    }),
]

# ════════════════════════════════════════════════════════════════════
# TABLA 2 · RESISTENCIA A EVASIÓN (defensiva: vector, causa y mitigación)
# ════════════════════════════════════════════════════════════════════
T2 = [
    ("VPN", "Sacar el tráfico del alcance del filtro.", "Toda plataforma permite VPN legítimas; el riesgo está en que el alumno instale o configure una.",
     ["ms-appcontrol", "ap-restricciones", "g-android", "s-comparativa"], {
        "w": ("dep", "App Control impide ejecutar clientes de VPN; sin él, corren."),
        "i": ("bloq", "Restricción «allowVPNCreation» (supervisado) y App Store bloqueada."),
        "c": ("bloq", "Solo se instalan las apps y extensiones de la lista permitida."),
        "s": ("bloq", "Como el iPad. Securly advierte que los navegadores con VPN integrada evaden SmartPAC: no permitirlos."),
    }),
    ("Sitios proxy web", "Páginas que abren otros sitios a través de ellas.", "Existen miles y cambian de dominio a diario.",
     ["ms-wcf", "ap-wcf", "s-comparativa"], {
        "w": ("dep", "Web Content Filtering los bloquea por categoría, solo con Defender for Endpoint."),
        "i": ("alto", "El filtro nativo no tiene categorías: solo lista blanca estricta."),
        "c": ("bajo", "Securly bloquea la categoría y los sitios sin categorizar."),
        "s": ("bajo", "Igual que en Chromebook, vía SmartPAC."),
    }),
    ("Navegador alternativo", "Usar otro navegador sin las políticas del principal.", "Las políticas de navegador solo gobiernan su propio navegador.",
     ["ms-edge-pol", "ms-appcontrol", "ap-restricciones", "g-android"], {
        "w": ("alto", "Las políticas de Edge no alcanzan a Chrome, Firefox o navegadores portables: bloquearlos con App Control."),
        "i": ("bloq", "Con el App Store bloqueado no se instalan."),
        "c": ("bajo", "Chrome es el único navegador del sistema."),
        "s": ("bloq", "Con el App Store bloqueado no se instalan; SmartPAC cubre de todos modos el tráfico web."),
    }),
    ("Incógnito y navegación privada", "Navegar sin historial.", "Es una función estándar de todo navegador.",
     ["ms-edge-inprivate", "ap-safari", "g-pol-usr"], {
        "w": ("bloq", "InPrivateModeAvailability (solo en Edge)."),
        "i": ("bloq", "allowSafariPrivateBrowsing desde iPadOS 26, en equipos supervisados."),
        "c": ("bloq", "Incógnito desactivado por política."),
        "s": ("bloq", "Igual que el iPad."),
    }),
    ("Extensiones", "Instalar complementos que alteran la navegación o desactivan el filtro.", "Los navegadores de escritorio admiten extensiones.",
     ["ms-edge-pol", "g-ext", "s-taskmgr"], {
        "w": ("bloq", "ExtensionInstallBlocklist y Forcelist en Edge."),
        "i": ("bajo", "Las extensiones de Safari solo llegan desde el App Store."),
        "c": ("bloq", "Lista permitida, y bloquear el Administrador de tareas para que nadie cierre la extensión de Securly."),
        "s": ("bajo", "Igual que el iPad."),
    }),
    ("Cambio de DNS o DNS cifrado", "Resolver nombres con un servicio distinto al del colegio.", "Los navegadores modernos traen DNS cifrado (DoH).",
     ["ms-edge-pol", "ms-ediciones", "ap-dns", "g-doh", "s-dns"], {
        "w": ("dep", "DnsOverHttpsMode en Edge; Zero Trust DNS solo en Windows Education con licencia A3/A5."),
        "i": ("bloq", "Perfil de DNS no removible y bloqueo de instalación de perfiles (supervisado)."),
        "c": ("bloq", "DnsOverHttpsMode y la protección reforzada contra bypass de DNS de Securly."),
        "s": ("bloq", "Igual que el iPad; SmartPAC no depende del DNS."),
    }),
    ("Hotspot, datos u otra red", "Salir de la red filtrada del colegio.", "El filtro de red solo existe dentro del colegio.",
     ["ms-wcf", "ap-wcf", "g-pol-usr", "ap-proxy"], {
        "w": ("dep", "Solo si el filtro vive en el equipo (Web Content Filtering); un firewall escolar no viaja."),
        "i": ("medio", "Las restricciones viajan, pero el filtro nativo es básico."),
        "c": ("bajo", "El filtro y las políticas viajan con la cuenta del alumno."),
        "s": ("dep", "SmartPAC filtra en cualquier red. Hay que apagar «Allow direct connection if PAC is unreachable»."),
    }),
    ("Cuenta personal", "Entrar con una cuenta propia sin políticas.", "Los sistemas de consumo aceptan cualquier cuenta.",
     ["ms-accounts", "ms-edge-perfiles", "ap-solo-inst", "g-pol-disp", "g-cuentas"], {
        "w": ("bloq", "Bloqueo de cuentas Microsoft personales y RestrictSigninToPattern en Edge."),
        "i": ("bloq", "Apple School Manager restringe a cuentas institucionales; allowAccountModification."),
        "c": ("bloq", "Restringir el inicio de sesión al dominio y bloquear cuentas secundarias."),
        "s": ("bloq", "Igual que el iPad."),
    }),
    ("Cuenta invitado", "Usar el equipo sin identificarse.", "El modo invitado existe para préstamos.",
     ["ms-shared", "ms-edge-pol", "ap-shared", "g-pol-disp"], {
        "w": ("bloq", "Desactivar invitado en Shared PC y BrowserGuestModeEnabled en Edge."),
        "i": ("bajo", "No hay invitado salvo que se configure Shared iPad."),
        "c": ("bloq", "Modo invitado deshabilitado por política de dispositivo."),
        "s": ("bajo", "Igual que el iPad."),
    }),
    ("USB y otro sistema operativo", "Arrancar o ejecutar desde una memoria externa.", "Las PC arrancan de USB por diseño.",
     ["ms-dfci", "ms-p1", "g-verified", "g-devmode", "sh1mmer", "ap-boot"], {
        "w": ("dep", "DFCI o contraseña de BIOS (DFCI solo en algunos fabricantes) y control de dispositivos de Defender."),
        "i": ("bajo", "No arranca otro sistema. Los modelos con chip A11 o anterior tienen una falla de arranque no parcheable: preferir modelos recientes."),
        "c": ("bloq", "Verified Boot y bloqueo del modo de desarrollador. Mantener ChromeOS al día: el exploit SH1MMER de 2023 se parchó en la versión 111."),
        "s": ("bajo", "Igual que el iPad."),
    }),
    ("Terminal, PowerShell o Linux", "Usar herramientas del sistema para cambiar la configuración.", "Los sistemas de escritorio traen consola.",
     ["ms-ife-news", "ms-script", "g-linux"], {
        "w": ("dep", "«Block administrative apps» de Intune for Education y App Control (PowerShell en modo restringido)."),
        "i": ("bajo", "No hay terminal para el usuario."),
        "c": ("bloq", "Linux viene apagado en equipos administrados y se bloquea por política."),
        "s": ("bajo", "Igual que el iPad."),
    }),
    ("Modo de desarrollador o administrador", "Obtener privilegios por encima de los del alumno.", "Existe para desarrolladores y soporte.",
     ["ms-autopilot", "ms-laps", "ap-restr-dev", "g-devmode"], {
        "w": ("dep", "El alumno como usuario estándar (Autopilot) y contraseña de administrador rotada con LAPS."),
        "i": ("bajo", "Exige emparejar con una computadora; allowHostPairing lo impide."),
        "c": ("bloq", "DeviceBlockDevmode."),
        "s": ("bajo", "Igual que el iPad."),
    }),
    ("Sideloading y apps externas", "Instalar software fuera de la tienda.", "Windows ejecuta cualquier programa por diseño.",
     ["ms-appcontrol", "ap-restricciones", "g-android"], {
        "w": ("alto", "Sin App Control corre cualquier .exe, incluso sin permisos de administrador."),
        "i": ("bajo", "No existe en México."),
        "c": ("bloq", "Solo apps de la lista permitida."),
        "s": ("bajo", "No existe en México."),
    }),
    ("Restablecimiento de fábrica", "Borrar el equipo para quitarle la configuración.", "Todo equipo debe poder restaurarse.",
     ["ms-autopilot", "ap-restr-dev", "ap-activacion", "g-reinscripcion"], {
        "w": ("bloq", "Autopilot reinscribe al equipo registrado."),
        "i": ("bloq", "Borrado bloqueado, Bloqueo de activación e inscripción automática al reiniciar."),
        "c": ("bloq", "Reinscripción forzada (Chrome Education Upgrade)."),
        "s": ("bloq", "Igual que el iPad."),
    }),
    ("Quitar la administración", "Eliminar el perfil o desinscribir el equipo.", "Los equipos sin supervisión permiten quitar perfiles.",
     ["ms-autopilot", "ap-ade", "g-reinscripcion", "ap-proxy"], {
        "w": ("dep", "Sin permisos de administrador local el alumno no puede desinscribir."),
        "i": ("bloq", "«Prevent unenrollment» en equipos supervisados."),
        "c": ("bloq", "Reinscripción forzada."),
        "s": ("bloq", "Igual que el iPad. Sin supervisión no hay SmartPAC."),
    }),
    ("Navegación dentro de apps", "Páginas abiertas dentro de una app y no del navegador.", "Muchas apps traen su propio visor web.",
     ["ms-wcf", "ap-wcf", "s-classroom-limite", "s-pinning", "g-android"], {
        "w": ("dep", "Web Content Filtering identifica navegadores por proceso; los visores web de otras apps quedan fuera."),
        "i": ("medio", "El filtro cubre el tráfico WebKit; lo que una app trae por su cuenta, no."),
        "c": ("medio", "Securly solo ve Chrome, y la lista de URLs no aplica a apps Android con WebView: limitar apps Android."),
        "s": ("medio", "SmartPAC cubre HTTP/HTTPS, pero las apps con certificate pinning se exentan y salen del filtro."),
    }),
    ("Mensajería y redes sociales", "Distracción y contacto no supervisado.", "Son apps y sitios de uso masivo.",
     ["ms-wcf", "ap-restricciones", "s-comparativa", "s-pinning"], {
        "w": ("dep", "Categorías de chat y redes en Web Content Filtering (con licencia)."),
        "i": ("medio", "Bloquear la instalación de apps; el web solo con lista blanca."),
        "c": ("bajo", "Categorías de Securly y apps solo de la lista permitida."),
        "s": ("medio", "Las apps nativas de redes fallan con SmartPAC: se bloquean o se exentan."),
    }),
    ("Juegos web, espejos y sitios nuevos", "Sitios no clasificados o copias de sitios bloqueados.", "Aparecen más rápido de lo que se clasifican.",
     ["ms-wcf", "ap-wcf", "s-comparativa"], {
        "w": ("dep", "Web Content Filtering incluye juegos y dominios recién registrados."),
        "i": ("alto", "Sin categorías: solo una lista blanca estricta los detiene."),
        "c": ("bajo", "Securly bloquea juegos y sitios sin categorizar."),
        "s": ("bajo", "Igual que en Chromebook, vía SmartPAC."),
    }),
]

# ════════════════════════════════════════════════════════════════════
# TABLA 3 · CONTROL DEL PROFESOR
# celda: (puntos, quién lo da, nota)
# ════════════════════════════════════════════════════════════════════
T3 = [
    ("Ver qué hace cada alumno", {
        "w": (0, "—", "Sin herramienta nativa de Microsoft."),
        "i": (4, "Apple Classroom", "Ve la app activa y la pantalla."),
        "c": (5, "Securly Classroom", "Miniaturas en vivo de toda la clase."),
        "s": (4, "Apple Classroom", "Securly Classroom no existe para iPad."),
    }),
    ("Ver las pestañas abiertas", {
        "w": (0, "—", "Requiere un tercero."),
        "i": (0, "—", "Classroom no lista pestañas de Safari."),
        "c": (5, "Securly Classroom", "Lista de pestañas por alumno."),
        "s": (0, "—", "No disponible."),
    }),
    ("Ver la pantalla", {
        "w": (0, "—", "Requiere un tercero."),
        "i": (5, "Apple Classroom", "También en clases remotas."),
        "c": (5, "Securly Classroom", "Y Class Tools de Google."),
        "s": (5, "Apple Classroom", ""),
    }),
    ("Cerrar una pestaña", {
        "w": (0, "—", ""),
        "i": (0, "—", ""),
        "c": (5, "Securly Classroom", ""),
        "s": (0, "—", ""),
    }),
    ("Bloquear sitios durante la clase", {
        "w": (0, "—", "Solo TI, por política de Edge."),
        "i": (3, "Apple Classroom", "Navegación guiada en iPadOS 27 (anunciada)."),
        "c": (5, "Securly Classroom", "Planes de acceso por clase."),
        "s": (3, "Classroom o Teacher Tools", "Teacher Tools solo con Securly MDM."),
    }),
    ("Abrir una página a toda la clase", {
        "w": (0, "—", "Se comparte el enlace por Teams."),
        "i": (5, "Apple Classroom", ""),
        "c": (5, "Securly Classroom", ""),
        "s": (5, "Apple Classroom", ""),
    }),
    ("Bloquear la pantalla", {
        "w": (0, "—", ""),
        "i": (4, "Apple Classroom", "Solo con los alumnos en el salón."),
        "c": (5, "Securly Classroom", ""),
        "s": (4, "Apple Classroom", "Solo en el salón."),
    }),
    ("Fijar una app o un sitio", {
        "w": (2, "Take a Test", "Solo para evaluaciones."),
        "i": (5, "Apple Classroom", "Fijar en una app."),
        "c": (5, "Securly Classroom", "Site Lock; las apps Android se controlan desde Admin."),
        "s": (5, "Apple Classroom", ""),
    }),
    ("Lanzar una actividad", {
        "w": (3, "Teams for Education", "Tareas, no control del equipo."),
        "i": (4, "Schoolwork", "Tareas y progreso en apps compatibles."),
        "c": (5, "Google Classroom", "Y modo bloqueado de Forms para cuestionarios."),
        "s": (4, "Schoolwork", ""),
    }),
    ("Ver los prompts de IA del alumno", {
        "w": (0, "—", ""),
        "i": (0, "—", ""),
        "c": (5, "Securly Classroom", "ChatGPT, Gemini y otros."),
        "s": (0, "—", "Las guardas de IA solo existen con la extensión."),
    }),
    ("Recibir alertas de riesgo", {
        "w": (0, "—", ""),
        "i": (0, "—", ""),
        "c": (5, "Securly Aware", "Para orientación, no para el profesor."),
        "s": (4, "Securly Aware", "Sin Think Twice ni widget de bienestar."),
    }),
]

# ════════════════════════════════════════════════════════════════════
# TABLA 4 · CONTROL DEL ADMINISTRADOR TI
# ════════════════════════════════════════════════════════════════════
T4 = [
    ("Inscripción sin tocar el equipo", ["ms-autopilot", "ap-ade", "g-reinscripcion"], {
        "w": (5, "Windows Autopilot."), "i": (5, "Inscripción automática por Apple School Manager."),
        "c": (5, "Inscripción y reinscripción forzada."), "s": (5, "Como iPad, más el perfil SmartPAC y el certificado."),
    }),
    ("Políticas por alumno, grupo y equipo", ["ms-ife", "ap-supervision", "g-pol-usr"], {
        "w": (5, "Grupos de Entra e Intune."), "i": (4, "Por grupos del MDM; varía según el proveedor."),
        "c": (5, "Unidades organizativas para usuarios y equipos."), "s": (4, "MDM más políticas de Securly por usuario."),
    }),
    ("Actualizaciones forzadas", ["ms-autopatch", "ap-updates", "g-aue"], {
        "w": (4, "Directivas de cliente; Autopatch con A3/A5."), "i": (5, "Gestión declarativa con fecha límite."),
        "c": (5, "Automáticas; el canal se fija por política."), "s": (5, "Como iPad."),
    }),
    ("Bloqueo, borrado y localización", ["ms-ife", "ap-perdido", "g-desactivar"], {
        "w": (5, "Desde Intune."), "i": (5, "Modo Perdido administrado."),
        "c": (5, "Desactivación remota."), "s": (5, "Como iPad."),
    }),
    ("Reportes del parque", ["ms-ife", "ap-wwdc26", "g-ceu"], {
        "w": (5, "Intune y Defender."), "i": (4, "Según el MDM; iPadOS 27 suma reportes de estado."),
        "c": (5, "Últimos usuarios, versión, fecha de fin de soporte."), "s": (4, "Como iPad."),
    }),
    ("Consolas que hay que operar", ["ms-ife", "ap-asm", "g-inscribir", "s-comparativa"], {
        "w": (3, "Intune, Entra y Defender, más una herramienta de aula de terceros."), "i": (4, "Apple School Manager y el MDM."),
        "c": (4, "Google Admin y Securly."), "s": (3, "Apple School Manager, el MDM y Securly."),
    }),
    ("Conocimiento técnico requerido", ["ms-appcontrol", "ap-supervision", "g-pol-usr", "s-userinj"], {
        "w": (2, "Alto: App Control, Intune y Defender son disciplinas en sí."), "i": (3, "Medio: supervisión y el MDM elegido."),
        "c": (4, "Medio-bajo: una consola y políticas en la nube."), "s": (2, "Medio-alto: proxy, certificado, inyección de usuario y apps exentas."),
    }),
]

# ════════════════════════════════════════════════════════════════════
# TABLA 5 · PROTECCIÓN DEL ALUMNO
# ════════════════════════════════════════════════════════════════════
T5 = [
    ("Contenido adulto", {"w": (4, "Categoría de Defender (con licencia); SafeSearch en Edge."), "i": (3, "Filtro automático de contenido adulto, básico."), "c": (5, "Securly y SafeSearch forzado."), "s": (4, "Securly vía SmartPAC.")}),
    ("Malware", {"w": (4, "Defender y SmartScreen incluidos."), "i": (5, "Solo apps firmadas y revisadas."), "c": (5, "Sin ejecutables y con sandbox."), "s": (5, "Como iPad.")}),
    ("Phishing", {"w": (4, "SmartScreen y protección mejorada contra phishing."), "i": (4, "Advertencia de sitio fraudulento en Safari."), "c": (5, "Safe Browsing mejorado forzado."), "s": (4, "Como iPad, más categorías de Securly.")}),
    ("Distracciones en clase", {"w": (1, "Sin control docente nativo."), "i": (4, "Apple Classroom fija apps."), "c": (5, "Securly Classroom y Class Tools."), "s": (4, "Apple Classroom.")}),
    ("Aplicaciones no autorizadas", {"w": (3, "Exige App Control."), "i": (5, "App Store bloqueable."), "c": (5, "Lista permitida."), "s": (5, "Como iPad.")}),
    ("Redes sociales", {"w": (3, "Categoría de Defender."), "i": (2, "Solo bloqueando apps y con lista blanca."), "c": (5, "Categoría de Securly."), "s": (3, "Categoría web; las apps nativas fallan con el proxy.")}),
    ("Videojuegos", {"w": (3, "Categoría de Defender y App Control."), "i": (3, "Bloquear el App Store; los juegos web pasan."), "c": (5, "Categoría de Securly y apps permitidas."), "s": (4, "Categoría de Securly.")}),
    ("YouTube", {"w": (4, "Modo restringido forzado en Edge."), "i": (1, "Sin control nativo."), "c": (5, "Modo restringido más canales y videos."), "s": (3, "Solo modos de restricción.")}),
    ("Búsquedas", {"w": (4, "SafeSearch forzado en Edge."), "i": (1, "Sin SafeSearch nativo."), "c": (5, "SafeSearch y escaneo de palabras clave."), "s": (4, "Escaneo de palabras clave por SmartPAC.")}),
    ("IA generativa", {"w": (2, "Bloquear o permitir dominios."), "i": (3, "Apple Intelligence se apaga por MDM; los sitios de IA, por lista."), "c": (5, "Gemini con salvaguardas para menores y guardas de Securly en chatbots."), "s": (2, "Solo bloquear o permitir dominios de IA.")}),
]

T5_FUENTES = ["ms-wcf", "ms-edge-yt", "ap-firma", "ap-wcf", "ap-restr-dev", "g-safebrowsing", "g-gemini", "s-comparativa", "s-youtube", "s-aichat"]

# ════════════════════════════════════════════════════════════════════
# TABLA 6 · ESCENARIO REAL: 30 ALUMNOS DE SECUNDARIA
# ════════════════════════════════════════════════════════════════════
T6 = [
    ("Permitir únicamente 3 páginas web", {
        "w": (2, "TI configura una lista permitida en Edge por grupo; el profesor no puede hacerlo en clase."),
        "i": (3, "Lista «solo sitios específicos» por MDM (TI), o navegación guiada en iPadOS 27."),
        "c": (5, "El profesor activa Site Lock con las 3 páginas en segundos."),
        "s": (3, "Como iPad; con Securly MDM, Teacher Tools fija sitios en Safari."),
    }),
    ("Bloquear juegos", {
        "w": (3, "Categoría de juegos en Defender (con licencia) y App Control."),
        "i": (2, "Bloquear la App Store; los juegos web no tienen categoría."),
        "c": (5, "Categoría de juegos de Securly."),
        "s": (4, "Categoría de juegos de Securly vía SmartPAC."),
    }),
    ("Bloquear redes sociales", {
        "w": (3, "Categoría de redes en Defender (con licencia)."),
        "i": (2, "Sin categorías: hay que listar sitios y bloquear apps."),
        "c": (5, "Categoría de redes de Securly."),
        "s": (4, "Categoría web de Securly; las apps nativas se bloquean."),
    }),
    ("Evitar VPN", {
        "w": (3, "App Control y usuario estándar."),
        "i": (5, "Restricción de VPN y App Store bloqueada."),
        "c": (5, "Apps y extensiones solo de la lista permitida."),
        "s": (5, "Como iPad."),
    }),
    ("Impedir la instalación de apps", {
        "w": (4, "Store bloqueada y App Control."),
        "i": (5, "App Store desactivada."),
        "c": (5, "Lista permitida."),
        "s": (5, "App Store desactivada."),
    }),
    ("Ver qué páginas tienen abiertas", {
        "w": (0, "Sin herramienta nativa."),
        "i": (2, "Ve la pantalla de cada alumno, no sus pestañas."),
        "c": (5, "Lista de pestañas de los 30 alumnos."),
        "s": (2, "Ve la pantalla, no las pestañas."),
    }),
    ("Cerrar una pestaña", {
        "w": (0, "No disponible."),
        "i": (0, "No disponible."),
        "c": (5, "Un clic desde Securly Classroom."),
        "s": (0, "No disponible."),
    }),
    ("Mandar una página a toda la clase", {
        "w": (1, "Compartir el enlace por Teams y esperar a que lo abran."),
        "i": (5, "Apple Classroom la abre en los 30 iPads."),
        "c": (5, "Enviar URL desde Securly Classroom."),
        "s": (5, "Apple Classroom."),
    }),
    ("Mantener restricciones al salir", {
        "w": (3, "Las políticas siguen; el filtro, solo con Defender."),
        "i": (3, "Las restricciones siguen; el filtro nativo es básico."),
        "c": (5, "Filtro y políticas siguen con la cuenta, en cualquier red."),
        "s": (4, "SmartPAC sigue filtrando en cualquier red."),
    }),
    ("Impedir una cuenta personal", {
        "w": (4, "Bloqueo de cuentas Microsoft personales y de perfiles en Edge."),
        "i": (5, "Solo cuentas institucionales."),
        "c": (5, "Inicio de sesión restringido al dominio."),
        "s": (5, "Solo cuentas institucionales."),
    }),
]

T6_FUENTES = ["ms-edge-url", "ms-wcf", "ms-appcontrol", "ap-wcf", "ap-classroom-req", "ap-wwdc26", "s-classroom-tareas", "s-comparativa", "s-mdm", "g-pol-disp"]
