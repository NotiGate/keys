const fs = require("fs")
const prompt = require('prompt-sync')({sigint: true});
const figlet = require('figlet');

function makekey() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  
    for (var i = 0; i < 32; i++)
      text += possible.charAt(Math.floor(Math.random() * possible.length));
  
    return text;
  }

function save(file, variable) {
    if (!file || !variable) return
    fs.writeFileSync(`${file}.json`, JSON.stringify(variable, null, "\t"), err => {
        if (err) console.error(err);
        Sync()
            // code block
    });
}

function get(file) {
    if (!file) return;
    return JSON.parse(fs.readFileSync(`./${file}.json`, "utf8"));
}
console.log(figlet.textSync(`By   NotiGate`));

let check = get('keys')

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

let db = get('keys')

let choice = prompt("Que voulez vous faire : Voir les informations d'une licence (1) / Désactiver une licence (2) / Activer une licence (3) / Regénérer une license (4) ")
if(choice == 1) {
    let license_search = prompt("Veuillez entrer la licence à rechercher. ")
    db = get('keys')
    let text_active
    if(db[license_search].active == true) {
        text_active = "Active"
    } else {
        text_active = "Désactivée"
    }
    db = get('keys')
    let restant = db[license_search].max_use - db[license_search].number_use
    console.log("Informations de la licence :")
    console.log("licence : " + db[license_search].key)
    console.log("Nom du propriétaire : " + db[license_search].lastname + " " + db[license_search].firstname)
    console.log("Nombres maximum d'utilisation : " + db[license_search].max_use)
    console.log("Nombre d'utilisation actuel : " + db[license_search].number_use)
    console.log("Nombre d'utilisation restant : " + restant)
    console.log("Statut de la licence : " + text_active)
    quit()
} else if(choice == 2) {
    let license_disable = prompt("Veuillez entrer la licence à désactiver. ")
    db = get('keys')
    let confirm = prompt("Etes vous sûr de désactiver la licence de " + db[license_disable].lastname + " " + db[license_disable].firstname + " ? (oui/non) ")
    if(confirm == "oui") {
        db[license_disable] = {
            ...db[license_disable],
            active: false,
        }
        save('keys', db)
        console.log("La licence vient d'être désactivée.")
        quit()
    } else {
        quit()
    }
} else if(choice == 3) {
    let license_enable = prompt("Veuillez entrer la licence à activer. ")
    db = get('keys')
    let confirm = prompt("Etes vous sur d'activer la licence de " + db[license_enable].lastname + " " + db[license_enable].firstname + " ? (oui/non) ")
    if(confirm == "oui") {
        db[license_enable] = {
            ...db[license_enable],
            active: true,
        }
        save('keys', db)
        console.log("La licence vient d'être réactivée.")
        quit()
    } else {
        quit()
    }
} else if(choice == 4) {
    let license_regen = prompt("Veuillez entrer la licence à regénérer. ")
    db = get('keys')
    let confirm = prompt("Etes vous sur de regénérer la licence de ")
    //let confirm = prompt("Etes vous sur de regénérer la licence de " + db[license_regen].lastname + " " + db[license_regen].firstname + " ? (oui/non) ")
    if(confirm == "oui") {
        let key = makekey()
        db[license_regen] = {
            ...db[license_regen],
            key: key,
        }
        save('keys', db)
        db = get('keys')
        db.Object(license_regen) = key
        console.log("La licence vient d'être régénérer. La nouvelle licence est : ")
        console.log(db[license_regen].key)
        quit()
    } else {
        quit()
    }
}



function quit() {
    process.exit()
}