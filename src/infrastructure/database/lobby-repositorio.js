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

  /**
   * Agrega un evento al array "eventos" del documento del lobby.
   * @param {string} idLobby - ID del documento del lobby.
   * @param {Object} evento - Objeto del evento a guardar (debe ser serializable).
   * @returns {Promise<{id: string}>} ID del documento actualizado.
   */
  async agregarEvento(idLobby, evento) {
    const lobby = await this.obtenerPorId(idLobby);
    if (!lobby) {
      const error = new Error(`No se encontró el lobby con id: ${idLobby}`);
      error.statusCode = 404;
      throw error;
    }
    const eventosActuales = Array.isArray(lobby.eventos) ? lobby.eventos : [];
    const eventosNuevos = [...eventosActuales, { ...evento, registradoEn: new Date().toISOString() }];
    await this.actualizar(idLobby, { eventos: eventosNuevos });
    return { id: idLobby };
  }
}

module.exports = new LobbyRepositorio();
