const { Firestore } = require('@google-cloud/firestore');
const db = new Firestore({
    keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
 
async function storeData(id, data) {
  const predictCollection = db.collection('predictions');
  return predictCollection.doc(id).set(data);
}

async function getAllData() {
  try {
    const predictCollection = db.collection('predictions');
    const snapshot = await predictCollection.get();

    if (snapshot.empty) {
        console.log('No matching documents.');
        return [];
    }

    const data = [];
    snapshot.forEach(doc => {
        data.push({ id: doc.id, ...doc.data() });
    });

    return data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw new Error('Failed to fetch data');
  }
}

 
module.exports = { 
  storeData, 
  getAllData
}