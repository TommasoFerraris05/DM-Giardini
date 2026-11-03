(()=>{
const form=document.getElementById('quote-form');if(!form)return;
const steps=[...form.querySelectorAll('.wizard-step')];const back=document.getElementById('quote-prev'),next=document.getElementById('quote-next'),submit=document.getElementById('quote-submit');const count=document.getElementById('wizard-count'),bar=document.getElementById('wizard-progress'),summary=document.getElementById('quote-summary'),feedback=document.getElementById('send-feedback'),fallback=document.getElementById('mailto-fallback');let step=0;let summaryEdited=false;
const read=name=>{const el=form.elements.namedItem(name);return el&&'value' in el?el.value.trim():'';};
const chosen=()=>form.querySelector('[name=intervento]:checked')?.value||'';
const selectedFields=()=>{const branch=form.querySelector(`.conditional-fields[data-when="${CSS.escape(chosen())}"]`);return branch?[...branch.querySelectorAll('input,select,textarea')]:[];};
function updateConditional(){const current=chosen();form.querySelectorAll('.conditional-fields').forEach(el=>{const show=el.dataset.when===current;el.hidden=!show;el.querySelectorAll('input,select,textarea').forEach(input=>{input.disabled=!show;});});}
function buildSummary(){const bits=[`Buongiorno, sono ${read('nome')||'[Nome e cognome]'} e vorrei richiedere informazioni per un intervento di DM Giardini.`,`TIPOLOGIA: ${chosen()||'Da specificare'}`,`ZONA DELL'INTERVENTO: ${read('comune')||'Da specificare'}`];for(const el of selectedFields()){if(el.value.trim()){const label=el.closest('.field')?.querySelector('span')?.textContent||el.name;bits.push(`${label.replace('*','').trim()}: ${el.value.trim()}`);}}for(const [n,label] of [['superficie','Superficie indicativa'],['tempistiche','Tempistiche desiderate']])if(read(n))bits.push(`${label}: ${read(n)}`);bits.push(`DESCRIZIONE: ${read('descrizione')||'[Da specificare]'}`);bits.push(`CONTATTI: ${read('telefono')} — ${read('email')}`);bits.push(`MODALITÀ DI CONTATTO: ${read('preferenza')||'Telefono'}`);return bits.join('\n\n');}
function mailto(){const text=(summary.value||buildSummary());fallback.href=`mailto:montagnerdavide.dm@gmail.com?subject=${encodeURIComponent('Richiesta informazioni DM Giardini — '+read('nome'))}&body=${encodeURIComponent(text)}`;}
function show(n){step=n;steps.forEach((el,i)=>el.hidden=i!==step);back.hidden=step===0;next.hidden=step===3;submit.hidden=step!==3;count.textContent=`PASSO ${String(step+1).padStart(2,'0')} / 04`;bar.style.width=((step+1)/4*100)+'%';if(step===3){if(!summaryEdited)summary.value=buildSummary();mailto();}else{summaryEdited=false;}feedback.textContent='';feedback.removeAttribute('data-error');const wizard=document.querySelector('.quote-wizard');if(wizard&&window.scrollY>wizard.getBoundingClientRect().top+window.scrollY-95){window.scrollTo({top:wizard.getBoundingClientRect().top+window.scrollY-102,behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});}}
function validateCurrent(){const active=steps[step];const fields=[...active.querySelectorAll('input,select,textarea')].filter(el=>!el.disabled&&el.type!=='hidden'&&el.getClientRects().length>0);for(const el of fields){if(el.type==='radio')continue;if(!el.checkValidity()){el.reportValidity();el.focus();return false;}}if(step===0&&!chosen()){form.querySelector('[name=intervento]')?.focus();alert('Seleziona la tipologia di intervento.');return false;}return true;}
form.addEventListener('change',e=>{if(e.target.name==='intervento'){updateConditional();summaryEdited=false;}if(e.target.name==='privacy')feedback.textContent='';});
summary.addEventListener('input',()=>{summaryEdited=true;mailto();});
next.addEventListener('click',()=>{if(validateCurrent())show(Math.min(3,step+1));});back.addEventListener('click',()=>show(Math.max(0,step-1)));
const copy=document.getElementById('quote-copy');
if(copy){copy.addEventListener('click',async()=>{const text=summary.value||buildSummary();try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(text);feedback.textContent='Riepilogo copiato. Puoi incollarlo in un messaggio a montagnerdavide.dm@gmail.com.';}else{summary.focus();summary.select();feedback.textContent='Riepilogo selezionato: copialo e incollalo nella tua e-mail.';}}catch(_){summary.focus();summary.select();feedback.textContent='Seleziona e copia il riepilogo per inviarlo via e-mail.';}});}
form.addEventListener('submit',(e)=>{e.preventDefault();if(!validateCurrent())return;mailto();
feedback.removeAttribute('data-error');feedback.textContent='Si apre il tuo programma di posta con la richiesta compilata. Per inviarla, premi Invia nel programma e-mail. Il sito non spedisce automaticamente.';
window.location.href=fallback.href;
});
updateConditional();show(0);
})();


