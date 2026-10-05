// ============================================================
// DETECCIÓN DE TÁCTIL
// ============================================================
const esTactil = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

// ============================================================
// SPRITES
// ============================================================
const RUTAS_SPRITES = {
  avion: 'avion.gif',
  enemigo1: 'enemigo-1.gif',
  enemigo2: 'enemigo-2.gif',
  enemigo3: 'enemigo-3.gif'
};

const spritesDisponibles = {};
Object.entries(RUTAS_SPRITES).forEach(([k, ruta]) => {
  const img = new Image();
  img.onload = () => { spritesDisponibles[k] = true; };
  img.onerror = () => { spritesDisponibles[k] = false; };
  img.src = ruta;
});

function crearImgSprite(src) {
  const img = document.createElement('img');
  img.src = src;
  img.className = 'sprite';
  img.draggable = false;
  return img;
}

// ============================================================
// PREGUNTAS
// ============================================================
const preguntas = [
  { q: '¿Cuál es la contraseña MÁS segura?', ops: ['123456','MiNombre','T#7kL!9pQ@2','password'], ok: 2, exp: 'Una contraseña fuerte mezcla mayúsculas, números y símbolos.' },
  { q: 'Te llega un mail del "banco" pidiendo verificar tus datos con urgencia. ¿Qué hacés?', ops: ['Hago clic rápido','Entro a la app oficial del banco','Respondo con mis datos','Lo reenvío'], ok: 1, exp: 'Nunca hagas clic en links raros. Entrá siempre a la app o web oficial.' },
  { q: '¿Qué es el phishing?', ops: ['Un antivirus','Una estafa que roba tus datos','Un tipo de wifi','Un juego'], ok: 1, exp: 'Phishing es cuando alguien se hace pasar por otro para robar tus datos.' },
  { q: '¿Qué significa el candado 🔒 en la barra del navegador?', ops: ['La web está rota','La web es segura (HTTPS)','Hay virus','Es un juego'], ok: 1, exp: 'El candado significa que la conexión es segura con HTTPS.' },
  { q: '¿Qué es el 2FA (doble factor)?', ops: ['Una contraseña más larga','Un antivirus','Una capa extra de seguridad','Un tipo de wifi'], ok: 2, exp: '2FA añade un código extra además de tu contraseña. Es clave.' },
  { q: 'Recibís un SMS: "Ganaste un iPhone, tocá aquí". ¿Qué hacés?', ops: ['Hago clic','Lo ignoro y bloqueo el número','Respondo','Reenvío a amigos'], ok: 1, exp: 'Si no participaste en un sorteo, no ganaste nada. Es estafa.' },
  { q: '¿Qué hacés en una wifi pública?', ops: ['Hago homebanking','Evito cosas sensibles o uso VPN','Comparto la clave','Bajo archivos'], ok: 1, exp: 'En wifi pública pueden espiar tus datos. Evitá cosas sensibles.' },
  { q: 'Un "amigo" por WhatsApp pide un código que te llegó por SMS. ¿Qué hacés?', ops: ['Se lo paso','No lo paso y lo llamo para verificar','Lo publico','Le paso la mitad'], ok: 1, exp: 'Ese código es la llave de tu cuenta. Nunca lo compartas.' },
  { q: '¿Cada cuánto es recomendable cambiar tu contraseña?', ops: ['Nunca','Cada 5 minutos','Cada 6-12 meses o si te hackean','Solo si te obligan'], ok: 2, exp: 'Cambiar la contraseña cada 6-12 meses (o tras un incidente) es buena práctica.' },
  { q: '¿Qué es un antivirus?', ops: ['Un juego','Un programa que protege tu compu','Una red social','Un tipo de wifi'], ok: 1, exp: 'El antivirus detecta y elimina programas malos.' },
  { q: '¿Qué haces si un desconocido te pide tu dirección por chat?', ops: ['Se la doy','No la doy y lo bloqueo','Le doy una falsa','Le doy el colegio'], ok: 1, exp: 'Nunca compartas datos personales con desconocidos.' },
  { q: '¿Cuál es más segura para tus cuentas?', ops: ['La misma en todas','Una distinta por cuenta','Tu nombre','Tu cumpleaños'], ok: 1, exp: 'Usá una contraseña distinta en cada cuenta importante.' },
  { q: '¿Qué es un "virus informático"?', ops: ['Un programa que daña tu compu','Un juego','Una web','Un tipo de wifi'], ok: 0, exp: 'El virus es un programa malo que se mete en tu equipo.' },
  { q: '¿Qué hacés si ves un link acortado (bit.ly/xxx) en un correo?', ops: ['Lo abro','Desconfío y verifico el remitente','Lo reenvío','Lo publico'], ok: 1, exp: 'Los links acortados suelen usarse en estafas. Desconfiá siempre.' },
  { q: '¿Qué es un hacker ético?', ops: ['Alguien que roba datos','Alguien que ayuda a proteger sistemas','Un policía','Un virus'], ok: 1, exp: 'Los hackers éticos buscan fallas para que las empresas las arreglen.' },
  { q: '¿Qué es la ingeniería social?', ops: ['Construir puentes','Manipular personas para obtener datos','Un tipo de wifi','Un juego'], ok: 1, exp: 'Es cuando el atacante manipula personas para conseguir información.' },
  { q: '¿Qué es la autenticación biométrica?', ops: ['Usar huella o cara para entrar','Un antivirus','Un tipo de wifi','Un juego'], ok: 0, exp: 'Usa datos físicos únicos (huella, cara, iris) para verificar tu identidad.' },
  { q: '¿Qué es el ransomware?', ops: ['Un antivirus','Secuestra archivos y pide rescate','Un tipo de wifi','Un juego'], ok: 1, exp: 'Bloquea tus archivos y pide dinero para liberarlos.' },
  { q: '¿Qué es una VPN?', ops: ['Un juego','Una red privada virtual que oculta tu conexión','Un antivirus','Un tipo de wifi'], ok: 1, exp: 'Crea un túnel cifrado para proteger tu conexión.' },
  { q: '¿Qué es la verificación en dos pasos?', ops: ['Una contraseña más larga','Algo que sabés + algo que tenés','Un antivirus','Un juego'], ok: 1, exp: 'Combina tu contraseña con un código que solo vos tenés.' }
];

// ============================================================
// LOGROS
// ============================================================
const LOGROS = [
  { id: 'primer_acierto', emoji: '🎯', nombre: 'PRIMER ACIERTO', desc: 'Respondé 1 pregunta correctamente' },
  { id: 'racha_5', emoji: '🔥', nombre: 'RACHA DE 5', desc: '5 aciertos seguidos' },
  { id: 'vel_max', emoji: '🚀', nombre: 'VELOCIDAD MÁXIMA', desc: 'Llegá a 180 de velocidad' },
  { id: 'pts_100', emoji: '💯', nombre: 'CIEN PUNTOS', desc: 'Sumá 100 puntos' },
  { id: 'pts_500', emoji: '⭐', nombre: 'QUINIENTOS', desc: 'Sumá 500 puntos' },
  { id: 'pts_1000', emoji: '🏆', nombre: 'MIL PUNTOS', desc: 'Sumá 1000 puntos' },
  { id: 'escudero', emoji: '🛡️', nombre: 'ESCUDERO', desc: 'Agarrá 3 escudos en una partida' },
  { id: 'revividor', emoji: '❤️', nombre: 'REVIVIDOR', desc: 'Llegá a 5 vidas' },
  { id: 'cazador', emoji: '👹', nombre: 'CAZADOR DE JEFES', desc: 'Derrotá un jefe' },
  { id: 'sabio', emoji: '📚', nombre: 'SABIO', desc: '20 preguntas respondidas en total' },
  { id: 'veterano', emoji: '🎖️', nombre: 'VETERANO', desc: 'Sobreviví 2 minutos' },
  { id: 'sin_miedo', emoji: '💀', nombre: 'SIN MIEDO', desc: 'Alcanzá velocidad máxima' }
];

let logrosDesbloqueados = JSON.parse(localStorage.getItem('cyberpilot_logros') || '[]');
let preguntasTotales = parseInt(localStorage.getItem('cyberpilot_preguntas') || '0');

function desbloquearLogro(id) {
  if (logrosDesbloqueados.includes(id)) return;
  logrosDesbloqueados.push(id);
  localStorage.setItem('cyberpilot_logros', JSON.stringify(logrosDesbloqueados));
  const logro = LOGROS.find(l => l.id === id);
  if (logro) {
    mostrarToastLogro(logro);
    sfxLogro();
    actualizarHUDLogros();
  }
}

function mostrarToastLogro(logro) {
  const toast = document.getElementById('logroToast');
  document.getElementById('logroToastNombre').textContent = logro.nombre;
  toast.querySelector('.em').textContent = logro.emoji;
  toast.classList.add('on');
  setTimeout(() => toast.classList.remove('on'), 3000);
}

function actualizarHUDLogros() {
  document.getElementById('stLogros').textContent = logrosDesbloqueados.length + '/' + LOGROS.length;
}

function mostrarLogros(desdeFin) {
  const lista = document.getElementById('logrosLista');
  lista.innerHTML = '';
  LOGROS.forEach(l => {
    const desb = logrosDesbloqueados.includes(l.id);
    const div = document.createElement('div');
    div.className = 'logro-item ' + (desb ? 'desbloqueado' : 'bloqueado');
    div.innerHTML = `
      <div class="emoji-logro">${l.emoji}</div>
      <div class="info-logro">
        <div class="nombre-logro">${desb ? l.nombre : '???'}</div>
        <div class="desc-logro">${l.desc}</div>
      </div>
    `;
    lista.appendChild(div);
  });
  document.getElementById('btnReiniciarLogros').style.display = desdeFin ? 'inline-block' : 'none';
  document.getElementById('btnCerrarLogros').style.display = desdeFin ? 'none' : 'inline-block';
  document.getElementById('overlayLogros').classList.remove('oculto');
}

function cerrarLogros() {
  document.getElementById('overlayLogros').classList.add('oculto');
}

// ============================================================
// CANVAS
// ============================================================
const cv = document.getElementById('cv');
const ctx = cv.getContext('2d');
const zonaJuego = document.getElementById('zonaJuego');
const spritesContainer = document.getElementById('spritesContainer');
let W, H, escalaX, escalaY;

function ajustar() {
  const rect = zonaJuego.getBoundingClientRect();
  const dpr = window.devicePixelRatio || 1;
  W = 1000;
  H = Math.round(1000 * (rect.height / rect.width));
  cv.width = W * dpr;
  cv.height = H * dpr;
  cv.style.width = '100%';
  cv.style.height = '100%';
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  escalaX = rect.width / W;
  escalaY = rect.height / H;
}

// ============================================================
// ENEMIGOS
// ============================================================
const enemigos = [
  { tipo: 'misilFuego', spriteKey: 'enemigo1', ancho: 190, alto: 135, color: '#ff8800', nombre: 'MISIL', velocidadX: 1.0 },
  { tipo: 'misilNegro', spriteKey: 'enemigo2', ancho: 130, alto: 75, color: '#666666', nombre: 'BOMBA', velocidadX: 1.0 },
  { tipo: 'mosquito', spriteKey: 'enemigo3', ancho: 60, alto: 60, color: '#4a5568', nombre: 'SPYWARE', velocidadX: 1.8 }
];

// ============================================================
// POWER-UPS
// ============================================================
const powerUps = [
  { tipo: 'turbo', emoji: '🚀', color: '#ffcc00', nombre: 'TURBO' },
  { tipo: 'escudo', emoji: '🛡️', color: '#00d4ff', nombre: 'ESCUDO' }
];

// ============================================================
// ESTADO
// ============================================================
const st = {
  on: false, pausado: false,
  vidas: 3, pts: 0, combo: 0, comboMax: 0,
  vel: 60, velMax: 60, velObjetivo: 60, velMin: 50, velMaxAbs: 180,
  tiempo: 0,
  avion: {
    x: 160, y: 0,
    ancho: 60, alto: 48,
    subiendo: false, bajando: false, izquierda: false, derecha: false,
    el: null
  },
  obstaculos: [], potenciadores: [], particulas: [],
  nubes: [], islas: [], pajaros: [],
  spawnObs: 0, spawnPot: 0,
  frecObs: 55,
  frecPot: 180,
  pregIdx: 0, pregRonda: [],
  shake: 0, mundoScroll: 0, contadorGiro: 0,
  escudos: 0, escudosTotal: 0, invulnerable: 0,
  sonidoOn: true, musicaOn: true,
  record: parseInt(localStorage.getItem('cyberpilot_record') || '0'),
  jefe: null, jefeActivo: false, proximoJefeEn: 1500, jefesDerrotados: 0,
  avisoJefeMostrado: false,
  balasJugador: [],
  cooldownDisparo: 0,
  puedeDisparar: false,
  joystickActivo: false,
  joystickX: 0,
  joystickY: 0
};

for (let i = 0; i < 8; i++) {
  st.nubes.push({
    x: Math.random() * 1000, y: 60 + Math.random() * 300,
    v: 0.3 + Math.random() * 0.5, escala: 0.6 + Math.random() * 0.8,
    emoji: Math.random() < 0.7 ? '☁️' : '🌤️'
  });
}
for (let i = 0; i < 5; i++) {
  st.islas.push({
    x: Math.random() * 1000, y: 0,
    v: 0.2 + Math.random() * 0.3,
    emoji: Math.random() < 0.5 ? '🏝️' : '⛰️'
  });
}
for (let i = 0; i < 3; i++) {
  st.pajaros.push({
    x: Math.random() * 1000, y: 60 + Math.random() * 120,
    v: 0.8 + Math.random() * 0.7, emoji: '🕊️'
  });
}

// ============================================================
// AUDIO
// ============================================================
let audioCtx = null;
function initAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); }
    catch(e) { st.sonidoOn = false; }
  }
}
function beep(freq, dur, tipo, vol) {
  if (!st.sonidoOn || !audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = tipo || 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol || 0.04, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + dur);
  } catch(e) {}
}
function sfxDisparo() { beep(900, 0.05, 'square', 0.04); }
function sfxTurbo() { beep(600, 0.08, 'square', 0.05); setTimeout(()=>beep(900,0.1,'square',0.05),80); setTimeout(()=>beep(1200,0.15,'square',0.05),180); }
function sfxFreno() { beep(400, 0.1, 'sawtooth', 0.06); setTimeout(()=>beep(200,0.2,'sawtooth',0.06),100); }
function sfxChocar() { beep(150, 0.25, 'sawtooth', 0.08); }
function sfxEscudo() { beep(800, 0.1, 'sine', 0.05); setTimeout(()=>beep(1200,0.12,'sine',0.05),100); }
function sfxVida() { beep(700, 0.08, 'sine', 0.06); setTimeout(()=>beep(1000,0.1,'sine',0.06),80); setTimeout(()=>beep(1400,0.15,'sine',0.06),180); }
function sfxClick() { beep(500, 0.03, 'square', 0.03); }
function sfxDerrota() { for (let i = 0; i < 5; i++) setTimeout(()=>beep(400 - i*60, 0.15, 'square', 0.06), i*120); }
function sfxLogro() {
  const notas = [523, 659, 784, 1047];
  notas.forEach((n, i) => setTimeout(()=>beep(n, 0.15, 'square', 0.06), i * 100));
}
function sfxJefe() {
  for (let i = 0; i < 6; i++) setTimeout(()=>beep(80 + i*30, 0.2, 'sawtooth', 0.08), i*120);
}
function sfxImpacto() { beep(300, 0.06, 'square', 0.05); }

// ============================================================
// MÚSICA CHIPTUNE
// ============================================================
let musicaTimer = null;
let musicaCompas = 0;
const MELODIA = [440, 523, 659, 523, 440, 523, 659, 784, 698, 587, 523, 440, 392, 523, 587, 523];
const BAJO = [110, 110, 110, 110, 110, 110, 110, 110, 87, 87, 87, 87, 98, 98, 98, 98];
const TEMPO = 180;
const NOTA_DUR = 0.15;

function iniciarMusica() {
  if (!st.musicaOn || !audioCtx) return;
  if (musicaTimer) return;
  musicaCompas = 0;
  musicaTimer = setInterval(() => {
    if (!st.musicaOn || !st.sonidoOn || !audioCtx) return;
    if (st.pausado) return;
    const i = musicaCompas % MELODIA.length;
    tocarNota(MELODIA[i], NOTA_DUR, 'square', 0.025);
    if (i % 2 === 0) {
      tocarNota(BAJO[i % BAJO.length], NOTA_DUR * 1.5, 'triangle', 0.05);
    }
    musicaCompas++;
  }, TEMPO);
}

function tocarNota(freq, dur, tipo, vol) {
  if (!audioCtx) return;
  try {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = tipo;
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(vol, audioCtx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + dur);
    osc.connect(gain); gain.connect(audioCtx.destination);
    osc.start(); osc.stop(audioCtx.currentTime + dur);
  } catch(e) {}
}

function detenerMusica() {
  if (musicaTimer) { clearInterval(musicaTimer); musicaTimer = null; }
}

// ============================================================
// INPUT TECLADO
// ============================================================
document.addEventListener('keydown', e => {
  const k = e.key.toLowerCase();
  if (k === 'p' || k === 'escape') {
    if (st.on && !st.pausado && !document.getElementById('overlayPregunta').classList.contains('on')) {
      togglePausa();
    }
    return;
  }
  if (!st.on || st.pausado) return;
  if (e.key === 'ArrowUp' || k === 'w') { e.preventDefault(); st.avion.subiendo = true; }
  if (e.key === 'ArrowDown' || k === 's') { e.preventDefault(); st.avion.bajando = true; }
  if (e.key === 'ArrowLeft' || k === 'a') { e.preventDefault(); st.avion.izquierda = true; }
  if (e.key === 'ArrowRight' || k === 'd') { e.preventDefault(); st.avion.derecha = true; }
  if (e.key === ' ' && st.puedeDisparar) {
    e.preventDefault();
    disparar();
  }
});
document.addEventListener('keyup', e => {
  const k = e.key.toLowerCase();
  if (e.key === 'ArrowUp' || k === 'w') st.avion.subiendo = false;
  if (e.key === 'ArrowDown' || k === 's') st.avion.bajando = false;
  if (e.key === 'ArrowLeft' || k === 'a') st.avion.izquierda = false;
  if (e.key === 'ArrowRight' || k === 'd') st.avion.derecha = false;
});

// ============================================================
// JOYSTICK VIRTUAL
// ============================================================
const joystickEl = document.getElementById('joystick');
const joystickKnob = document.getElementById('joystickKnob');
let joystickBaseX = 0, joystickBaseY = 0;
let joystickPointerId = null;

function iniciarJoystick(e) {
  e.preventDefault();
  const touch = e.touches ? e.touches[0] : e;
  const rect = joystickEl.getBoundingClientRect();
  joystickBaseX = rect.left + rect.width / 2;
  joystickBaseY = rect.top + rect.height / 2;
  joystickPointerId = touch.identifier !== undefined ? touch.identifier : 'mouse';
  st.joystickActivo = true;
  moverJoystick(touch.clientX, touch.clientY);
}

function moverJoystick(clientX, clientY) {
  let dx = clientX - joystickBaseX;
  let dy = clientY - joystickBaseY;
  const maxDist = 55;
  const dist = Math.sqrt(dx*dx + dy*dy);
  if (dist > maxDist) {
    dx = dx / dist * maxDist;
    dy = dy / dist * maxDist;
  }
  joystickKnob.style.transform = `translate(${dx}px, ${dy}px)`;
  st.joystickX = dx / maxDist;
  st.joystickY = dy / maxDist;
}

function terminarJoystick() {
  st.joystickActivo = false;
  st.joystickX = 0;
  st.joystickY = 0;
  joystickKnob.style.transform = 'translate(0, 0)';
  joystickPointerId = null;
}

joystickEl.addEventListener('touchstart', iniciarJoystick, { passive: false });
joystickEl.addEventListener('touchmove', e => {
  e.preventDefault();
  if (!st.joystickActivo) return;
  const touch = Array.from(e.touches).find(t => t.identifier === joystickPointerId) || e.touches[0];
  if (touch) moverJoystick(touch.clientX, touch.clientY);
}, { passive: false });
joystickEl.addEventListener('touchend', e => { e.preventDefault(); terminarJoystick(); }, { passive: false });
joystickEl.addEventListener('touchcancel', terminarJoystick);
joystickEl.addEventListener('mousedown', iniciarJoystick);
document.addEventListener('mousemove', e => { if (st.joystickActivo) moverJoystick(e.clientX, e.clientY); });
document.addEventListener('mouseup', () => { if (st.joystickActivo) terminarJoystick(); });

const btnDisparo = document.getElementById('btnDisparo');
btnDisparo.addEventListener('click', disparar);
btnDisparo.addEventListener('touchstart', e => { e.preventDefault(); disparar(); }, { passive: false });

document.querySelectorAll('#toggleMusica .toggle-btn').forEach(b => {
  b.onclick = () => {
    document.querySelectorAll('#toggleMusica .toggle-btn').forEach(x => x.classList.remove('activo'));
    b.classList.add('activo');
    st.musicaOn = b.dataset.v === 'on';
    if (st.musicaOn && st.sonidoOn) iniciarMusica();
    else detenerMusica();
    sfxClick();
  };
});

function toggleSound() {
  st.sonidoOn = !st.sonidoOn;
  document.getElementById('btnSound').classList.toggle('off', !st.sonidoOn);
  document.getElementById('btnSound').textContent = st.sonidoOn ? '🔊' : '🔇';
  if (st.sonidoOn) {
    initAudio();
    if (st.musicaOn) iniciarMusica();
    sfxClick();
  } else {
    detenerMusica();
  }
}

function togglePausa() {
  if (!st.on) return;
  st.pausado = !st.pausado;
  document.getElementById('overlayPausa').classList.toggle('on', st.pausado);
  if (!st.pausado) ultT = performance.now();
}

// ============================================================
// DISPARO
// ============================================================
function disparar() {
  if (!st.puedeDisparar || !st.jefeActivo) return;
  if (st.cooldownDisparo > 0) return;
  st.cooldownDisparo = 5;
  st.balasJugador.push({
    x: st.avion.x + 30,
    y: st.avion.y,
    vx: 16,
    vy: 0,
    radio: 6
  });
  sfxDisparo();
  crearParticulas(st.avion.x + 30, st.avion.y, '#ffcc00', 4);
}

// ============================================================
// INICIO
// ============================================================
function iniciar() {
  initAudio();
  document.getElementById('overlayIni').classList.add('oculto');
  ajustar();

  st.on = true; st.pausado = false;
  st.vidas = 3; st.pts = 0; st.combo = 0; st.comboMax = 0;
  st.vel = 60; st.velMax = 60; st.velObjetivo = 60;
  st.tiempo = 0;
  st.obstaculos = []; st.potenciadores = []; st.particulas = [];
  st.balasJugador = [];
  st.cooldownDisparo = 0;
  st.puedeDisparar = false;
  st.spawnObs = 0; st.spawnPot = 0; st.pregIdx = 0;
  st.pregRonda = [...preguntas].sort(() => Math.random() - 0.5);
  st.shake = 0; st.escudos = 0; st.escudosTotal = 0; st.invulnerable = 0;
  st.jefe = null; st.jefeActivo = false; 
  st.proximoJefeEn = 1500; // 25 segundos a 60fps
  st.jefesDerrotados = 0;
  st.avisoJefeMostrado = false;
  st.joystickActivo = false; st.joystickX = 0; st.joystickY = 0;

  spritesContainer.innerHTML = '';

  st.avion.x = 160;
  st.avion.y = H * 0.5;

  if (spritesDisponibles.avion !== false) {
    const el = crearImgSprite(RUTAS_SPRITES.avion);
    spritesContainer.appendChild(el);
    st.avion.el = el;
  }

  if (esTactil) {
    joystickEl.classList.add('on');
  }

  document.getElementById('stEscudo').style.display = 'none';
  document.getElementById('stMunicion').style.display = 'none';
  document.getElementById('stRecord').textContent = '🏆 ' + st.record;
  document.getElementById('bossBar').classList.remove('on');
  btnDisparo.classList.remove('on');
  actualizarHUDLogros();

  if (st.musicaOn && st.sonidoOn) iniciarMusica();

  actualizarHUD();
  requestAnimationFrame(loop);
}

// ============================================================
// LOOP
// ============================================================
let ultT = 0;
function loop(t) {
  if (!st.on) return;
  const dt = Math.min(2, (t - ultT) / 16.67);
  ultT = t;
  st.tiempo += dt;
  st.contadorGiro += dt;
  if (!st.pausado) actualizar(dt);
  dibujar();
  sincronizarSprites();
  requestAnimationFrame(loop);
}

// ============================================================
// SINCRONIZAR SPRITES
// ============================================================
function sincronizarSprites() {
  if (st.avion.el) {
    const m = st.avion;
    const leftPx = (m.x - m.ancho * 0.8) * escalaX;
    const topPx = (m.y - m.alto * 0.8) * escalaY;
    const wPx = m.ancho * 1.6 * escalaX;
    const hPx = m.alto * 1.6 * escalaY;
    const el = st.avion.el;
    el.style.left = leftPx + 'px';
    el.style.top = topPx + 'px';
    el.style.width = wPx + 'px';
    el.style.height = hPx + 'px';
    el.style.transform = 'scaleX(1)';
    el.style.opacity = (st.invulnerable > 0 && Math.floor(st.tiempo / 5) % 2 === 0) ? '0.3' : '1';
  }

  st.obstaculos.forEach(o => {
    if (o.el) {
      const leftPx = (o.x - o.ancho * 0.6) * escalaX;
      const topPx = (o.y - o.alto * 0.6) * escalaY;
      const wPx = o.ancho * 1.2 * escalaX;
      const hPx = o.alto * 1.2 * escalaY;
      o.el.style.left = leftPx + 'px';
      o.el.style.top = topPx + 'px';
      o.el.style.width = wPx + 'px';
      o.el.style.height = hPx + 'px';
      o.el.style.transform = `rotate(${Math.sin(o.rot) * 6}deg)`;
    }
  });
}

// ============================================================
// ACTUALIZAR
// ============================================================
function actualizar(dt) {
  st.velObjetivo = Math.min(st.velMaxAbs, 60 + st.tiempo * 0.02 + st.combo * 1.5);
  if (st.vel < st.velObjetivo) st.vel += 0.08 * dt;
  else if (st.vel > st.velObjetivo) st.vel -= 0.5 * dt;
  st.velMax = Math.max(st.velMax, st.vel);

  if (st.vel >= st.velMaxAbs && !logrosDesbloqueados.includes('vel_max')) desbloquearLogro('vel_max');
  if (st.vel >= 150 && !logrosDesbloqueados.includes('sin_miedo')) desbloquearLogro('sin_miedo');

  if (st.cooldownDisparo > 0) st.cooldownDisparo -= dt;

  const VEL_MOV = 6;
  let dx = 0, dy = 0;

  if (st.avion.izquierda) dx -= 1;
  if (st.avion.derecha) dx += 1;
  if (st.avion.subiendo) dy -= 1;
  if (st.avion.bajando) dy += 1;

  if (st.joystickActivo) {
    dx = st.joystickX;
    dy = st.joystickY;
  }

  if (Math.abs(dx) > 0 && Math.abs(dy) > 0 && !st.joystickActivo) {
    const f = 1 / Math.sqrt(2);
    dx *= f;
    dy *= f;
  }

  st.avion.x += dx * VEL_MOV * dt;
  st.avion.y += dy * VEL_MOV * dt;

  st.avion.x = Math.max(60, Math.min(W - 60, st.avion.x));
  st.avion.y = Math.max(120, Math.min(H - 40, st.avion.y));

  if (st.invulnerable > 0) st.invulnerable -= dt;

  const scrollVel = (st.vel / 60);

  st.nubes.forEach(n => { n.x -= n.v * scrollVel * dt; if (n.x < -150) { n.x = W + 100; n.y = 60 + Math.random() * 300; } });
  st.islas.forEach(is => { is.x -= is.v * scrollVel * dt; if (is.x < -150) is.x = W + 150; });
  st.pajaros.forEach(p => { p.x -= p.v * scrollVel * dt; if (p.x < -80) { p.x = W + 80; p.y = 60 + Math.random() * 120; } });
  st.mundoScroll += scrollVel * dt;

  // ===== APARICIÓN DEL JEFE (por tiempo) =====
  if (!st.jefeActivo && st.tiempo >= st.proximoJefeEn) spawnJefe();
  
  // Aviso previo 3 segundos antes
  if (!st.jefeActivo && !st.avisoJefeMostrado && st.tiempo >= st.proximoJefeEn - 180) {
    st.avisoJefeMostrado = true;
    mostrarAviso('⚠️ ¡JEFE EN 3 SEG!', 'jefe');
  }

  if (!st.jefeActivo) {
    st.spawnObs += dt;
    const frecAct = Math.max(30, st.frecObs - st.vel * 0.1);
    if (st.spawnObs >= frecAct) { st.spawnObs = 0; spawnEnemigo(); }
    st.spawnPot += dt;
    const frecPotAct = Math.max(100, st.frecPot - st.vel * 0.05);
    if (st.spawnPot >= frecPotAct) { st.spawnPot = 0; spawnPotenciador(); }
  }

  st.obstaculos = st.obstaculos.filter(o => {
    o.x -= (3.5 * o.velocidadX) * scrollVel * dt;
    o.rot = (o.rot || 0) + 0.02 * dt;
    if (o.x < -o.ancho) {
      if (o.el) o.el.remove();
      return false;
    }
    if (colisionaRect(st.avion, o)) {
      if (o.el) o.el.remove();
      chocar(o);
      return false;
    }
    return true;
  });

  st.potenciadores = st.potenciadores.filter(p => {
    p.x -= 3.5 * scrollVel * dt;
    p.rot += 0.06 * dt;
    if (p.x < -60) return false;
    if (colisionaCirc(st.avion, p)) { agarrarPotenciador(p); return false; }
    return true;
  });

  st.balasJugador = st.balasJugador.filter(b => {
    b.x += b.vx * dt;
    b.y += b.vy * dt;
    if (b.x > W + 30) return false;

    if (st.jefeActivo && st.jefe) {
      const bdx = b.x - st.jefe.x;
      const bdy = b.y - st.jefe.y;
      if (Math.sqrt(bdx*bdx + bdy*bdy) < 70) {
        st.jefe.vidas -= 1.5;
        document.getElementById('bossFill').style.width = Math.max(0, (st.jefe.vidas / st.jefe.vidasMax) * 100) + '%';
        sfxImpacto();
        crearParticulas(b.x, b.y, '#ffcc00', 6);
        if (st.jefe.vidas <= 0) derrotarJefe();
        return false;
      }
    }
    for (let i = 0; i < st.obstaculos.length; i++) {
      const o = st.obstaculos[i];
      const bdx = b.x - o.x;
      const bdy = b.y - o.y;
      if (Math.sqrt(bdx*bdx + bdy*bdy) < o.ancho * 0.5) {
        sfxImpacto();
        crearParticulas(b.x, b.y, '#ffcc00', 6);
        if (o.el) o.el.remove();
        st.obstaculos.splice(i, 1);
        return false;
      }
    }
    return true;
  });

  if (st.jefeActivo && st.jefe) actualizarJefe(dt);

  st.particulas.forEach(p => { p.x += p.vx*dt; p.y += p.vy*dt; p.vy += 0.2*dt; p.vida -= dt; });
  st.particulas = st.particulas.filter(p => p.vida > 0);

  if (st.shake > 0) st.shake -= dt;

  // Puntos más rápidos para que sea dinámico
  st.pts += Math.floor(st.vel / 30 * dt);
  actualizarHUD();

  if (st.pts >= 100 && !logrosDesbloqueados.includes('pts_100')) desbloquearLogro('pts_100');
  if (st.pts >= 500 && !logrosDesbloqueados.includes('pts_500')) desbloquearLogro('pts_500');
  if (st.pts >= 1000 && !logrosDesbloqueados.includes('pts_1000')) desbloquearLogro('pts_1000');
  if (st.tiempo > 7200 && !logrosDesbloqueados.includes('veterano')) desbloquearLogro('veterano');
}

function colisionaRect(avion, obj) {
  const mx = avion.x - avion.ancho * 0.35;
  const my = avion.y - avion.alto * 0.3;
  const mw = avion.ancho * 0.7;
  const mh = avion.alto * 0.6;
  const ox = obj.x - obj.ancho * 0.4;
  const oy = obj.y - obj.alto * 0.4;
  const ow = obj.ancho * 0.8;
  const oh = obj.alto * 0.8;
  return mx < ox + ow && mx + mw > ox && my < oy + oh && my + mh > oy;
}

function colisionaCirc(avion, obj) {
  const dx = obj.x - avion.x;
  const dy = obj.y - avion.y;
  return Math.sqrt(dx * dx + dy * dy) < 25 + 30;
}

// ============================================================
// SPAWNS
// ============================================================
function spawnEnemigo() {
  let e;
  const r = Math.random();
  if (r < 0.45) e = enemigos[0];
  else if (r < 0.85) e = enemigos[1];
  else e = enemigos[2];

  const zonaTop = 130;
  const zonaBot = H - 50;
  const rango = zonaBot - zonaTop;
  const franja = Math.floor(Math.random() * 5);
  const y = zonaTop + (franja + 0.5) * (rango / 5) + (Math.random() - 0.5) * (rango / 10);

  const obj = {
    x: W + e.ancho, y: y,
    ancho: e.ancho, alto: e.alto,
    spriteKey: e.spriteKey, tipo: e.tipo,
    color: e.color, nombre: e.nombre, rot: 0,
    velocidadX: e.velocidadX,
    el: null
  };

  const ruta = RUTAS_SPRITES[e.spriteKey];
  if (ruta && spritesDisponibles[e.spriteKey] !== false) {
    const el = crearImgSprite(ruta);
    spritesContainer.appendChild(el);
    obj.el = el;
  }

  st.obstaculos.push(obj);
}

function spawnPotenciador() {
  const pu = powerUps[Math.floor(Math.random() * powerUps.length)];
  st.potenciadores.push({
    x: W + 50, y: 130 + Math.random() * (H - 180),
    emoji: pu.emoji, tipo: pu.tipo,
    color: pu.color, nombre: pu.nombre,
    radio: 32, rot: 0
  });
}

// ============================================================
// JEFE
// ============================================================
function spawnJefe() {
  st.jefeActivo = true;
  st.puedeDisparar = true;
  // Nivel corregido: mínimo 1
  const nivel = Math.max(1, Math.floor(st.pts / 2000) + 1);
  const vidasMax = 300 + (nivel - 1) * 150;
  st.jefe = {
    x: W + 200, y: H / 2,
    ancho: 170, alto: 150,
    vidas: vidasMax, vidasMax: vidasMax,
    tiempoPatron: 0, proximoAtaqueEn: 90,
    proyectiles: [], fase: 1
  };
  document.getElementById('bossNombre').textContent = 'JEFE NIVEL ' + nivel;
  document.getElementById('bossBar').classList.add('on');
  document.getElementById('bossFill').style.width = '100%';
  btnDisparo.classList.add('on');
  document.getElementById('stMunicion').style.display = 'flex';
  mostrarAviso('👹 ¡DISPARÁ CON 🔫!', 'jefe');
  sfxJefe();
  flash('#ff4466', 0.6);
}

function actualizarJefe(dt) {
  const j = st.jefe;
  if (!j) return;
  j.tiempoPatron += dt;
  if (j.x > W - 200) j.x -= 3 * dt;
  else {
    j.x = W - 200 + Math.sin(j.tiempoPatron * 0.02) * 60;
    j.y = H / 2 + Math.sin(j.tiempoPatron * 0.03) * (H * 0.25);
  }
  j.proximoAtaqueEn -= dt;
  if (j.proximoAtaqueEn <= 0) {
    atacarJefe();
    j.proximoAtaqueEn = Math.max(30, 90 - Math.floor(st.pts / 2000) * 10);
  }
  j.proyectiles = j.proyectiles.filter(p => {
    p.x += p.vx * dt; p.y += p.vy * dt; p.rot += 0.15 * dt;
    if (p.x < -60 || p.x > W + 60 || p.y < -60 || p.y > H + 60) return false;
    const pdx = p.x - st.avion.x;
    const pdy = p.y - st.avion.y;
    if (Math.sqrt(pdx*pdx + pdy*pdy) < p.radio + 25) { chocar({ ancho: 0, alto: 0 }); return false; }
    return true;
  });
  const dx = j.x - st.avion.x;
  const dy = j.y - st.avion.y;
  if (Math.sqrt(dx*dx + dy*dy) < 90) chocar({ ancho: 0, alto: 0 });
}

function atacarJefe() {
  const j = st.jefe;
  if (!j) return;
  const tipo = Math.floor(Math.random() * 3);
  if (tipo === 0) {
    for (let i = 0; i < 5; i++) {
      const ang = Math.PI + (i - 2) * 0.25;
      j.proyectiles.push({
        x: j.x - 60, y: j.y,
        vx: Math.cos(ang) * 5, vy: Math.sin(ang) * 5,
        radio: 14, emoji: '💀', color: '#ff4466', rot: 0
      });
    }
  } else if (tipo === 1) {
    const dx = st.avion.x - j.x;
    const dy = st.avion.y - j.y;
    const ang = Math.atan2(dy, dx);
    for (let i = 0; i < 3; i++) {
      setTimeout(() => {
        if (st.jefeActivo && st.jefe) {
          st.jefe.proyectiles.push({
            x: st.jefe.x - 60, y: st.jefe.y,
            vx: Math.cos(ang) * 7, vy: Math.sin(ang) * 7,
            radio: 12, emoji: '🦠', color: '#22c55e', rot: 0
          });
        }
      }, i * 120);
    }
  } else {
    for (let i = 0; i < 8; i++) {
      const ang = (i / 8) * Math.PI * 2;
      j.proyectiles.push({
        x: j.x, y: j.y,
        vx: Math.cos(ang) * 4, vy: Math.sin(ang) * 4,
        radio: 12, emoji: '⚠️', color: '#ffb000', rot: 0
      });
    }
  }
}

function derrotarJefe() {
  for (let i = 0; i < 8; i++) {
    setTimeout(() => {
      crearParticulas(
        st.jefe.x + (Math.random() - 0.5) * 150,
        st.jefe.y + (Math.random() - 0.5) * 150,
        ['#ff4466', '#ffb000', '#ffcc00'][i % 3], 20
      );
    }, i * 100);
  }
  flash('#ffcc00', 0.6);
  sfxTurbo();
  st.pts += 500;
  st.jefesDerrotados++;
  // Siguiente jefe: 25 segundos después
  st.proximoJefeEn = st.tiempo + 1500;
  st.avisoJefeMostrado = false;
  st.jefeActivo = false;
  st.jefe = null;
  st.puedeDisparar = false;
  document.getElementById('bossBar').classList.remove('on');
  btnDisparo.classList.remove('on');
  document.getElementById('stMunicion').style.display = 'none';
  mostrarAviso('👹 ¡JEFE DERROTADO! +500', 'turbo');
  desbloquearLogro('cazador');
}

// ============================================================
// POTENCIADOR
// ============================================================
function agarrarPotenciador(p) {
  if (p.tipo === 'turbo') {
    abrirPregunta();
  } else if (p.tipo === 'escudo') {
    st.escudos = Math.min(3, st.escudos + 1);
    st.escudosTotal++;
    mostrarAviso('🛡️ ¡ESCUDO!', 'escudo');
    sfxEscudo();
    flash('#00d4ff', 0.4);
    document.getElementById('stEscudo').style.display = 'flex';
    crearParticulas(p.x, p.y, '#00d4ff', 20);
    if (st.escudosTotal >= 3 && !logrosDesbloqueados.includes('escudero')) desbloquearLogro('escudero');
  }
  actualizarHUD();
}

// ============================================================
// CHOQUE
// ============================================================
function chocar(obj) {
  if (st.escudos > 0) {
    st.escudos--;
    st.invulnerable = 60;
    mostrarAviso('🛡️ ¡ESCUDO SALVÓ!', 'escudo');
    sfxEscudo();
    flash('#00d4ff', 0.5);
    crearParticulas(st.avion.x, st.avion.y, '#00d4ff', 25);
    if (st.escudos === 0) document.getElementById('stEscudo').style.display = 'none';
    actualizarHUD();
    return;
  }
  if (st.invulnerable > 0) return;
  st.vidas--;
  st.combo = 0;
  st.shake = 20;
  st.vel = Math.max(st.velMin, st.vel - 20);
  st.invulnerable = 60;
  flash('#ff4466', 0.5);
  mostrarAviso('💥 ¡BOOM!', 'freno');
  sfxChocar();
  crearParticulas(st.avion.x, st.avion.y, '#ffcc00', 25);
  actualizarHUD();
  if (st.vidas <= 0) terminar();
}

// ============================================================
// PREGUNTA
// ============================================================
let timerP = null;
let tiempoP = 12;

function abrirPregunta() {
  st.pausado = true;
  st.particulas = [];
  const preg = st.pregRonda[st.pregIdx % st.pregRonda.length];
  st.pregIdx++;
  preguntasTotales++;
  localStorage.setItem('cyberpilot_preguntas', preguntasTotales);
  if (preguntasTotales >= 20 && !logrosDesbloqueados.includes('sabio')) desbloquearLogro('sabio');

  document.getElementById('pregTexto').textContent = preg.q;
  const ops = document.getElementById('opciones');
  ops.innerHTML = '';
  preg.ops.forEach((op, i) => {
    const btn = document.createElement('button');
    btn.className = 'opcion';
    btn.innerHTML = `<span class="letra">${String.fromCharCode(65+i)}</span> ${op}`;
    btn.onclick = () => responder(i, preg);
    ops.appendChild(btn);
  });
  document.getElementById('resultado').className = 'resultado';
  document.getElementById('explicacion').className = 'explicacion';
  document.getElementById('tagTipo').textContent = '❤️ VIDA';
  document.getElementById('tagTipo').style.background = '#ff4466';
  document.getElementById('tagTipo').style.color = '#fff';
  document.getElementById('overlayPregunta').classList.add('on');

  tiempoP = 12;
  document.getElementById('timerP').textContent = `⏱ ${tiempoP}`;
  document.getElementById('timerP').classList.remove('peligro');
  if (timerP) clearInterval(timerP);
  timerP = setInterval(() => {
    tiempoP--;
    document.getElementById('timerP').textContent = `⏱ ${tiempoP}`;
    if (tiempoP <= 4) document.getElementById('timerP').classList.add('peligro');
    if (tiempoP <= 0) { clearInterval(timerP); responder(-1, preg); }
  }, 1000);
}

function responder(idx, preg) {
  if (timerP) clearInterval(timerP);
  const opciones = document.querySelectorAll('#opciones .opcion');
  opciones.forEach(o => o.disabled = true);
  opciones[preg.ok].classList.add('ok');
  if (idx !== -1 && idx !== preg.ok) opciones[idx].classList.add('no');

  const correcto = idx === preg.ok;
  document.getElementById('explicacion').innerHTML = `📘 ${preg.exp}`;
  document.getElementById('explicacion').classList.add('on');
  const res = document.getElementById('resultado');

  if (correcto) {
    if (st.vidas < 5) {
      st.vidas++;
      mostrarAviso('❤️ ¡+1 VIDA!', 'vida');
      sfxVida();
      flash('#ff4466', 0.4);
      if (st.vidas >= 5 && !logrosDesbloqueados.includes('revividor')) desbloquearLogro('revividor');
    } else {
      st.pts += 100;
      mostrarAviso('❤️ +100 PTS', 'vida');
      sfxVida();
    }
    st.combo++;
    st.comboMax = Math.max(st.comboMax, st.combo);
    res.className = 'resultado ok on';
    res.textContent = `✅ ¡BIEN! +1 ❤️`;
    if (!logrosDesbloqueados.includes('primer_acierto')) desbloquearLogro('primer_acierto');
    if (st.combo >= 5 && !logrosDesbloqueados.includes('racha_5')) desbloquearLogro('racha_5');
    setTimeout(() => cerrarPregunta(), 1400);
  } else {
    st.combo = 0;
    res.className = 'resultado no on';
    res.textContent = idx === -1 ? '⏱ ¡TIEMPO! +ataque' : '❌ ¡MAL! +ataque';
    flash('#ff4466', 0.5);
    sfxFreno();
    if (st.jefeActivo && st.jefe) {
      for (let i = 0; i < 2; i++) {
        setTimeout(() => {
          if (st.jefeActivo && st.jefe) atacarJefe();
        }, i * 300);
      }
      mostrarAviso('⚠️ EL JEFE ATACA MÁS', 'freno');
    }
    setTimeout(() => cerrarPregunta(), 1800);
  }
  actualizarHUD();
}

function cerrarPregunta() {
  document.getElementById('overlayPregunta').classList.remove('on');
  st.pausado = false;
  ultT = performance.now();
}

// ============================================================
// AVISOS
// ============================================================
let avisoTimer = null;
function mostrarAviso(txt, tipo) {
  const el = document.getElementById('aviso');
  el.textContent = txt;
  el.className = 'aviso ' + (tipo || '');
  el.classList.add('on');
  if (avisoTimer) clearTimeout(avisoTimer);
  avisoTimer = setTimeout(() => el.classList.remove('on'), 1400);
}

function crearParticulas(x, y, color, cant) {
  for (let i = 0; i < cant; i++) {
    const ang = Math.random() * Math.PI * 2;
    const v = 1 + Math.random() * 4;
    st.particulas.push({
      x, y,
      vx: Math.cos(ang) * v - 2,
      vy: Math.sin(ang) * v,
      color, t: 3 + Math.random() * 3,
      vida: 20 + Math.random() * 15
    });
  }
}

function flash(color, op) {
  const el = document.createElement('div');
  el.className = 'flash';
  el.style.background = color;
  el.style.opacity = op;
  document.querySelector('.panel').appendChild(el);
  setTimeout(() => el.remove(), 400);
}

// ============================================================
// HUD
// ============================================================
function actualizarHUD() {
  document.getElementById('stVida').textContent = '❤️'.repeat(Math.max(0, st.vidas)) || '💔';
  document.getElementById('stVida').classList.toggle('peligro', st.vidas <= 1);
  document.getElementById('stPts').textContent = st.pts;
  document.getElementById('stCombo').textContent = '🔥 x' + st.combo;
  document.getElementById('stVel').textContent = Math.round(st.vel);
  document.getElementById('stPreg').textContent = st.pregIdx;
  document.getElementById('stBalas').textContent = st.balasJugador.length;
  document.getElementById('stRecord').textContent = '🏆 ' + Math.max(st.record, st.pts);
  document.getElementById('velFill').style.width = Math.min(100, (st.vel / st.velMaxAbs) * 100) + '%';
  const escEl = document.getElementById('stEscudo');
  if (st.escudos > 0) {
    escEl.style.display = 'flex';
    escEl.textContent = '🛡️ x' + st.escudos;
  } else {
    escEl.style.display = 'none';
  }
}

// ============================================================
// DIBUJAR
// ============================================================
function dibujar() {
  ctx.save();
  if (st.shake > 0) ctx.translate((Math.random()-0.5)*10, (Math.random()-0.5)*10);

  const grad = ctx.createLinearGradient(0, 0, 0, H);
  if (st.jefeActivo) {
    grad.addColorStop(0, '#4a0a1a');
    grad.addColorStop(0.4, '#6a1530');
    grad.addColorStop(0.7, '#8a2535');
    grad.addColorStop(1, '#4a0a15');
  } else {
    grad.addColorStop(0, '#87ceeb');
    grad.addColorStop(0.4, '#b8e0f0');
    grad.addColorStop(0.7, '#f5d5a8');
    grad.addColorStop(1, '#f0b878');
  }
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, W, H);

  if (!st.jefeActivo) {
    ctx.save();
    ctx.shadowBlur = 40; ctx.shadowColor = '#ffcc00';
    ctx.font = '70px serif'; ctx.textAlign = 'center';
    ctx.fillText('☀️', W - 100, 70);
    ctx.restore();
  } else {
    ctx.save();
    ctx.shadowBlur = 50; ctx.shadowColor = '#ff4466';
    ctx.font = '70px serif'; ctx.textAlign = 'center';
    ctx.fillText('🌑', W - 100, 70);
    ctx.restore();
  }

  st.nubes.forEach(n => {
    ctx.save();
    ctx.globalAlpha = st.jefeActivo ? 0.4 : 0.9;
    ctx.font = (60 * n.escala) + 'px serif';
    ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(n.emoji, n.x, n.y);
    ctx.restore();
  });
  st.pajaros.forEach(p => { ctx.font = '30px serif'; ctx.textAlign = 'center'; ctx.fillText(p.emoji, p.x, p.y); });
  st.islas.forEach(is => {
    ctx.save(); ctx.globalAlpha = 0.5;
    ctx.font = '90px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'bottom';
    ctx.fillText(is.emoji, is.x, H - 20);
    ctx.restore();
  });

  ctx.strokeStyle = 'rgba(42,21,48,0.06)';
  ctx.lineWidth = 1;
  const step = 80;
  const off = (st.mundoScroll * 2) % step;
  for (let x = -off; x < W; x += step) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }

  ctx.strokeStyle = 'rgba(42,21,48,0.4)';
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 8]);
  ctx.beginPath(); ctx.moveTo(0, 110); ctx.lineTo(W, 110); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, H - 10); ctx.lineTo(W, H - 10); ctx.stroke();
  ctx.setLineDash([]);

  st.potenciadores.forEach(p => dibujarPotenciador(p));

  st.balasJugador.forEach(b => {
    ctx.save();
    ctx.shadowBlur = 15; ctx.shadowColor = '#ffcc00';
    ctx.fillStyle = '#ffcc00';
    ctx.beginPath();
    ctx.ellipse(b.x, b.y, b.radio * 0.7, b.radio * 1.6, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.ellipse(b.x, b.y - 2, b.radio * 0.3, b.radio * 0.7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });

  if (st.jefeActivo && st.jefe) {
    dibujarJefe();
    st.jefe.proyectiles.forEach(p => dibujarProyectilJefe(p));
  }

  st.particulas.forEach(p => {
    ctx.globalAlpha = Math.max(0, p.vida / 30);
    ctx.fillStyle = p.color;
    ctx.beginPath(); ctx.arc(p.x, p.y, p.t, 0, Math.PI * 2); ctx.fill();
  });
  ctx.globalAlpha = 1;

  if (st.escudos > 0) {
    ctx.save();
    ctx.translate(st.avion.x, st.avion.y);
    ctx.shadowBlur = 25; ctx.shadowColor = '#00d4ff';
    ctx.strokeStyle = 'rgba(0, 212, 255, ' + (0.6 + Math.sin(st.tiempo * 0.2) * 0.3) + ')';
    ctx.lineWidth = 4;
    ctx.beginPath(); ctx.arc(0, 0, st.avion.ancho * 0.9, 0, Math.PI * 2); ctx.stroke();
    ctx.restore();
  }

  ctx.restore();
}

function dibujarJefe() {
  const j = st.jefe;
  ctx.save();
  ctx.translate(j.x, j.y);
  const pulso = 1 + Math.sin(st.tiempo * 0.15) * 0.1;
  ctx.shadowBlur = 50; ctx.shadowColor = '#ff4466';
  ctx.beginPath();
  ctx.arc(0, 0, 85 * pulso, 0, Math.PI * 2);
  const grad = ctx.createRadialGradient(0, 0, 10, 0, 0, 85);
  grad.addColorStop(0, '#ff4466'); grad.addColorStop(1, '#8a1530');
  ctx.fillStyle = grad; ctx.fill();
  ctx.strokeStyle = '#2a1530'; ctx.lineWidth = 5; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.arc(-20, -25, 25, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = '85px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText('💀', 0, 5);
  ctx.font = 'bold 14px Bangers, sans-serif';
  ctx.fillStyle = '#ffcc00'; ctx.strokeStyle = '#2a1530'; ctx.lineWidth = 4;
  ctx.strokeText('¡DISPARÁ!', 0, -100); ctx.fillText('¡DISPARÁ!', 0, -100);
  ctx.restore();
}

function dibujarProyectilJefe(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  ctx.rotate(p.rot);
  ctx.shadowBlur = 20; ctx.shadowColor = p.color;
  ctx.fillStyle = p.color;
  ctx.beginPath(); ctx.arc(0, 0, p.radio, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2a1530'; ctx.lineWidth = 3; ctx.stroke();
  ctx.shadowBlur = 0;
  ctx.font = '18px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(p.emoji, 0, 2);
  ctx.restore();
}

function dibujarPotenciador(p) {
  ctx.save();
  ctx.translate(p.x, p.y);
  const pulso = 1 + Math.sin(st.tiempo * 0.15) * 0.2;
  ctx.shadowBlur = 30; ctx.shadowColor = p.color;
  ctx.fillStyle = p.color;
  ctx.beginPath(); ctx.arc(0, 0, p.radio * pulso, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#2a1530'; ctx.lineWidth = 4; ctx.stroke();
  ctx.fillStyle = 'rgba(255,255,255,0.4)';
  ctx.beginPath(); ctx.arc(-p.radio * 0.3, -p.radio * 0.3, p.radio * 0.4, 0, Math.PI * 2); ctx.fill();
  ctx.shadowBlur = 0;
  ctx.font = '36px serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
  ctx.fillText(p.emoji, 0, 3);
  ctx.font = 'bold 12px Bangers, sans-serif';
  ctx.fillStyle = '#2a1530'; ctx.strokeStyle = p.color; ctx.lineWidth = 3;
  ctx.strokeText(p.nombre, 0, p.radio + 16); ctx.fillText(p.nombre, 0, p.radio + 16);
  ctx.restore();
}

// ============================================================
// FIN
// ============================================================
function terminar() {
  st.on = false;
  if (timerP) clearInterval(timerP);
  detenerMusica();
  sfxDerrota();
  joystickEl.classList.remove('on');

  const esNuevoRecord = st.pts > st.record;
  if (esNuevoRecord) {
    st.record = st.pts;
    localStorage.setItem('cyberpilot_record', st.record);
  }

  document.getElementById('finPts').textContent = st.pts;
  document.getElementById('finAciertos').textContent = st.pregIdx;
  document.getElementById('finVel').textContent = Math.round(st.velMax);
  document.getElementById('finRecord').textContent = esNuevoRecord ? '🏆 ¡NUEVO RÉCORD!' : '🏆 Récord: ' + st.record;
  document.getElementById('finLogros').textContent = '🏅 Logros: ' + logrosDesbloqueados.length + '/' + LOGROS.length;

  const rango = st.pts >= 2000 ? '🏆 AS DEL CIELO' :
                st.pts >= 1200 ? '🎖 PILOTO EXPERTO' :
                st.pts >= 600  ? '📘 PILOTO APRENDIZ' : '🌱 PRINCIPIANTE';
  document.getElementById('finRango').textContent = rango;
  document.getElementById('finIco').textContent = st.pts >= 1200 ? '🏆' : st.pts >= 600 ? '🎖' : '✈️';
  document.getElementById('overlayFin').classList.remove('oculto');

  setTimeout(() => {
    document.getElementById('overlayFin').classList.add('oculto');
    mostrarLogros(true);
  }, 2500);
}

// ============================================================
// RESIZE
// ============================================================
ajustar();
window.addEventListener('resize', () => {
  ajustar();
  if (st.on) {
    st.avion.x = Math.min(st.avion.x, W - 60);
    st.avion.y = Math.min(st.avion.y, H - 40);
  }
});