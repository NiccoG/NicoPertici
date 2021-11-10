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

function textToClasss(text){
  classs={}
  let arr=text.split("\n");
  for(let i=0;i<arr.length-1;i++){  
    arr[i]=arr[i].split(": ");
    classs[arr[i][0]]=arr[i][1];
  }
  updateClass();
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
function doe(){
  download("classifica.txt",CString);
}
// Start file download.

/*
function sToTable(){
  let arr=CString.split("");
  let str=arr.map((e)=>e==":"?": ":e==";"?"</br>":e).join('');
  document.getElementById("class").innerHTML=str;
}
*/
function vittoria(elem){
  if (elem==[]){
    document.getElementById("vincitore").innerHTML="Nooo, l'avete sparata tutti troppo grande, non ha vinto nessuno. SADGE";
    return;
  } 
  document.getElementById("vincitore").innerHTML="Il vincitore è "+elem[0]+" con "+elem[1];
  if(elem[0] in classs) classs[elem[0]]++
  else  classs[elem[0]]=1
}
function updateClass(){
  CString="";
  for(let nome in classs){
    CString+=nome+": "+classs[nome]+"\n";
  }
}
function reset(){
  countElement.textContent = 'Aspettando l\'inizio del quiz';
  usersElement.textContent = '';
  users = {};
  arr=[];
  vincitori=[];
  document.getElementById("vincitore").innerHTML="";
}
function endQuiz(){
  check=0;
  listeningForCount = false;
  let risposta= document.getElementById("groda").value; 
  
  for(let i=0; i<arr.length; i++){
    if(Number(arr[i][1])>Number(risposta))
      if(i==0) vittoria([]);
      else{
        check=Number(arr[i-1][1])
        let j=i-1;
        while(Number(j!=0&&arr[j-1][1])==check){
          j--
        }
        vittoria(arr[j])
      }
    else if(i==arr.length-1){
      check=Number(arr[i][1])
      let j=i;
      while(Number(j!=0&&arr[j-1][1])==check){
        console.log("sono qua",j);
        j--
      }
      console.log(j)
      vittoria(arr[j]);
    } 
    /*
    if(Number(arr[i][1]) > Number(risposta) && i!=0){
      
      let j = i;
      check = Number(arr[i-1][1]);
      
      while(j-1 >= 0 && check == Number(arr[j-1][1])){
        vincitori.push(arr[j-1]);
        j--;
      }
      
      //document.getElementById("vincitore").innerHTML="Il vincitore è "+arr[i-1][0]+" con "+arr[i-1][1];
    
    }else if( i == arr.length-1 ){
      let j=i;
      check=Number(arr[i][1]);
      while( j >= 0 && check == Number(arr[j][1]) ){
        vincitori.push(arr[j]);
        j--;
      }
      //document.getElementById("vincitore").innerHTML="Il vincitore è "+arr[i][0]+" con "+arr[i][1];
    }
    */
  }
  /*
  if(!vincitori.length)
    document.getElementById("vincitore").innerHTML="Nooo, l'avete sparata tutti troppo grande, non ha vinto nessuno. SADGE";
  else{
    document.getElementById("vincitore").innerHTML="Il vincitore è "+vincitori[0][0]+" con "+vincitori[0][1];
    if(vincitori[0][0] in classs) classs[vincitori[0][0]]++
    else  classs[vincitori[0][0]]=1
  }
  */
  /*
  else {
    document.getElementById("vincitore").innerHTML+="I vincitori sono:\n"
    for(let i in vincitori){
      document.getElementById("vincitore").innerHTML+=vincitori[i][0]+"\n"
      if(vincitori[i][0] in classs) classs[vincitori[i][0]]++
      else  classs[vincitori[i][0]]=1
    }
    document.getElementById("vincitore").innerHTML+="con "+vincitori[0][1]+"\n"
  }
  */
  updateClass();
}
function startQuiz(){
  listeningForCount = true;
  document.getElementById("count").innerHTML = "Quizzòn in esecuzione, fate le vostre scommesse";
}
function responses(tags,message){
  var sR="";
  users[tags.username] = (message).substring(1);
  countElement.textContent = "Numero risposte: " + Object.keys(users).length; 
  arr=Object.keys(users).map(key=>[key,users[key],tags[timer]]);
  arr.sort((a,b)=>b[2]-a[2]);
  arr.sort((a,b)=>a[1]-b[1]);
    
  sR = arr[0][0]+": " + arr[0][1];
  for(let i=1; i < arr.length; i++){
    sR += ", " + arr[i][0]+": " + arr[i][1];
  }
  usersElement.textContent = sR;
}

let listeningForCount = false;
let users = {};
let arr=[];
let vincitori=[];
let check;
let classs={};
const timer="tmi-sent-ts"
function main(){

  client.connect().then(() => {
    statusElement.textContent = possMex[Math.floor(Math.random()*possMex.length)];
  });

  client.on('message', (wat, tags, message, self) => {
    if (self) return;
    const { username } = tags;
    if (username.toLowerCase() === channel || tags.mod) {
      //comandi per Nico
      if (message === '#startquiz') {
        startQuiz();
      } else if (message === '#endquiz') {
        endQuiz();
        // say count out loud.
        //const sayCount = new SpeechSynthesisUtterance(Object.keys(users).length);
        //window.speechSynthesis.speak(sayCount);
      } else if (message === '#reset') {
        reset();
      }
    }

    const regE=/^[#]\d+$/gm;

    if (listeningForCount && (message).match(regE) && !(tags.username in users)) {
      responses(tags,message);
    }
  });
}







