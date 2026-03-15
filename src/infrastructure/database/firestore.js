const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
const { configuracionFirebase, validarConfiguracionFirebase } = require('../config/firebase.config');

/** @type {FirebaseFirestore.Firestore | null} */
let instanciaFirestore = null;

/**
 * Inicializa Firebase Admin y devuelve la instancia de Firestore (singleton).
 * Usa la API modular para soportar múltiples bases de datos y evitar problemas
 * con el databaseId en Firebase Admin SDK v12+.
 * @returns {FirebaseFirestore.Firestore} Instancia de Firestore.
 */
const inicializarFirestore = () => {
  if (instanciaFirestore) {
    return instanciaFirestore;
  }
  validarConfiguracionFirebase();
  const app = admin.apps.length
    ? admin.app()
    : admin.initializeApp({
        credential: admin.credential.cert({
          projectId: configuracionFirebase.idProyecto,
          clientEmail: configuracionFirebase.correoCliente,
          privateKey: configuracionFirebase.llavePrivada,
        }),
      });
  instanciaFirestore = getFirestore(app, configuracionFirebase.idBaseDeDatos);
  console.log(`[FIRESTORE] Conexión inicializada (base de datos: ${configuracionFirebase.idBaseDeDatos})`);
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
