require('dotenv').config();
const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

const idProyecto = process.env.FIREBASE_PROJECT_ID;
const correoCliente = process.env.FIREBASE_CLIENT_EMAIL;
const llavePrivada = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
const idBaseDeDatos = process.env.FIREBASE_DATABASE_ID || '(default)';

console.log('=== DIAGNÓSTICO FIREBASE ===');
console.log('Project ID  :', idProyecto);
console.log('Client Email:', correoCliente);
console.log('Database ID :', idBaseDeDatos);
console.log('Llave privada empieza con:', llavePrivada?.substring(0, 40));
console.log('');

const app = admin.initializeApp({
  credential: admin.credential.cert({
    projectId: idProyecto,
    clientEmail: correoCliente,
    privateKey: llavePrivada,
  }),
});

const db = getFirestore(app, idBaseDeDatos);

async function ejecutarDiagnostico() {
  console.log('1. Probando ESCRITURA...');
  try {
    await db.collection('diagnostico').doc('test').set({ ok: true, ts: new Date().toISOString() });
    console.log('   ✓ Escritura exitosa');
  } catch (err) {
    console.error('   ✗ Escritura fallida - código:', err.code, '| mensaje:', err.message);
  }

  console.log('2. Probando LECTURA simple...');
  try {
    const doc = await db.collection('diagnostico').doc('test').get();
    console.log('   ✓ Lectura exitosa - existe:', doc.exists);
  } catch (err) {
    console.error('   ✗ Lectura fallida - código:', err.code, '| mensaje:', err.message);
  }

  console.log('3. Probando LECTURA con orderBy (colección vacía)...');
  try {
    const snap = await db.collection('lobby').orderBy('creadoEn', 'desc').limit(1).get();
    console.log('   ✓ Query exitosa - documentos:', snap.size);
  } catch (err) {
    console.error('   ✗ Query fallida - código:', err.code, '| mensaje:', err.message);
  }

  console.log('');
  console.log('=== FIN DIAGNÓSTICO ===');
}

ejecutarDiagnostico()
  .then(() => process.exit(0))
  .catch((err) => { console.error('Error inesperado:', err); process.exit(1); });
