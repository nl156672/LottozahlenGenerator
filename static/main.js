import { generateLottoJS, isValidCombination } from './lotto_fallback.js';

const numsEl = document.getElementById('nums');
const superEl = document.getElementById('super');
const histEl = document.getElementById('history');
const genBtn = document.getElementById('generate');
const clearBtn = document.getElementById('clear');

let wasmApi = null;

async function tryLoadWasm() {
  try {
    // If user built with wasm-pack, we'll find pkg/lotto_wasm.js
    const mod = await import('../rust/pkg/lotto_wasm.js');
    if (mod && mod.generate_lotto) {
      wasmApi = mod;
      console.log('WASM module loaded');
    }
  } catch (e) {
    console.log('WASM not loaded, using JS fallback');
  }
}

function renderBalls(numbers, superz) {
  numsEl.innerHTML = '';
  numbers.forEach(n => {
    const d = document.createElement('div');
    d.className = 'ball';
    d.textContent = n;
    numsEl.appendChild(d);
  });
  superEl.textContent = superz;
}

function loadHistory() {
  const raw = localStorage.getItem('lotto_history');
  if (!raw) return [];
  try { return JSON.parse(raw); } catch { return [] }
}

function saveHistory(hist) { localStorage.setItem('lotto_history', JSON.stringify(hist)); }

function appendHistoryRow(item) {
  const li = document.createElement('li');
  li.textContent = `${item.numbers.join(', ')} | S:${item.super}`;
  histEl.prepend(li);
}

function renderHistory() {
  histEl.innerHTML = '';
  const h = loadHistory();
  h.slice().reverse().forEach(appendHistoryRow);
}

function animateAndShow(result) {
  // animate: rapid rolling for ~1.5s, stop one by one
  const slots = Array.from({length:6}).map(()=>document.createElement('div'));
  numsEl.innerHTML = '';
  slots.forEach(s=>{s.className='ball';s.textContent='-';numsEl.appendChild(s)});
  superEl.textContent='-';

  const start = Date.now();
  const roll = () => {
    const t = Date.now() - start;
    slots.forEach((s, i)=>{
      if (t > 600 + i*250) {
        s.textContent = result.numbers[i];
      } else {
        s.textContent = Math.floor(Math.random()*49)+1;
      }
    });
    if (t > 600 + 6*250) {
      superEl.textContent = result.super;
    } else {
      superEl.textContent = Math.floor(Math.random()*10);
    }
    if (t < 600 + 6*250 + 200) requestAnimationFrame(roll);
  };
  requestAnimationFrame(roll);
}

async function generate() {
  // generate using WASM if available, else fallback
  let result;
  if (wasmApi && wasmApi.generate_lotto) {
    try {
      const arr = wasmApi.generate_lotto();
      // wasm returns Js Array with 7 entries (6 numbers + super)
      const js = Array.from(arr);
      const numbers = js.slice(0,6).map(n=>Number(n));
      const superz = Number(js[6]);
      result = {numbers, super: superz};
    } catch (e) { console.warn('WASM call failed, fallback'); result = generateLottoJS(); }
  } else {
    result = generateLottoJS();
  }

  // Validate and avoid simple patterns
  if (!isValidCombination(result.numbers)) {
    // if invalid, try again (small loop)
    for (let i=0;i<8 && !isValidCombination(result.numbers);i++) {
      result = generateLottoJS();
    }
  }

  animateAndShow(result);
  const hist = loadHistory();
  hist.push(result);
  // avoid duplicates: keep last 500
  const uniq = [];
  const seen = new Set();
  for (let i = hist.length-1; i>=0 && uniq.length<500; i--) {
    const key = hist[i].numbers.join(',')+"|"+hist[i].super;
    if (!seen.has(key)) { seen.add(key); uniq.push(hist[i]); }
  }
  const final = uniq.reverse();
  saveHistory(final);
  renderHistory();
}

genBtn.addEventListener('click', generate);
clearBtn.addEventListener('click', ()=>{ localStorage.removeItem('lotto_history'); renderHistory(); });

await tryLoadWasm();
renderHistory();
