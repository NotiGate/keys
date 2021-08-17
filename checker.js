const fs = require("fs")
const prompt = require('prompt-sync')({sigint: true});
const figlet = require('figlet');
var MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://URL"
const client = new MongoClient(uri);

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

async function main() {
    console.log(figlet.textSync(`By   NotiGate`));


    await client.connect();
    const database = client.db("license");
    const collec = database.collection("license_models");
    const license = prompt('Bonjour ! Veuillez entrer votre licence. ');
    const query = {key: license}
    const result = await collec.findOne(query)
    if(result == undefined) {
        console.log("La licence n'est pas valide, veuillez relancer le programme pour réessayer.")
        quit()
    } else if(result.active != true) {
            console.log("La licence est désactivée, veuillez en commander une autre.")
            quit()
        } else if(result.active == false){
            console.log("La licence est désactivée, veuillez en commander une autre.")
        } else {
            const firstname = prompt('Veuillez entrer votre prénom (sans accents) ');
            const lastname = prompt('Veuillez entrer votre nom (sans accents) ');
            if(firstname.toUpperCase() == result.firstname && lastname.toUpperCase() == result.lastname) {
                console.log("Merci de votre confirmations Monsieur " + lastname.toUpperCase() + ".")
            } else {
                const noname = prompt("Désolé, ce n'est pas le nom indiqué sur la licence. Votre nom est : " + lastname + " et votre prénom est : " + firstname + ". Est-ce ca ? (Les majuscules ne changent rien. Il ne faut pas mettre d'accent.) Répondez par oui/non. " )
                if(noname != "oui") {
                    console.log("Veuillez relancer le programme et rentrez votre nom sans fautes et sans accent, merci.")
                    quit()
                } else {
                    const verifkeys = prompt("Votre licence est-elle bien : " + result.key + " ? Répondez par oui/non. ")
                    if(verifkeys == "oui") {
                        console.log("Veuillez retaper votre nom en relancant le programme")
                        quit()
                    } else {
                        console.log("Vous NE pouvez PAS utiliser la licence de quelqu'un d'autre. Veuillez arrêter.")
                        quit()
                    }
                }
            }
            console.log("Nous activons votre licence...")
            let numberuse = parseInt(result.number_use) + 1
            let newvalue = {
                key: result.key,
                firstname: result.firstname,
                lastname: result.lastname,
                number_use: numberuse.toString(),
                max_use: result.max_use,
                active: result.active
            }
            try{
                collec.update({key:license}, newvalue);
                console.log("Update ! (Normalement mdr)")
            } catch (e) {
                console.log(e)
            }
            if(result.max_use == numberuse) {
                let newvalue = {
                    key: result.key,
                    firstname: result.firstname,
                    lastname: result.lastname,
                    number_use: result.number_use,
                    max_use: result.max_use,
                    active: false
                }
                collec.update({key:license}, newvalue);
            }
            let text_active
            if(result.active == true) {
                text_active = "active"
            } else {
                text_active = "désactivée"
            }
            console.log("Licence activé " + result.lastname + " " + result.firstname + ". La licence est " + text_active)
            quit()
        }
}

function quit() {
    //console.log("Le programme s'arrête. Si vous avez fait une erreur, relancez le programme.")
    process.exit()
}

main()