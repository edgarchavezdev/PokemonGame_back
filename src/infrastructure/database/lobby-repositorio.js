const FirestoreRepositorioBase = require('./firestore-repositorio.base');

const NOMBRE_COLECCION = 'lobby';

/**
 * Repositorio para gestionar la colección "lobby" en Firestore.
 */
class LobbyRepositorio extends FirestoreRepositorioBase {
  constructor() {
    super(NOMBRE_COLECCION);
  }

  /**
   * Obtiene el lobby más reciente ordenado por fecha de creación descendente.
   * Retorna null si la colección no existe aún o está vacía.
   * @returns {Promise<{id: string, [key: string]: unknown} | null>} Lobby más reciente o null.
   */
  async obtenerMasReciente() {
    try {
      const documentos = await this.consultar({
        ordenar: { campo: 'creadoEn', direccion: 'desc' },
        limite: 1,
      });
      return documentos[0] || null;
    } catch (err) {
      const esColeccionVacia = err.code === 5;
      if (esColeccionVacia) {
        return null;
      }
      throw err;
    }
  }
}

module.exports = new LobbyRepositorio();
