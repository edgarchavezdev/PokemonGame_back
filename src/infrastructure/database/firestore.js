const admin = require('firebase-admin');
const { configuracionFirebase, validarConfiguracionFirebase } = require('../config/firebase.config');

/** @type {FirebaseFirestore.Firestore | null} */
let instanciaFirestore = null;

/**
 * Inicializa Firebase Admin y devuelve la instancia de Firestore (singleton).
 * @returns {FirebaseFirestore.Firestore} Instancia de Firestore.
 */
const inicializarFirestore = () => {
  if (instanciaFirestore) {
    return instanciaFirestore;
  }
  validarConfiguracionFirebase();
  const app = admin.initializeApp({
    credential: admin.credential.cert({
      projectId: configuracionFirebase.idProyecto,
      clientEmail: configuracionFirebase.correoCliente,
      privateKey: configuracionFirebase.llavePrivada,
    }),
  });
  instanciaFirestore = app.firestore();
  console.log('[FIRESTORE] Conexión inicializada correctamente');
  return instanciaFirestore;
};

/**
 * Obtiene la instancia activa de Firestore.
 * Lanza error si no se ha inicializado previamente.
 * @returns {FirebaseFirestore.Firestore} Instancia de Firestore.
 */
const obtenerFirestore = () => {
  if (!instanciaFirestore) {
    return inicializarFirestore();
  }
  return instanciaFirestore;
};

module.exports = { inicializarFirestore, obtenerFirestore };
