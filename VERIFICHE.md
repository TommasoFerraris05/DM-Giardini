# Correzione dei percorsi del sito DM Giardini

## Causa verificata sul sito pubblicato

Consultati l’HTML pubblico https://tommasoferraris05.github.io/DM-Giardini/ e l’albero pubblico del repository TommasoFerraris05/DM-Giardini su main.

Le pagine pubblicate richiedevano assets/media/foto-05.webp, assets/js/main.js e assets/js/garden-standalone.js: tutte e tre le richieste hanno restituito HTTP 404. Nel repository gli stessi file erano già nella radice, senza sottocartelle. Nel browser pubblico non era presente alcun canvas 3D e la fotografia del fallback aveva larghezza naturale zero.

## Correzione

- Tutto il pacchetto è piatto: HTML, fotografie, video, CSS, JavaScript e licenza si trovano allo stesso livello.
- Tutti i riferimenti sono relativi alla pagina: ./foto-05.webp, ./main.js, ./garden-standalone.js. Nessuna cartella assets richiesta.
- Parametro di versione sui tre script applicativi per il ricaricamento della correzione.
- Galleria estesa da 12 a tutte le 22 fotografie originali, comprese le composizioni Prima/Dopo originali. I tre slider precedenti sono conservati senza alterare le immagini.
- Fotografie, video e logo originali verificati mediante SHA-256: tutti i 31 file media sono invariati.

## Verifiche

- 214 riferimenti HTML locali verificati: nessun file mancante e nessun percorso assets residuo.
- Script principali e bundle del giardino verificati sintatticamente.
- ZIP completo estratto e verificato confrontando gli SHA-256 di tutti i file. Nessuna sottocartella nell’archivio; index.html e .nojekyll nella radice.
- 54 file, ciascuno inferiore a 25 MiB; il file maggiore è il video originale da 1.507.461 byte. Archivio complessivo inferiore a 25 MiB.
- Browser locale con prefisso /DM-Giardini/: scena WebGL attiva e fotografia originale caricata con larghezza naturale 900 px. Il sito pubblico precedente, per confronto, non caricava né canvas né fotografia.

## Limiti e stato della pubblicazione

Non è stata eseguita alcuna modifica diretta su GitHub: il sito pubblico riceverà la correzione soltanto dopo il caricamento dei file di questo ZIP. Non occorre eliminare file esistenti. Tutti i file del pacchetto vanno caricati insieme nella radice, sostituendo quelli con lo stesso nome.

Le prove precedenti su movimento ridotto, fallback, configuratore, menu, video e confronti sono documentate nelle consegne precedenti; il codice applicativo è conservato. Non sono stati eseguiti test su dispositivi fisici o invii e-mail reali. Il configuratore prepara una mail che il visitatore deve inviare manualmente.

Le informative privacy/cookie conservano i dati ancora da completare nel progetto originale, così come noindex e robots.txt. Non vengono dichiarati dati aziendali mancanti o lavori fittizi. La scena 3D è una visualizzazione concettuale leggermente stilizzata.

## Collaudo conclusivo dal pacchetto estratto

Il server di collaudo sulla porta 4176 ha servito i file estratti dallo ZIP, sotto /DM-Giardini/.

- Homepage: scena 3D visibile, canvas presente e fotografia originale da 900 px caricata. Salvata schermata desktop reale del giardino renderizzato.
- Galleria: 22 pulsanti di ingrandimento; prima foto caricata da ./foto-05.webp con larghezza naturale 900 px e contatore 1/22. Provata anche la fotografia aggiunta ./foto-08.webp, caricata a 900 px. Salvata schermata reale della foto originale nel dialogo.
- Aperte tutte e nove le pagine del pacchetto. Nessuno sbordamento orizzontale rilevato alle dimensioni desktop del collaudo, nessun errore o avviso nella console.
- Configuratore: categoria Manutenzione e zona di prova; avanzamento al passo 02/04 riuscito. Nessun invio effettuato.
- Il sito pubblico non è stato aggiornato automaticamente. Le nuove pagine correggono i percorsi verso i file già presenti nella radice del repository.
