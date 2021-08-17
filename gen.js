const fs = require("fs")
const prompt = require('prompt-sync')({sigint: true});
const figlet = require('figlet');
const license_model = require('./models/license.js')
const mongoose = require('mongoose')
var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://URL"
const url = "mongodb+srv://URL"
const client = new MongoClient(url);


function makekey() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 32; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }


function get(file) {
     if (!file) return;
     return JSON.parse(fs.readFileSync(`./${file}.json`, "utf8"));
}
console.log(figlet.textSync(`By   NotiGate`));

async function main() {
    await client.connect();

    
    const database = client.db("license");
    const collec = database.collection("license_models");

    check = get('keys')
    const mdp1 = prompt('Bonjour ! Veuillez entrer le mot de passe administrateur 1 : ');
    if(mdp1 == check["mdp1"].mdp) {
        console.log("Mot de passe administrateur 1 réussi !")
        const mdp2 = prompt('Veuillez entrer le mot de passe administrateur 2 : ');
        if(mdp2 == check["mdp2"].mdp) {
            console.log("Mot de passe administrateur 2 réussi !")
            const mdp3 = prompt('Veuillez entrer le mot de passe administrateur 3 : ');
            if(mdp3 == check["mdp3"].mdp) {
                console.log("Mot de passe administrateur 3 réussi !")
                console.log("Vous êtes bien connecté en tant qu'administrateur !")
            } else {
                console.log("Ce n'est pas le bon mot de passe, nous quittons le programme.")
                quit()
            }
        } else {
            console.log("Ce n'est pas le bon mot de passe, nous quittons le programme.")
            quit()
        }
    } else {
        console.log("Ce n'est pas le bon mot de passe, nous quittons le programme.")
        quit()
    }
    
    let firstname = prompt('Quel est le prénom de la personne dont vous voulez générer la licence ? ');
    console.log("Ok, le prénom est : " + firstname + ".")
    let lastname = prompt('Quel est le nom de la personne dont vous voullez générer la licence ? ');
    console.log("Ok, le nom est : " + lastname + ".")
    const max_use = prompt('Combien voulez vous que la licence soit utilisée au maximum ? ');
    console.log("Ok, la licence pourra être utilisée " + max_use + ".")
    const number_use = 0;
    const confirm = prompt("Donc, le prénom est " + firstname + ". Et le nom est : " + lastname + ". La licence pourra être utilisée " + max_use + " fois. Confirmez vous ? (oui/non) ")
    if(confirm != "oui") {
        console.log("D'accord, nous quittons le programme !")
        quit()
    }
    console.log("La licence est en train d'être générée...")
    
    let key = makekey()
    
    let key_save = get('keys')
    
    firstname = firstname.toUpperCase()
    lastname = lastname.toUpperCase()
    let active = true
    const query = {key: key}
    const result = await collec.findOne(query)
    if(result == undefined) {
        let add = new license_model({
            key: key,
            firstname: firstname,
            lastname: lastname,
            number_use: number_use,
            max_use: max_use,
            active: active
        })
        const result = await collec.insertOne(add);
    } else {
        return console.log("Cette license à déja été donnée, veuillez réessayer.")
        }
    console.log(key)
    console.log('Dès que vous avez copié la licence, entrez "ok". ')
    const exit = prompt();
    if(exit == "ok") {
        console.log("Déconnections en cours... Merci de votre utilisation !")
        quit()
    } else {
        console.log("Nous sommes désolé, nous n'avons pas compris votre demande, nous vous déconnectons...")
        quit()
    }
}


function quit() {
    process.exit()
}

main()