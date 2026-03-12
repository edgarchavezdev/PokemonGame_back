require('dotenv').config();

/** Configuración de Firebase cargada desde variables de entorno */
const configuracionFirebase = {
  idProyecto: process.env.FIREBASE_PROJECT_ID,
  correoCliente: process.env.FIREBASE_CLIENT_EMAIL,
  llavePrivada: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
};

/**
 * Valida que todas las variables de entorno requeridas para Firebase estén presentes.
 * @throws {Error} Si falta alguna variable requerida.
 */
const validarConfiguracionFirebase = () => {
  const variablesRequeridas = [
    { nombre: 'FIREBASE_PROJECT_ID', valor: configuracionFirebase.idProyecto },
    { nombre: 'FIREBASE_CLIENT_EMAIL', valor: configuracionFirebase.correoCliente },
    { nombre: 'FIREBASE_PRIVATE_KEY', valor: configuracionFirebase.llavePrivada },
  ];
  const variablesFaltantes = variablesRequeridas
    .filter(({ valor }) => !valor)
    .map(({ nombre }) => nombre);
  if (variablesFaltantes.length > 0) {
    throw new Error(
      `[FIREBASE] Variables de entorno faltantes: ${variablesFaltantes.join(', ')}`
    );
  }
};

module.exports = { configuracionFirebase, validarConfiguracionFirebase };
