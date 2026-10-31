# Top 5 Schachspielerinnen (PWA)

Kostenlose Web-App, die die 5 Schachspielerinnen mit der hoechsten Live-Elo von 2700chess.com anzeigt.
Laeuft auf Android, iPhone und PC, ohne App Store und ohne kostenpflichtige Apps.

## Einmalig einrichten (ca. 10 Minuten, kostenlos)

1. Kostenloses Konto auf github.com anlegen.
2. Neues Repository erstellen, z. B. `schach-top5`, Sichtbarkeit **Public**.
3. Alle Dateien aus diesem Ordner hochladen ("Add file" -> "Upload files").
   Wichtig: der Ordner `.github/workflows` muss mit hochgeladen werden.
   Falls er im Upload fehlt: "Add file" -> "Create new file", als Namen
   `.github/workflows/update.yml` eingeben und den Inhalt hineinkopieren.
4. **Settings -> Actions -> General -> Workflow permissions**: "Read and write permissions" waehlen und speichern.
5. **Settings -> Pages**: Source "Deploy from a branch", Branch `main`, Ordner `/ (root)`, speichern.
6. **Actions -> "Daten aktualisieren" -> "Run workflow"**: holt die Daten sofort zum ersten Mal.
   Danach laeuft es automatisch ca. alle 4 Stunden.

Die App ist dann erreichbar unter:
https://pyro-ak.github.io/schach-top5/

## Auf dem Handy installieren

- **Android (Chrome):** Link oeffnen -> Menue (drei Punkte) -> "Zum Startbildschirm hinzufuegen" bzw. "App installieren".
- **iPhone (Safari):** Link oeffnen -> Teilen -> "Zum Home-Bildschirm".
- **PC (Chrome/Edge):** Installations-Symbol in der Adressleiste.

Den Link einfach an weitere Nutzer schicken, sie muessen nichts einrichten.

## Wie es funktioniert

- GitHub Actions holt alle 4 Stunden die Liste von 2700chess.com und speichert die Top 5 in `data.json`.
- Die App liest `data.json`, zeigt Rang, Name und Elo auf hellem Schachbrett-Hintergrund und merkt sich die letzten Daten.
  Ohne Internet erscheinen die gespeicherten Daten mit dem Hinweis "(Cache)".

## Fehlersuche

- Steht "Daten konnten nicht geladen werden": unter **Actions** pruefen, ob der letzte Lauf gruen ist.
- Ist ein Lauf rot, hat sich vermutlich der Aufbau von 2700chess.com geaendert oder die Seite blockiert den Abruf.
  Der Parser steht in `scripts/update.mjs`.
