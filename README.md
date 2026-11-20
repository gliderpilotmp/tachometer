# Klassik-Tacho

GPS-Tachometer mit Höhenmesser als PWA, im Stil von Mercedes W123, Mercedes 190E, BMW E30, Porsche 911 (G-Modell), Porsche 944, VW Bus T1, Ferrari F40 und Fiat 500 Abarth.

- Geschwindigkeit, Gesamt- und Tageskilometer kommen aus dem GPS, die Höhe aus der GPS-Höhe.
- Skin wechseln: über den Tacho wischen oder die Pfeile unten antippen.
- Die Höhe lässt sich in den Einstellungen mit einer bekannten Höhe abgleichen.
- Der Bildschirm bleibt an, die App funktioniert nach dem ersten Laden offline.

## GitHub Pages

Settings → Pages → Branch wählen, Ordner `/ (root)`. Die App läuft dann unter `https://<user>.github.io/tachometer/`.
Auf dem Handy in Chrome öffnen und über das Menü „Zum Startbildschirm hinzufügen“ installieren.

## Neuer Skin

Einen Eintrag in `js/skins.js` ergänzen; `js/gauge.js` zeichnet Skala, Nadel und Zählrollen daraus.
Nach Änderungen die `VERSION` in `sw.js` erhöhen, damit installierte Apps das Update laden.
