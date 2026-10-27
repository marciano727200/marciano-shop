const {
  default: makeWASocket,
  useMultiFileAuthState,
  DisconnectReason,
  Browsers,
  fetchLatestBaileysVersion,
  makeCacheableSignalKeyStore,
  downloadMediaMessage
} = require("@whiskeysockets/baileys");
const pino = require("pino");
const fs = require("fs");
const path = require("path");
const { spawn } = require("child_process");

// 👇 1. PON TU NÚMERO DE WHATSAPP AQUÍ
const PHONE_NUMBER = process.env.PHONE_NUMBER || "5215652033338";

const AUTH_DIR = process.env.AUTH_DIR || path.join(__dirname, "sesion");
const IS_GROUPS_ENABLED = true;

// 👇 2. IMÁGENES DE RESPALDO PARA CADA COMANDO
const imagenes = {
  ".menu": "menu.jpg",
  ".stock": "stock.jpg",
  ".stock2": "stock2.jpg",
  ".stock3": "stock3.jpg",
  ".stock4": "stock4.jpg",
  ".stock5": "stock5.jpg",
  ".stock6": "stock6.jpg",
  ".stock7": "stock7.jpg",
  ".stock8": "stock8.jpg",
  ".stock9": "stock9.jpg",
  ".pago": "pago.jpg"
};

function generarTextoMenu(nombreGrupo) {
  return `✨ *${nombreGrupo}* ✨

AQUI ESTAN LOS COMANDOS PARA LOS SERVICIOS DE ESTE GRUPO.

👽.1🐢(PERFIL O CUENTAS)
👽.2🐢(COD🪖POINTS)
👽.3🐢(FREE💎FIRE)
👽.4🐢(🤖MINECOINS🤖)
👽.5🐢(⏹️ROBLOX⏹️)
👽.6🐢(SEGUIDORES👥&👍+)
👽.7🐢(📄ACTAS📃)
👽.8🐢(BOT PARA TU GRUPO)
👽.9🐢(CREAR STICKER FOTO/GIF .s)
👽.p🐢(PAGOS)
👽.r🐢(CREAR RECIBO DE COMPRA)`;
}

const mensajes = {
  ".hola": `👋 ¡Hola a todos! Espero que se encuentren muy bien. 
¿Les interesa alguno de nuestros servicios?

📌 *Escribe .menu para ver el stock disponible.*`,

  ".1": `☄️ 𝑴-𝑭 𝑺𝑻𝑹𝑬𝑨𝑴𝑰𝑵𝑮 ☄️

🧸 _NETFLIX_
𐙚 Perfil $60
ꕤ Cuenta Completa $250

🔖 _DISNEY_
𐙚 Perfil $25
ꕤ Completa $125

🫆 _HBO MAX_
𐙚 Perfil $10
ꕤ Completa $50

🪼 _PRIME VIDEO_
𐙚 Perfil 1M $10
ꕤ Completa 1M $30
𐙚 Perfil 6M $40
ꕤ Completa 6M $120 (opcional a tu correo)

☄️ _VIX_
𐙚 Perfil 1M $4
𐙚 Perfil Anual $13
𐙚 Completa 1M $20
ꕤ Completa Anual $45

🛵 _FOX ONE_
𐙚 Perfil $30
ꕤ Completa $70

🎀 _CRUNCHYROLL_
𐙚 Perfil $15
ꕤ Completa $70

🎎 _PARAMOUNT_
𐙚 Perfil $10
ꕤ Completa $40

🧧 _UNIVERSAL+_
𐙚 Perfil $10
ꕤ Completa $30

📜 _APPLE TV_
𐙚 Perfil $10
ꕤ Completa $30

🔅 _YOUTUBE PREMIUM_
𐙚 Invitación $25
ꕤ Familiar a tus datos $80

🐸 _SPOTIFY_
𐙚 1M $50
ꕤ 4M $120

🐤 _CANVA_
𐙚 Invitación $35

🤖 _GEMINI_
𐙚 8M $100

🪁 _ADOBE_
𐙚 1M $20
ꕤ 6M $60
ꕤ Anual $100

🥊 _PORNHUB_
𐙚 Cuenta $45

🥌 _APPLE MUSIC_
𐙚 1M $30

✅ *Garantía 25 días mensual, 9 meses anual*
💸 *_Cuentas renovables: hacer pago en el día 25 del servicio para evitar corte del mismo_*

👽 _Agradecemos tu preferencia. Disponibles 24/7 para venta y soporte_`,

  ".2": `COD🪖POINTS

2400 × $450
5000 × $850
7200 × $1200
10800 × $1689
24000 × $4000

⏳ ENTREGA DE 1 A 72 HORAS

> SE REQUIERE ACCESO POR ACTIVISION`,

  ".3": `🐢 𝑫𝑰𝑨𝑴𝑨𝑵𝑻𝑬𝑺 𝟏 𝑽𝑬𝒁 𝑿 𝑰𝑫 🐢
_Mandar ID para verificar_

ꕥ 341 diamantes | $43 MXN
ꕥ 572 diamantes | $74 MXN
ꕥ 1166 diamantes | $130 MXN
ꕥ 2398 diamantes | $235 MXN
ꕥ 6160 diamantes | $535 MXN

☄️ 𝑫𝑰𝑨𝑴𝑨𝑵𝑻𝑬𝑺 𝑰𝑳𝑰𝑴𝑰𝑻𝑨𝑫𝑶𝑺 ☄️

𐙚 572 diamantes | $85 MXN
𐙚 1166 diamantes | $170 MXN
𐙚 2398 diamantes | $295 MXN
𐙚 3564 diamantes | $410 MXN
𐙚 4796 diamantes | $560 MXN
𐙚 6160 diamantes | $685 MXN

🎀 Pase BOOYAH
🔖 Tarjetas semanales y mensuales
🧸 Fragmentos y cajas evolutivas
🥊 Likes para tu perfil de FF
🪁 Nick de color

🫆 _Cualquier otra cantidad de diamantes se cotiza_`,

  ".4": `🤖 𝐌𝐈𝐍𝐄𝐂𝐑𝐀𝐅𝐓 🤖

🔖 _MINECOINS_

M | 320
M | 960+60
M | 1600+120
M | 3200+300
M | 8000+800

📜 _REALM_

BASICO
PLUS

🫆 _Cualquier cantidad de Minecoins está sujeta a cambios de precio por USDT. Pide cotización_`,

  ".5": `🎮 ROBLUX

EL PRECIO Y LAS OFERTAS NO SIEMPRE SON LAS MISMAS.

PREGUNTA Y SE TE COTIZA.`,

  ".6": `𝐒𝐄𝐆𝐔𝐈𝐃𝐎𝐑𝐄𝐒, 𝐋𝐈𝐊𝐄𝐒 𝐘 𝐕𝐈𝐒𝐓𝐀𝐒 𝐏𝐀𝐑𝐀 𝐓𝐔𝐒 𝐑𝐄𝐃𝐄𝐒 𝐒𝐎𝐂𝐈𝐀𝐋𝐄𝐒

📸 *_INSTAGRAM_*
⛓️‍💥 Seguidores
💣 Likes
⛓️‍💥 Comentarios
💣 Compartidas

💡 *_TIKTOK_*
⛓️‍💥 Seguidores
💣 Likes
⛓️‍💥 Vistas
💣 Comentarios

📺 *_FACEBOOK_*
⛓️‍💥 Seguidores
💣 Reacciones
⛓️‍💥 Comentarios
💣 Compartidas

> SI BUSCAS MÁS CANTIDAD, SE MEJORA EL PRECIO DE CUALQUIER SERVICIO`,

  ".7": `📄 *ACTAS DISPONIBLES* 📄

𐙚 NACIMIENTO
𐙚 MATRIMONIO
𐙚 DIVORCIO
𐙚 DEFUNCIÓN

📌 *REQUISITOS:* FOLIO O CURP

> EN ALGUNAS SE OCUPAN MÁS DATOS`,

  ".8": `🤖 *BOT PARA TU GRUPO* 🤖

¿Quieres un bot personalizado como este para atender tu grupo 24/7?

𐙚 Respuestas automáticas con tus precios
𐙚 Menú con imagen y nombre de tu grupo
𐙚 Generador de Stickers para Fotos y Videos/GIFs con .s
𐙚 Activo las 24 horas

> PREGUNTA POR PRECIOS Y DISPONIBILIDAD`,

  ".9": `🖼️ *CREADOR DE STICKERS (.s)* 🖼️

Para convertir cualquier foto, video corto o GIF en sticker:
1. Envía o responde al archivo multimedia con el comando: **.s**
¡Y el bot te devolverá tu sticker al instante!`,

  ".p": `☄️ 𝑴-𝑭 𝑺𝑻𝑹𝑬𝑨𝑴𝑰𝑵𝑮 ☄️

_TRANSFERENCIA_

646180401642427005
STP
Renatta Beltrán

_DEPÓSITO_

2242 1701 82771729
Spin
RENATTA BELTRAN

💸 Envía tu comprobante después de realizar el pago.`
};

let stopping = false;
let reconnectDelay = 2000;
let activeSocket = null;
const logger = pino({ level: "silent" });

const botStartTime = Math.floor(Date.now() / 1000);
const processedMessages = new Set();

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

function extractText(message) {
  if (!message) return "";
  if (message.ephemeralMessage) return extractText(message.ephemeralMessage.message);
  if (message.viewOnceMessage) return extractText(message.viewOnceMessage.message);
  if (message.viewOnceMessageV2) return extractText(message.viewOnceMessageV2.message);
  if (message.documentWithCaptionMessage) return extractText(message.documentWithCaptionMessage.message);

  return (
    message.conversation ||
    message.extendedTextMessage?.text ||
    message.imageMessage?.caption ||
    message.videoMessage?.caption ||
    message.documentMessage?.caption ||
    ""
  );
}

async function crearReciboFFmpeg(fecha, items, total) {
  return new Promise((resolve, reject) => {
    let rutaPlantilla = path.join(__dirname, "plantilla.jpg");
    if (!fs.existsSync(rutaPlantilla)) {
      const alt = path.join(process.cwd(), "plantilla.jpg");
      if (fs.existsSync(alt)) rutaPlantilla = alt;
      else return reject(new Error("No se encontró plantilla.jpg"));
    }

    const id = Date.now();
    const tempTxt = path.join(__dirname, `recibo_${id}.txt`);
    const tempOut = path.join(__dirname, `recibo_${id}.jpg`);

    const lineasTexto = [
      "      RECIBO DE COMPRA",
      `          ${fecha}`,
      "",
      "SERVICIOS:",
      "",
      ...items.map(i => `* ${i.servicio.toUpperCase()} / ${i.poc.toUpperCase()} / $${i.precio}`),
      "",
      `      TOTAL: $${total}`
    ].join("\n");

    fs.writeFileSync(tempTxt, lineasTexto, "utf8");

    let fontSize = 36;
    if (items.length > 6) fontSize = 30;
    if (items.length > 10) fontSize = 24;

    const txtPathEscaped = tempTxt.replace(/\\/g, "/").replace(/:/g, "\\:");
    const filtro = `scale=1020:1479,drawtext=textfile='${txtPathEscaped}':fontcolor=#39ff14:fontsize=${fontSize}:x=85:y=630:line_spacing=16:shadowcolor=black:shadowx=3:shadowy=3`;

    const ffmpeg = spawn("ffmpeg", ["-y", "-i", rutaPlantilla, "-vf", filtro, tempOut]);

    ffmpeg.on("close", code => {
      try {
if (fs.existsSync(tempTxt)) fs.unlinkSync(tempTxt);
        if (code === 0 && fs.existsSync(tempOut)) {
          const imgBuffer = fs.readFileSync(tempOut);
          fs.unlinkSync(tempOut);
          resolve(imgBuffer);
        } else {
          if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
          reject(new Error(`FFmpeg código ${code}`));
        }
      } catch (err) {
        reject(err);
      }
    });

    ffmpeg.on("error", err => {
      try {
        if (fs.existsSync(tempTxt)) fs.unlinkSync(tempTxt);
        if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
      } catch {}
      reject(err);
    });
  });
}

async function crearStickerUniversal(bufferEntrada, esVideoOgif) {
  return new Promise((resolve, reject) => {
    const ext = esVideoOgif ? "mp4" : "jpg";
    const tempIn = path.join(__dirname, `input_${Date.now()}.${ext}`);
    const tempOut = path.join(__dirname, `output_${Date.now()}.webp`);

    fs.writeFileSync(tempIn, bufferEntrada);

    let args = [];
    if (esVideoOgif) {
      args = [
        "-i", tempIn,
        "-t", "6",
        "-vf", "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000,fps=15",
        "-vcodec", "libwebp",
        "-loop", "0",
        "-preset", "default",
        "-an",
        "-vsync", "0",
        tempOut
      ];
    } else {
      args = [
        "-i", tempIn,
        "-vf", "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000",
        "-vcodec", "libwebp",
        "-lossless", "1",
        "-loop", "0",
        "-preset", "default",
        "-an",
        "-vsync", "0",
        tempOut
      ];
    }

    const ffmpeg = spawn("ffmpeg", args);

    ffmpeg.on("close", code => {
      try {
        if (code === 0 && fs.existsSync(tempOut)) {
          const webpBuffer = fs.readFileSync(tempOut);
          if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn);
          if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
          resolve(webpBuffer);
        } else {
          if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn);
          if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
          reject(new Error(`FFmpeg falló con código ${code}`));
        }
      } catch (err) {
        reject(err);
      }
    });

    ffmpeg.on("error", err => {
      try {
        if (fs.existsSync(tempIn)) fs.unlinkSync(tempIn);
        if (fs.existsSync(tempOut)) fs.unlinkSync(tempOut);
      } catch {}
      reject(err);
    });
  });
}

async function enviarHolaConMencion(sock, chat, reply) {
  if (chat.endsWith("@g.us")) {
    try {
      const metadata = await sock.groupMetadata(chat);
      const participantes = metadata.participants || [];
      const mentions = participantes.map(p => p.id);

      await sock.sendMessage(chat, {
        text: reply,
        mentions: mentions
      });
      return;
    } catch (err) {}
  }
  await sock.sendMessage(chat, { text: reply });
}

async function enviarMenuConFotoDeGrupo(sock, chat) {
  let nombreLugar = "👽 M-F STREAMING 👽";
  let urlFotoGrupo = null;

  if (chat.endsWith("@g.us")) {
    try {
      const metadata = await sock.groupMetadata(chat);
      if (metadata?.subject) {
        nombreLugar = metadata.subject;
      }
    } catch (err) {}

    try {
      urlFotoGrupo = await sock.profilePictureUrl(chat, "image");
    } catch {
      urlFotoGrupo = null;
    }
  }

  const textoMenu = generarTextoMenu(nombreLugar);

  if (urlFotoGrupo) {
    try {
      await sock.sendMessage(chat, {
        image: { url: urlFotoGrupo },
        caption: textoMenu
      });
      return;
    } catch (err) {}
  }

  await enviarRespuesta(sock, chat, ".menu", textoMenu);
}

async function enviarRespuesta(sock, chat, command, reply) {
  const imgRef = imagenes[command];

  if (imgRef) {
    try {
      if (imgRef.startsWith("http://") || imgRef.startsWith("https://")) {
        await sock.sendMessage(chat, {
          image: { url: imgRef },
          caption: reply
        });
        return;
      }

      const imgPath = path.isAbsolute(imgRef) ? imgRef : path.join(__dirname, imgRef);
      if (fs.existsSync(imgPath)) {
        await sock.sendMessage(chat, {
          image: fs.readFileSync(imgPath),
          caption: reply
        });
        return;
      }
    } catch (err) {}
  }

  await sock.sendMessage(chat, { text: reply });
}

async function connectLoop() {
  while (!stopping) {
    try {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
      const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR);
      const { version } = await fetchLatestBaileysVersion();

      const sock = makeWASocket({
        version,
        auth: {
          creds: state.creds,
          keys: makeCacheableSignalKeyStore(state.keys, logger)
        },
        printQRInTerminal: false,
        logger,
        browser: Browsers.ubuntu("Chrome"),
        markOnlineOnConnect: true,
        syncFullHistory: false,
        retryRequestDelayMs: 2000
      });

      activeSocket = sock;
      let connectionClosed = false;
      let pairingRequested = false;

      sock.ev.on("creds.update", saveCreds);

      sock.ev.on("connection.update", async update => {
        const { connection, lastDisconnect, qr } = update;

        if ((connection === "connecting" || !!qr) && !sock.authState.creds.registered && !pairingRequested) {
          pairingRequested = true;
          const cleanNumber = PHONE_NUMBER.replace(/[^0-9]/g, "");

          setTimeout(async () => {
            try {
              const code = await sock.requestPairingCode(cleanNumber);
              const formattedCode = code?.match(/.{1,4}/g)?.join("-") || code;
              console.log("\n==========================================");
              console.log(`📲 VINCULA CON EL NÚMERO: ${cleanNumber}`);
              console.log(`🔑 TU CÓDIGO DE WHATSAPP ES: ${formattedCode}`);
              console.log("==========================================\n");
            } catch (err) {}
          }, 3000);
        }

        if (connection === "open") {
          reconnectDelay = 2000;
          console.log("✅ 👽 MARCIANO 👽 conectado a WhatsApp y escuchando mensajes nuevos...");
        }

        if (connection === "close" && !connectionClosed) {
          connectionClosed = true;
          const code = lastDisconnect?.error?.output?.statusCode;
          console.log("Conexión cerrada. Código:", code ?? "desconocido");

          if (code === DisconnectReason.loggedOut) {
            console.error("La sesión cerró sesión en WhatsApp. Borrando carpeta de sesión...");
            try {
              fs.rmSync(AUTH_DIR, { recursive: true, force: true });
            } catch {}
          }
        }
      });

      sock.ev.on("messages.upsert", async ({ messages, type }) => {
        if (type !== "notify") return;

        for (const msg of messages) {
          try {
            if (!msg.message) continue;

            const msgId = msg.key.id;
            const chat = msg.key.remoteJid;
            if (!chat || chat === "status@broadcast") continue;
            if (!IS_GROUPS_ENABLED && chat.endsWith("@g.us")) continue;

            const msgTime = Number(msg.messageTimestamp || 0);
            if (msgTime > 0 && msgTime < botStartTime) continue;

            if (processedMessages.has(msgId)) continue;

            const text = extractText(msg.message);

            const quotedMessage = msg.message?.extendedTextMessage?.contextInfo?.quotedMessage;
            const isQuotedImage = quotedMessage?.imageMessage;
            const isQuotedVideo = quotedMessage?.videoMessage;
            const isDirectImage = msg.message?.imageMessage;
            const isDirectVideo = msg.message?.videoMessage;

            if (text.trim().toLowerCase() === ".s" && (isQuotedImage || isQuotedVideo || isDirectImage || isDirectVideo)) {
              processedMessages.add(msgId);
              console.log(`🖼️🎞️ Creando sticker (Foto/Video/GIF) en ${chat}`);

              let targetMsg = msg;
              if (isQuotedImage || isQuotedVideo) {
                targetMsg = {
                  key: {
                    remoteJid: chat,
                    id: msg.message.extendedTextMessage.contextInfo.stanzaId,
                    participant: msg.message.extendedTextMessage.contextInfo.participant
                  },
                  message: quotedMessage
                };
              }

              const mediaBuffer = await downloadMediaMessage(
                targetMsg,
                "buffer",
                {},
                { logger, reuploadRequest: sock.updateMediaMessage }
              );

              const esVideoOGif = !!(isQuotedVideo || isDirectVideo);
              const stickerBuffer = await crearStickerUniversal(mediaBuffer, esVideoOGif);

              await sock.sendMessage(chat, { sticker: stickerBuffer }, { quoted: msg });
              console.log(`✅ Sticker enviado con éxito en ${chat}`);
              continue;
            }

            if (!text) continue;

            const rawTrimmed = text.trim();
            const command = rawTrimmed.toLowerCase().split(/\s+/)[0];

            // 👇 COMANDO GENERADOR DE RECIBOS (.recibo o .r)
            if (command === ".recibo" || command === ".r") {
              processedMessages.add(msgId);
              const lineas = rawTrimmed
                .split("\n")
                .slice(1)
                .map(l => l.trim())
                .filter(l => l.length > 0);

              if (lineas.length === 0) {
                await sock.sendMessage(
                  chat,
                  {
                    text: `⚠️ *Para crear un recibo escribe .r y abajo cada servicio separado por barras (/):*\n\n.r\nNetflix / Perfil / 60\nDisney / Cuenta / 125`
                  },
                  { quoted: msg }
                );
                continue;
              }

              let total = 0;
              const items = [];

              for (const linea of lineas) {
                const partes = linea.split("/").map(p => p.trim());
                const servicio = partes[0] || "SERVICIO";
                const poc = partes[1] || "P";
                const precioTexto = partes[2] ? partes[2].replace(/[^0-9.]/g, "") : "0";
                const precio = parseFloat(precioTexto) || 0;

                total += precio;
                items.push({ servicio, poc, precio });
              }

              const ahora = new Date(new Date().toLocaleString("en-US", { timeZone: "America/Mexico_City" }));
              const dia = String(ahora.getDate()).padStart(2, "0");
              const mes = String(ahora.getMonth() + 1).padStart(2, "0");
              const anio = ahora.getFullYear();
              const fechaFormateada = `${dia}/${mes}/${anio}`;

              const textoRecibo = `RECIBO DE COMPRA\n\n${fechaFormateada}\n\nSERVICIOS:\n\n${items
                .map(i => `👽${i.servicio.toUpperCase()} / ${i.poc.toUpperCase()} / $${i.precio}`)
                .join("\n")}\n\n𐙚 TOTAL: $${total}`;

              try {
                const imgBuffer = await crearReciboFFmpeg(fechaFormateada, items, total);
                await sock.sendMessage(
                  chat,
                  {
                    image: imgBuffer,
                    caption: textoRecibo
                  },
                  { quoted: msg }
                );
              } catch (err) {
                let rutaPlantilla = path.join(__dirname, "plantilla.jpg");
                if (fs.existsSync(rutaPlantilla)) {
                  await sock.sendMessage(
                    chat,
                    {
image: imgBuffer,
                    caption: textoRecibo
                  },
                  { quoted: msg }
                );
              } catch (err) {
                let rutaPlantilla = path.join(__dirname, "plantilla.jpg");
                if (fs.existsSync(rutaPlantilla)) {
                  await sock.sendMessage(
                    chat,
                    {
                      image: fs.readFileSync(rutaPlantilla),
                      caption: textoRecibo
                    },
                    { quoted: msg }
                  );
                } else {
                  await sock.sendMessage(chat, { text: textoRecibo }, { quoted: msg });
                }
              }
              continue;
            }

            if (command === ".menu") {
              processedMessages.add(msgId);
              await enviarMenuConFotoDeGrupo(sock, chat);
              continue;
            }

            if (command === ".hola") {
              processedMessages.add(msgId);
              await enviarHolaConMencion(sock, chat, mensajes[".hola"]);
              continue;
            }

            const reply = mensajes[command];
            if (!reply) continue;

            processedMessages.add(msgId);
            if (processedMessages.size > 1000) {
              const oldest = processedMessages.values().next().value;
              processedMessages.delete(oldest);
            }

            await enviarRespuesta(sock, chat, command, reply);
          } catch (err) {
            console.error("Error procesando mensaje:", err?.message || err);
          }
        }
      });

      await new Promise(resolve => {
        const onUpdate = ({ connection }) => {
          if (connection === "close") {
            sock.ev.off("connection.update", onUpdate);
            resolve();
          }
        };
        sock.ev.on("connection.update", onUpdate);
      });

      if (stopping) break;
      await sleep(reconnectDelay);
      reconnectDelay = Math.min(reconnectDelay * 2, 60000);
    } catch (err) {
      if (!stopping) {
        await sleep(reconnectDelay);
        reconnectDelay = Math.min(reconnectDelay * 2, 60000);
      }
    }
  }
}

process.on("SIGINT", () => {
  stopping = true;
  try { activeSocket?.end(undefined); } catch {}
  process.exit(0);
});
process.on("SIGTERM", () => {
  stopping = true;
  try { activeSocket?.end(undefined); } catch {}
  process.exit(0);
});

connectLoop().catch(err => {
  process.exit(1);
});
