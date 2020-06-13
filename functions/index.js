const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.applicationDefault()
});

exports.getParks = functions.https.onRequest(async (req, res) => {
    const parks = await admin.firestore().collection('parks').get().then(snapshot => snapshot.docs.map(doc => Object.assign({ uid: doc.id }, doc.data())))
    res.set('Access-Control-Allow-Origin', '*')
    res.send(parks)
})

exports.getParkById = functions.https.onRequest(async (req, res) => {
    const id = req.query.id
    const park = await admin.firestore().collection('parks').doc(id).get()
                                                                        .then(doc => {
                                                                            // eslint-disable-next-line promise/always-return
                                                                            if (!doc.exists) {
                                                                                console.log('No such document!');
                                                                            } else {
                                                                                console.log('Document data:', doc.data());
                                                                                res.set('Access-Control-Allow-Origin', '*')
                                                                                res.send(doc.data())
                                                                            }
                                                                        })
                                                                        .catch(err => {
                                                                            console.log('Error getting document', err);
                                                                        });

})

exports.addPark = functions.https.onRequest(async (req, res) => {
    const park = req.query
    const writeResult = await admin.firestore().collection('parks').add(park);
    res.set('Access-Control-Allow-Origin', '*')
    res.json({result: `Message with ID: ${writeResult.id} added.`});
})

exports.deletePark = functions.https.onRequest(async (req, res) => {
    const id = req.query.id
    const deleted = await admin.firestore().collection('parks').doc(id).delete()
    res.set('Access-Control-Allow-Origin', '*')
    res.json({result: `Message with ID: ${id} deleted.`});
})

