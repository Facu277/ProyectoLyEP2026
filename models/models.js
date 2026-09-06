import { SECTORES } from '../shared/validaciones.js';

// ==========================================
// MODELO BASE: USUARIO
// ==========================================

export class Usuario {

  // La contraseña se mantiene privada dentro de la clase.
  #password;

  constructor({
    id,
    email,
    username,
    password,
    name,
    phone,
    is_active = true
  }) {

    // Validamos solamente que is_active sea booleano.
    if (typeof is_active !== 'boolean') {
      throw new TypeError('is_active debe ser booleano');
    }

    // Datos públicos del usuario.
    this.id = id;
    this.email = email;
    this.username = username;
    this.name = { ...name };
    this.phone = phone;
    this.is_active = is_active;

    // Se guarda la contraseña tal como llega.
    // No se realiza encriptación ni validación bcrypt.
    this.#password = password;
  }

  // Permite obtener la contraseña para almacenarla.
  passwordForStorage() {
    return this.#password;
  }

  // Convierte el usuario a un objeto JSON.
  // La contraseña NO se devuelve por seguridad.
  toJSON() {
    return {
      id: this.id,
      email: this.email,
      username: this.username,
      name: this.name,
      phone: this.phone,
      is_active: this.is_active
    };
  }
}










// ==========================================
// CLIENTE
// ==========================================

export class Cliente extends Usuario {

  constructor(data) {

    // Inicializamos los atributos heredados de Usuario.
    super(data);

    const {
      city,
      street,
      number,
      zipcode
    } = data.address;

    // Dirección específica de los clientes.
    this.address = {
      city,
      street,
      number,
      zipcode
    };
  }

  // Agregamos el tipo de usuario y su dirección.
  toJSON() {
    return {
      ...super.toJSON(),
      tipo: 'CLIENTE',
      address: this.address
    };
  }
}



// ==========================================
// ADMINISTRADOR
// ==========================================

export class Administrador extends Usuario {

  #sector;

  constructor(data) {

    // Inicializamos los atributos heredados de Usuario.
    super(data);

    // El administrador posee un sector.
    // Ejemplo: GERENTE o SOPORTE.
    if (!SECTORES.includes(data.sector)) throw new TypeError('Sector inválido');
    this.#sector = data.sector;
  }

  // Getter para consultar el sector.
  get sector() {
    return this.#sector;
  }

  // Agregamos el tipo y sector del administrador.
  toJSON() {
    return {
      ...super.toJSON(),
      tipo: 'ADMINISTRADOR',
      sector: this.#sector
    };
  }
}









// ==========================================
// AGRUPAR USUARIOS
// ==========================================

export function groupUsers(rows) {

  // Listas utilizadas por el dashboard.
  const lists = {
    clientes: [],
    gerentes: [],
    soporte: []
  };

  for (const row of rows) {

    // Convertimos la fila de la BD al modelo correspondiente.
    const user = fromRow(row).toJSON();

    // Clientes.
    if (user.tipo === 'CLIENTE') {
      lists.clientes.push(user);
      continue;
    }

    // Administradores GERENTE.
    if (user.sector === 'GERENTE') {
      lists.gerentes.push(user);
      continue;
    }

    // Administradores SOPORTE.
    if (user.sector === 'SOPORTE') {
      lists.soporte.push(user);
    }
  }

  return lists;
}









// ==========================================
// AGRUPAR USUARIOS SEGÚN SU TIPO
// ==========================================

export function groupUsers(rows) {

  // Listas utilizadas para organizar los usuarios.
  const lists = {
    clientes: [],
    administradores: [],
    gerentes: [],
    soportes: []
  };

  for (const row of rows) {

    // Convertimos la fila de la base de datos
    // en un objeto Cliente o Administrador.
    const user = fromRow(row).toJSON();


    // ======================================
    // CLIENTES
    // ======================================

    if (user.tipo === 'CLIENTE') {
      lists.clientes.push(user);
      continue;
    }


    // ======================================
    // ADMINISTRADORES
    // ======================================

    if (user.tipo === 'ADMINISTRADOR') {

      // Todos los gerentes y soportes pertenecen
      // también a la lista de administradores.
      lists.administradores.push(user);


      // ====================================
      // GERENTES
      // ====================================

      if (user.sector === 'GERENTE') {
        lists.gerentes.push(user);
      }


      // ====================================
      // SOPORTES
      // ====================================

      if (user.sector === 'SOPORTE') {
        lists.soportes.push(user);
      }
    }
  }

  return lists;
}








// ==========================================
// CONVERTIR FILA DE BD A USUARIO
// ==========================================

export function fromRow(row) {

  // Datos comunes tanto para clientes
  // como para administradores.
  const base = {
    id: row.id,
    email: row.email,
    username: row.username,
    password: row.password,

    name: {
      firstname: row.firstname,
      lastname: row.lastname
    },

    phone: row.phone,
    is_active: row.is_active === 1
  };


  // ======================================
  // CREAR CLIENTE
  // ======================================

  if (row.tipo === 'CLIENTE') {

    return new Cliente({
      ...base,
      address:
        typeof row.address === 'string'
          ? JSON.parse(row.address)
          : row.address
    });
  }


  // ======================================
  // CREAR ADMINISTRADOR
  // ======================================

  if (row.tipo === 'ADMINISTRADOR') {

    return new Administrador({
      ...base,
      sector: row.sector
    });
  }


  throw new TypeError(`Tipo de usuario inválido: ${row.tipo}`);
}