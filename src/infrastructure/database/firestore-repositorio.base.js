const { obtenerFirestore } = require('./firestore');

/**
 * Repositorio base genérico para operaciones CRUD sobre Firestore.
 * Extiende esta clase para cada entidad del dominio.
 */
class FirestoreRepositorioBase {
  /** @type {string} Nombre de la colección en Firestore */
  #nombreColeccion;

  /**
   * @param {string} nombreColeccion - Nombre de la colección de Firestore.
   */
  constructor(nombreColeccion) {
    this.#nombreColeccion = nombreColeccion;
  }

  /** @returns {FirebaseFirestore.CollectionReference} Referencia a la colección. */
  get coleccion() {
    return obtenerFirestore().collection(this.#nombreColeccion);
  }

  /**
   * Crea un documento nuevo con ID auto-generado.
   * @param {Record<string, unknown>} datos - Datos del documento.
   * @returns {Promise<{id: string}>} ID del documento creado.
   */
  async crear(datos) {
    const referencia = await this.coleccion.add({
      ...datos,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    });
    return { id: referencia.id };
  }

  /**
   * Crea o sobrescribe un documento con un ID específico.
   * @param {string} id - ID del documento.
   * @param {Record<string, unknown>} datos - Datos del documento.
   * @returns {Promise<{id: string}>} ID del documento.
   */
  async crearConId(id, datos) {
    await this.coleccion.doc(id).set({
      ...datos,
      creadoEn: new Date().toISOString(),
      actualizadoEn: new Date().toISOString(),
    });
    return { id };
  }

  /**
   * Obtiene un documento por su ID.
   * @param {string} id - ID del documento.
   * @returns {Promise<{id: string, [key: string]: unknown} | null>} Documento o null si no existe.
   */
  async obtenerPorId(id) {
    const documento = await this.coleccion.doc(id).get();
    if (!documento.exists) {
      return null;
    }
    return { id: documento.id, ...documento.data() };
  }

  /**
   * Obtiene todos los documentos de la colección.
   * @returns {Promise<Array<{id: string, [key: string]: unknown}>>} Lista de documentos.
   */
  async obtenerTodos() {
    const snapshot = await this.coleccion.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }

  /**
   * Actualiza campos parciales de un documento.
   * @param {string} id - ID del documento.
   * @param {Record<string, unknown>} datos - Campos a actualizar.
   * @returns {Promise<{id: string}>} ID del documento actualizado.
   */
  async actualizar(id, datos) {
    await this.coleccion.doc(id).update({
      ...datos,
      actualizadoEn: new Date().toISOString(),
    });
    return { id };
  }

  /**
   * Elimina un documento por su ID.
   * @param {string} id - ID del documento.
   * @returns {Promise<{id: string}>} ID del documento eliminado.
   */
  async eliminar(id) {
    await this.coleccion.doc(id).delete();
    return { id };
  }

  /**
   * Consulta documentos con filtros, ordenamiento y límite.
   * @param {Object} opciones - Opciones de consulta.
   * @param {Array<{campo: string, operador: FirebaseFirestore.WhereFilterOp, valor: unknown}>} [opciones.filtros] - Filtros where.
   * @param {{campo: string, direccion?: 'asc' | 'desc'}} [opciones.ordenar] - Ordenamiento.
   * @param {number} [opciones.limite] - Cantidad máxima de resultados.
   * @returns {Promise<Array<{id: string, [key: string]: unknown}>>} Documentos que cumplen los criterios.
   */
  async consultar({ filtros = [], ordenar, limite } = {}) {
    let consulta = this.coleccion;
    for (const { campo, operador, valor } of filtros) {
      consulta = consulta.where(campo, operador, valor);
    }
    if (ordenar) {
      consulta = consulta.orderBy(ordenar.campo, ordenar.direccion || 'asc');
    }
    if (limite) {
      consulta = consulta.limit(limite);
    }
    const snapshot = await consulta.get();
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  }
}

module.exports = FirestoreRepositorioBase;
