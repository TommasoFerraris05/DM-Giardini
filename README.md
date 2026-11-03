# DM Giardini — sito completo, struttura piatta

DM GIARDINI — VERSIONE CON TUTTI I FILE ALLO STESSO LIVELLO

Questo pacchetto corregge la struttura effettivamente presente nel repository DM-Giardini: fotografie e script sono tutti nella cartella principale. Non ci sono cartelle assets da caricare.

1. Estrai TUTTO lo ZIP.
2. Apri la cartella estratta: index.html, foto, video e script si trovano insieme.
3. Nel repository DM-Giardini, scheda Code, Add file > Upload files, trascina TUTTI questi file. Non trascinare lo ZIP o la cartella contenitore.
4. Commit changes su main, sostituendo i file esistenti.
5. Lascia Settings > Pages > main > /(root). Attendi il completamento dell'aggiornamento.

Non è necessario eliminare file esistenti. I file che già si trovano nella radice saranno sostituiti. Eventuali vecchie cartelle assets non vengono usate da questa versione.

Per vedere l'anteprima locale, apri index.html dalla cartella completamente estratta.
Non servono terminale, build, installazioni o servizi aggiuntivi.


## Perché il sito online non mostrava le immagini e il 3D

Il sito pubblicato cercava foto e JavaScript sotto assets/media e assets/js. Nel repository i file erano invece già tutti nella radice: quelle richieste restituivano 404. Questa versione usa direttamente ./foto-05.webp, ./main.js e ./garden-standalone.js, coerentemente con la struttura presente nel repository. È mantenuto il percorso relativo anche sotto /DM-Giardini/.

## Contenuto

Nove pagine HTML, 31 file multimediali originali, tutti gli script, fogli di stile, Three.js con licenza MIT e .nojekyll. Nessuna sottocartella. Il logo e i fogli di stile sono incorporati anche nelle pagine. Fotografie e video non sono stati alterati.

Giardino 3D concettuale, trasformazione controllabile, rotazione e ripristino, fallback fotografico, galleria con lightbox e filtri, tre confronti Prima/Dopo, video e configuratore a quattro passaggi. Il preventivo prepara una mail da inviare manualmente e non calcola prezzi.

## Informazioni conservate

Privacy e cookie sono le bozze originali da completare con i dati aziendali. Sono conservate le impostazioni originali noindex e robots.txt. Nessuna modifica diretta o pubblicazione su GitHub è stata eseguita durante questa correzione.

Leggi VERIFICHE.md per le verifiche e i relativi limiti.
