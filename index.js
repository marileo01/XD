const {
  default: makeWASocket,
  MessageType,
  MessageOptions,
  Mimetype,
  DisconnectReason,
  BufferJSON,
  AnyMessageContent,
  delay,
  fetchLatestBaileysVersion,
  isJidBroadcast,
  makeCacheableSignalKeyStore,
  makeInMemoryStore,
  MessageRetryMap,
  useMultiFileAuthState,
  msgRetryCounterMap,
  ButtonText
} = require("@whiskeysockets/baileys");

const log = (pino = require("pino"));
const { session } = { session: "session_auth_info" };
const { Boom } = require("@hapi/boom");
const path = require("path");
const fs = require("fs");
const express = require("express");
const fileUpload = require("express-fileupload");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = require("express")();
// enable files upload
app.use(
  fileUpload({
    createParentPath: true,
  })
);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
const server = require("http").createServer(app);
const io = require("socket.io")(server);
const port = process.env.PORT || 8000;
const qrcode = require("qrcode");

app.use("/assets", express.static(__dirname + "/cliente/static"));

app.get("/scan", (req, res) => {
  res.sendFile("./cliente/pageqr.html", {
    root: __dirname,
  });
});

app.get("/", (req, res) => {
  res.send("server working");
});

let sock;
let qrDinamic;
let soket;

async function connectToWhatsApp() {
  const { state, saveCreds } = await useMultiFileAuthState("session_auth_info");

  sock = makeWASocket({
    printQRInTerminal: true,
    auth: state,
    logger: log({ level: "silent" }),
  });

  sock.ev.on("connection.update", async (update) => {
    const { connection, lastDisconnect, qr } = update;
    qrDinamic = qr;
    if (connection === "close") {
      let reason = new Boom(lastDisconnect.error).output.statusCode;
      if (reason === DisconnectReason.badSession) {
        console.log(
          `Bad Session File, Please Delete ${session} and Scan Again`
        );
        sock.logout();
      } else if (reason === DisconnectReason.connectionClosed) {
        console.log("Conexión cerrada, reconectando....");
        connectToWhatsApp();
      } else if (reason === DisconnectReason.connectionLost) {
        console.log("Conexión perdida del servidor, reconectando...");
        connectToWhatsApp();
      } else if (reason === DisconnectReason.connectionReplaced) {
        console.log(
          "Conexión reemplazada, otra nueva sesión abierta, cierre la sesión actual primero"
        );
        sock.logout();
      } else if (reason === DisconnectReason.loggedOut) {
        console.log(
          `Dispositivo cerrado, elimínelo ${session} y escanear de nuevo.`
        );
        sock.logout();
      } else if (reason === DisconnectReason.restartRequired) {
        console.log("Se requiere reinicio, reiniciando...");
        connectToWhatsApp();
      } else if (reason === DisconnectReason.timedOut) {
        console.log("Se agotó el tiempo de conexión, conectando...");
        connectToWhatsApp();
      } else {
        sock.end(
          `Motivo de desconexión desconocido: ${reason}|${lastDisconnect.error}`
        );
      }
    } else if (connection === "open") {
      console.log("conexión abierta");
      return;
    }
  });


  const UserPedidos=[{
    user:"default",
    status:true
  }]

  const servicios=[
    {id:"e1",servicio:" NETFLIX ( 30 Días )",precio:3},
    {id:"e2",servicio:" MAGIS TV ( 30 Días )",precio:4.5},
    {id:"e3",servicio:" STAR + ( 30 Días )",precio:2},
    {id:"e4",servicio:" DISNEY + ( 30 Días )",precio:1.49},
    {id:"e5",servicio:" AMAZON PRIME ( 30 Días )",precio:2},
    {id:"e6",servicio:" HBO MAX ( 30 Días )",precio:1.49},
    {id:"e7",servicio:" CRUNCHYROLL ( 30 Días )",precio:2},
    {id:"e8",servicio:" PARAMOUNT ( 30 Días )",precio:2},
    {id:"e9",servicio:" APPLE TV ( 90 Días )",precio:5},
    {id:"e10",servicio:" PORN-HUP ( 30 Días )",precio:2.5},
    {id:"m1",servicio:" SPOTIFY ( 90 Días )",precio:5},
    {id:"m2",servicio:" YOUTUBE PREMIUN ( 90 Días )",precio:5},
    {id:"m3",servicio:" APPLE MUSIC ( 90 Días )",precio:5},
    {id:"of1",servicio:"PROMOCIÓN FAMILIAR",precio:5.5},
    {id:"of2",servicio:"PROMOCION NETFLIX ( 30 Días )",precio:3},
    {id:"of3",servicio:"NETFLIX y DISNEY + (30 Días) ",precio:4},
    {id:"of4",servicio:"NETFLIX  y HBO MAX (30 Días)",precio:4},
    {id:"of5",servicio:"NETFLIX  y STAR + (30 Días)",precio:4},
    {id:"of6",servicio:"3 PERFILES DE MAGIS TV",precio:10},
    {id:"of7",servicio:"STAR +  y DISNEY + (30 Días)",precio:3},
    {id:"of8",servicio:"NETFLIX y AMAZON (30 Días)",precio:4},
]
console.log(UserPedidos)
  sock.ev.on("messages.upsert", async ({ messages, type }) => {
    
   
    try {
      if (type === "notify") {
        if (!messages[0]?.key.fromMe) {
          const captureMessage = messages[0]?.message?.conversation;
          const numberWa = messages[0]?.key?.remoteJid;

          const compareMessage = captureMessage?.toLocaleLowerCase();


          //
          const status=UserPedidos.find((e)=>e.user===numberWa)?.status

          const user=UserPedidos.find((e)=> e.user===numberWa )?.user
         console.log(user)
         console.log(status)

          if (compareMessage === "hola bot-marileo 👋" || compareMessage === "Hola" ) {
            
            await sock.sendMessage(numberWa,
                { 
                    text: "🙌 ¡Bienvenido a M&L Services Streaming!, Estamos encantados de tenerte aquí. \n"+
                    "Para ayudarte en todo lo que necesites, te presentamos a *MariLeo-Bot*🤖."+
                    "Él te guiará en la elección de la mejor opción de entretenimiento para ti.\n"+
                    "*¡Disfruta de la mejor experiencia de streaming con nosotros!*\n "+
                   
                   "-> Escribe *b-lista*, para conocer la lista de servicio que ofrecemos.\n"+
                   "-> Escribe *b-ofertas*, para conocer todas nuestras ofertas. \n"+
                   "-> Escribe *b-revendedor*, para obtener mas información sobre precios a revendedores.\n "+
                   "\n "+
                   
                   "-> Escribe *b-soporte*, Si presentas fallas en tu servicio"
                }
            )
            UserPedidos.forEach((e)=>{
              e.user===numberWa
              ?
              null
              :
              UserPedidos.push({
                user:numberWa,
                status:false
              })
            })
            
            
          } 

          if (compareMessage === "b-lista") {
            
            await sock.sendMessage(numberWa,{ 
                    text: "Esta es nuestra *lista*📄 de Servicios \n de entretenimiento disponible"+
                  
                    "\n \n"+
           
                    "✅ E1) NETFLIX \n"+
                    "( 30 Días ) \n"+
                    " PROMOCIÓN POR TIEMPO LIMITADO \n"+
                    " Precio: 3$ \n"+
                    "\n "+
                    "✅ E2) MAGIS TV \n"+
                    "1 Dispositivo \n"+
                    "(30 Días) \n"+
                    "Precio: 4,5$ \n"+
                    "-> + 930 canales vivo HD \n"+
                    "-> + 80 paquetes Deportes \n"+
                    "-> Paquetes TV Premium \n"+
                    "-> Más 10.000 Series y Películas \n"+
                    "-> Últimos estrenos de taquilla \n"+
                    "-> Paquetes adultos \n"+
                    "\n "+
                    "✅ E3) STAR + \n"+
                    "( 30 Días) \n "+
                    "Precio 2,00$ \n"+
                    "\n "+
                    "✅ E4) DISNEY + \n "+
                    "( 30 Días ) \n"+
                    "Precio: 1,49$ \n"+
                    "\n "+
                    "✅ E5) AMAZON PRIME \n"+
                    "( 30 Días )  \n"+
                    "Precio: 2,00$ \n"+
                    "\n "+
                    "✅ E6) HBO MAX  \n"+
                    "( 30 Días ) \n"+ 
                    "Precio: 1,49$ \n"+
                    "\n "+
                    "✅ E7) CRUNCHYROLL  \n"+
                    "( 30 Días )  \n"+
                    "Precio: 2,00$ \n"+
                    "\n "+
                    "✅ E8) PARAMOUNT + \n"+
                    "( 30 Días ) \n"+
                    "Precio: 2,00$ \n"+ 
                    "\n "+
                    "✅ E9) APPLE TV  \n"+
                    "(90 Días) \n"+
                    "Precio: 5,00$ \n"+
                    "\n "+
                    "😈 E10) PORN-HUP PREMIUM \n"+
                    "( 30 Días ) \n"+
                    "Precio: 2,50$ \n"+
                    "\n "+
                    "🎶 *SERVICIOS DE MUSICA* 🎶"+
                    "\n "+
                    "✅ M1) SPOTIFY \n"+
                     "(3 MESES) \n"+
                     "Precio: 5$  \n"+
                     "\n "+
                     "✅ M2) YOUTUBE PREMIUN \n"+
                    "(3 MESES) \n"+
                    "Precio: 5$  \n"+
                    "\n "+
                    "✅ M3) APPLE MUSIC  \n"+
                    "(3 MESES) \n"+
                    "Precio: 5$  \n"+
                    "\n "
                    
            })
            await sock.sendMessage(numberWa,{
              text:"Si deseas solicitar algun servicio, \n escribe *el codigo del o los servicios)* \n"+
              "Ejemplo \n"+
              "E1,E3,E5,..."
            })
            

            UserPedidos.forEach((e)=>{
              e.user===numberWa
              ?
              e.status=true
              :
              null
            })

            console.log(UserPedidos)
          }

          if(compareMessage === "b-soporte"){

            await sock.sendMessage(numberWa,{ 
              text: "¡Hola! Soy el bot de soporte técnico de M&L Services Streaming.\n"+
              "Lamentamos que estes experimentando problemas con tu servicio.\n"+
              "Para poder ayudarte, por favor rellena el siguiente formulario y nos comunicaremos contigo lo antes posible"})
            await sock.sendMessage(numberWa,{ 
            text: "https://forms.gle/DaBuf22Jae2jaF8j8"})
          }

          if(compareMessage === "b-ofertas"){


          await sock.sendMessage(numberWa,{  
              text: "Estas son nuestras promociones actuales,\n aprovecha antes de que se agote \n "+
              
              "Of1 ) *PROMOCIÓN FAMILIAR* \n"+
              "NETFLIX (30 DÍAS) \n"+
              "DISNEY + (30 DÍAS) \n"+
              "HBO MAX (30 DÍAS) \n"+
              "Por tan solo 5,5$ \n \n"+
              
              "Of2 ) PROMOCION NETFLIX \n ( 30 Días )\n"+
              "PROMOCIÓN POR TIEMPO LIMITADO\n"+
              "precio: 3$\n \n"+
            
              "NETFLIX (30 Días) y DISNEY + \n(30 Días)\n"+
              "PROMOCIÓN POR TIEMPO LIMITADO\n"+
              "precio: 4$\n \n"+
              
              "Of4 ) NETFLIX (30 Días) y HBO MAX \n (30 Días)\n"+
              "precio: 4$\n \n"+
              
              "Of5 ) NETFLIX (30 Días) y STAR + \n(30 Días)\n"+
              "precio: 4$\n \n"+
              
              "Of6 ) 3 PERFILES DE MAGIS TV\n"+
              "precio: 10$\n \n"+

              "Of7 ) STAR + (30 Días) y DISNEY + \n (30 Días)\n"+
              "precio: 3$\n \n"+
              
              "Of6 ) NETFLIX (30 Días) y AMAZON \n (30 Días)\n"+
              "precio: 4$\n \n"
          })
          await sock.sendMessage(numberWa,{
            text:"Si deseas solicitar alguna oferta, \n escribe *el codigo del o las ofertas)* \n"+
            "Ejemplo \n"+
            "E1,E3,E5,..."
          })
          pedidos.forEach((e)=>{
            e.user===numberWa
            ?
            e.status=true
            :
            null
          })

          }

          if(status && user===numberWa){

            const array=compareMessage?.split(",")
            const pedidos= array.map((ped)=>{
                const precio=servicios.filter((e)=>e.id===ped.toLowerCase())
                const num=parseFloat(precio)
                return precio
            });

            const valorTotalMap=pedidos.map((e)=>{
                    return Number(e[0].precio)
            });

            const initialValue = 0;
            const sumWithInitial = valorTotalMap.reduce(
            (accumulator, currentValue) => accumulator + currentValue,
            initialValue
            );
            if(pedidos.length>=1){
              const mapCount=pedidos.map(async (e)=>{
                  
                return await sock.sendMessage(numberWa,{text:"*Servicio*: "+ e[0].servicio })
              });
              if(mapCount.length===pedidos.length){
                await sock.sendMessage(numberWa,{text:"*Total*: "+sumWithInitial+"$"})
                await sock.sendMessage(numberWa,{text:"Para realizar el pago correspondiente,\n escribe *b-pago* y obten la informacion de pago"})
              }
              UserPedidos.forEach((e)=>{
                e.user===numberWa
                ?
                e.status=false
                :
                null
              })
              console.log('pedido',UserPedidos)
          }
          


          }
          if(compareMessage === "b-revendedor"){
            await sock.sendMessage(numberWa,{ 
              text:"¡TENEMOS EXCELENTES PRECIOS PARA REVENDEDORES! \n"+
            "Para más información escríbenos y con gusto le atenderemos"})
          }
          if(compareMessage === "b-pago"){
            await sock.sendMessage(numberWa,{ 
              text:"METODOS DE PAGO DISPONIBLE \n"+
              "🔽🔽🔽🔽🔽🔽🔽🔽🔽🔽 \n \n"+
              "PAGO MOVIL"+
              "\n"+
              "Banco Mercantil (0105)\n"+
              "C.I: 28.311.576\n"+
              "Teléfono: 0412-706-01-94\n"+
              "Leonardo Carvajal\n"+
              "\n\n"+
              "BINANCE PAY\n"+
              
              "CLANSHLEO@GMAIL.COM \n"+
              "TRABAJAMOS CON LA TASA DE MONITOR DÓLAR \n"})
          }
      
                
          } 
        }
      }
     catch (error) {
      console.log("error ", error);
    }
  });

  sock.ev.on("creds.update", saveCreds);
}

const isConnected = () => {
  return sock?.user ? true : false;
};

app.get("/send-message", async (req, res) => {
  const tempMessage = req.query.message;
  const number = req.query.number;

  let numberWA;
  try {
    if (!number) {
      res.status(500).json({
        status: false,
        response: "El numero no existe",
      });
    } else {
      numberWA = "591" + number + "@s.whatsapp.net";
   
      if (isConnected()) {

       
        const exist = await sock.onWhatsApp(numberWA);

        if (exist?.jid || (exist && exist[0]?.jid)) {
          sock
            .sendMessage(exist.jid || exist[0].jid, {
              text: tempMessage,
            })
            .then((result) => {
              res.status(200).json({
                status: true,
                response: result,
              });
            })
            .catch((err) => {
              res.status(500).json({
                status: false,
                response: err,
              });
            });
        }
      } else {
        res.status(500).json({
          status: false,
          response: "Aun no estas conectado",
        });
      }
    }
  } catch (err) {
    res.status(500).send(err);
  }
});

io.on("connection", async (socket) => {
  soket = socket;
  if (isConnected()) {
    updateQR("connected");
  } else if (qrDinamic) {
    updateQR("qr");
  }
});

const updateQR = (data) => {
  switch (data) {
    case "qr":
      qrcode.toDataURL(qrDinamic, (err, url) => {
        soket?.emit("qr", url);
        soket?.emit("log", "QR recibido , scan");
      });
      break;
    case "connected":
      soket?.emit("qrstatus", "./cliente/static");
      soket?.emit("log", " usaario conectado");
      const { id, name } = sock?.user;
      var userinfo = id + " " + name;
      soket?.emit("user", userinfo);

      break;
    case "loading":
      soket?.emit("qrstatus", "./cliente/static");
      soket?.emit("log", "Cargando ....");

      break;
    default:
      break;
  }
};

connectToWhatsApp().catch((err) => console.log("unexpected error: " + err)); // catch any errors
server.listen(port, () => {
  console.log("Server Run Port : " + port);
});
