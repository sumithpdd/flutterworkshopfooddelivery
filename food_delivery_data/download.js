const admin = require('firebase-admin');
const fs = require('fs-extra');
const yaml = require('yamljs');

admin.initializeApp({
    credential: admin.credential.cert(require('./credentials.json')),
});
const db = admin.firestore();
const toFile = async(folder, name) => {

    const ref = db.collection(folder);
    //const ref = db.collection('products').doc(id);
    //const ref = db.collection('restaurants').doc(id);

    const snapshot = await ref.where('name', '==', name).get();
    if (snapshot.empty) {
        console.log('No matching documents.');
        return;
    }

    snapshot.forEach(async(doc) => {
        console.log(doc.id, '=>', doc.data());
        const str = yaml.stringify(doc.data(), 8);
        await fs.outputFile(`${folder}/${name}.yaml`, str);
    });
    // await fs.outputFile(`products/${id}.yaml`, str);
    // await fs.outputFile(`restaurants/${id}.yaml`, str);

    console.log('DONE')
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
    toFile("restaurants", x);
}