const admin = require('firebase-admin');
const fs = require('fs-extra');
const yaml = require('yamljs');

admin.initializeApp({
    credential: admin.credential.cert(require('./credentials.json')),
});
const db = admin.firestore();


const update = async(folder, name) => {

    const json = yaml.load(`${folder}/${name}.yaml`);
    const ref = db.collection(folder);
    const snapshot = await ref.where('name', '==', name).get();

    if (snapshot.empty) {
        const id = JSON.stringify(json["Id"]);
        await ref.doc(id.replace(/['"]+/g, '')).set(json, { merge: true });
        console.log('added ', json["Id"], '=>', JSON.stringify(json));
        return;
    }

    snapshot.forEach(async(doc) => {

        await ref.doc(doc.id).set(json);
        console.log('updated ', doc.id, '=>', doc.data());
    });

}

const restaurants = [
    'Burger Shack',
    'China Palace Restaurant',
    "Falafel Factory",
    'Pancake King',
    'Restaurant 0',
    'Restaurant 1',
    'Restaurant 2',
    'Restaurant 3',
    'Restaurant 4'

]


for (const x of restaurants) {
    update("restaurants", x);
}