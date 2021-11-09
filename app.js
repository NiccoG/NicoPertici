const countElement = document.querySelector('#count');
const usersElement = document.querySelector('#users');
const statusElement = document.querySelector('#status');

//const params = new URLSearchParams(window.location.search);
const channel = 'nicopertici'; //params.get('channel') || 'codinggarden';
const client = new tmi.Client({
  connection: {
    secure: true,
    reconnect: true,
  },
  channels: ['NicoPertici'],
});
let possMex=[`Leggendo i messaggi di Eagleman...`,`Grodando...`,`Leggendo la chat degli MVP...`,`Deh so il Cippe...`,"Nam1d4 ha regalato una sub..."]
client.connect().then(() => {
  statusElement.textContent = possMex[Math.floor(Math.random()*possMex.length)];
});

let listeningForCount = false;
let users = {};
let arr=[];
let vincitori=[];
let check;

client.on('message', (wat, tags, message, self) => {

  if (self) return;
  const { username } = tags;
  //if (username.toLowerCase() === channel) {
    //comandi per Nico
    if (message === '#startquiz') {
      listeningForCount = true;
      document.getElementById("count").innerHTML = "Quizzòn in esecuzione, fate le vostre scommesse";
    } else if (message === '#endquiz') {
      check=0;
      listeningForCount = false;
      let risposta= document.getElementById("groda").value;
      
      for(let i=0; i<arr.length; i++){
        if(Number(arr[i][1]) > Number(risposta) && i!=0){
          let j = i;
          check = Number(arr[i-1][1]);
          
          while(j-1 >= 0 && check == Number(arr[j-1][1])){
            vincitori.push(arr[j-1]);
            j--;
          }
          //document.getElementById("vincitore").innerHTML="Il vincitore è "+arr[i-1][0]+" con "+arr[i-1][1];
        }
        else if( i == arr.length-1 ){
          let j=i;
          check=Number(arr[i][1]);
          while( j >= 0 && check == Number(arr[j][1]) ){
            vincitori.push(arr[j]);
            j--;
          }
          //document.getElementById("vincitore").innerHTML="Il vincitore è "+arr[i][0]+" con "+arr[i][1];
        }
        
      }

      
      if(Number(vincitori[0][1])>Number(risposta)){
        document.getElementById("vincitore").innerHTML="Nooo, l'avete sparata tutti troppo grande, non ha vinto nessuno. SADGE";
      }
      else if(vincitori.length==1)
        document.getElementById("vincitore").innerHTML="Il vincitore è "+vincitori[0][0]+" con "+vincitori[0][1];
      else {
        document.getElementById("vincitore").innerHTML+="I vincitori sono:\n"
          for(let i in vincitori){
            document.getElementById("vincitore").innerHTML+=vincitori[i][0]+"\n"
          }
          document.getElementById("vincitore").innerHTML+="con "+vincitori[0][1]+"\n"
        }
      // say count out loud.
      //const sayCount = new SpeechSynthesisUtterance(Object.keys(users).length);
      //window.speechSynthesis.speak(sayCount);
    } else if (message === '#reset') {
      countElement.textContent = 'Ascoltando risposte...';
      usersElement.textContent = '';
      users = {};
      arr=[];
      vincitori=[];
      document.getElementById("vincitore").innerHTML="";
    }
  //}

  var sR=""
  const regE=/^[#]\d+$/gm;

  if (listeningForCount && (message).match(regE) && !(tags.username in users)) {

    users[tags.username] = (message).substring(1);
    // display current count page.
    countElement.textContent = "Numero risposte: " + Object.keys(users).length; 
    
    arr=Object.keys(users).map(key=>[key,users[key]]);
    arr.sort((a,b)=>a[1]-b[1]);
    
    sR = arr[0][0]+": " + arr[0][1];
    for(let i=1; i < arr.length; i++){
      sR += ", " + arr[i][0]+": " + arr[i][1];
    }
    usersElement.textContent = sR;
  }
});
