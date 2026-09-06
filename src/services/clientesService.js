import axios from "axios";

const URL = "https://fakestoreapi.com/users";

const STORAGE_KEY = "clientes";


// ==========================================
// NORMALIZAR CLIENTE
// ==========================================

const normalizarCliente = (cliente) => {

    return {

        id: cliente.id,

        email: cliente.email,

        username: cliente.username,

        password: cliente.password,

        name: {
            firstname: cliente.name?.firstname,
            lastname: cliente.name?.lastname
        },

        // Eliminamos los guiones del teléfono.
        phone: cliente.phone?.replace(/-/g, ""),

        // Todo cliente nuevo comienza activo.
        is_active: cliente.is_active ?? true,

        // Identificamos al usuario como CLIENTE.
        tipo: "CLIENTE",

        // No guardamos geolocation.
        address: {
            city: cliente.address?.city,
            street: cliente.address?.street,
            number: cliente.address?.number,
            zipcode: cliente.address?.zipcode
        }
    };
};


// ==========================================
// GUARDAR CLIENTES EN LOCALSTORAGE
// ==========================================

const guardarClientes = (clientes) => {

    localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(clientes)
    );
};


// ==========================================
// LEER CLIENTES DEL LOCALSTORAGE
// ==========================================

const leerClientesLocal = () => {

    const clientesGuardados =
        localStorage.getItem(STORAGE_KEY);

    if (!clientesGuardados) {
        return [];
    }

    try {

        return JSON.parse(clientesGuardados);

    } catch (error) {

        console.error(
            "Error al leer los clientes guardados:",
            error
        );

        return [];
    }
};


// ==========================================
// INICIALIZAR CLIENTES
// ==========================================

const inicializarClientes = async () => {

    // Buscamos primero clientes guardados
    // en localStorage.
    const clientesLocales =
        leerClientesLocal();


    // Si ya existen clientes guardados,
    // utilizamos esos datos.
    if (clientesLocales.length > 0) {

        return clientesLocales;
    }


    // Si todavía no existen clientes,
    // los obtenemos desde FakeStoreAPI.
    const respuesta =
        await axios.get(URL);


    // Normalizamos los usuarios obtenidos
    // desde la API.
    const clientes =
        respuesta.data.map(
            cliente => normalizarCliente(cliente)
        );


    // Guardamos los clientes en localStorage.
    guardarClientes(clientes);


    return clientes;
};


// ==========================================
// OBTENER TODOS LOS CLIENTES
// READ
// ==========================================

const obtenerClientes = async () => {

    return await inicializarClientes();
};


// ==========================================
// OBTENER CLIENTE POR ID
// READ
// ==========================================

const obtenerClientePorId = async (id) => {

    const clientes =
        await inicializarClientes();

    const idCliente = Number(id);


    return clientes.find(
        cliente =>
            cliente.id === idCliente
    );
};


// ==========================================
// CREAR CLIENTE
// CREATE
// ==========================================

const crearCliente = async (cliente) => {

    const clientes =
        await inicializarClientes();


    // Generamos un ID automáticamente.
    const ultimoId =
        clientes.length > 0
            ? Math.max(
                ...clientes.map(cliente => cliente.id)
            )
            : 0;


    const nuevoCliente =
        normalizarCliente({

            ...cliente,

            id: ultimoId + 1,

            // Siempre se crea activo.
            is_active: true
        });


    // Agregamos el cliente a la lista.
    clientes.push(nuevoCliente);


    // Persistimos la lista modificada.
    guardarClientes(clientes);


    return nuevoCliente;
};


// ==========================================
// ACTUALIZAR CLIENTE
// UPDATE
// ==========================================

const actualizarCliente = async (
    id,
    datosActualizados
) => {

    const clientes =
        await inicializarClientes();

    const idCliente =
        Number(id);


    // Verificamos que el cliente exista.
    const clienteExistente =
        clientes.find(
            cliente =>
                cliente.id === idCliente
        );


    if (!clienteExistente) {

        throw new Error(
            `No existe un cliente con ID ${idCliente}`
        );
    }


    const nuevosClientes =
        clientes.map(cliente => {

            if (cliente.id !== idCliente) {

                return cliente;
            }


            return normalizarCliente({

                ...cliente,

                ...datosActualizados,

                name: {
                    ...cliente.name,
                    ...(datosActualizados.name || {})
                },

                address: {
                    ...cliente.address,
                    ...(datosActualizados.address || {})
                }
            });
        });


    guardarClientes(nuevosClientes);


    return nuevosClientes.find(
        cliente =>
            cliente.id === idCliente
    );
};


// ==========================================
// DESHABILITAR CLIENTE
// DELETE LÓGICO
// ==========================================

const eliminarCliente = async (id) => {

    const clientes =
        await inicializarClientes();

    const idCliente =
        Number(id);


    const clienteExistente =
        clientes.find(
            cliente =>
                cliente.id === idCliente
        );


    if (!clienteExistente) {

        throw new Error(
            `No existe un cliente con ID ${idCliente}`
        );
    }


    const nuevosClientes =
        clientes.map(cliente => {

            if (cliente.id === idCliente) {

                return {
                    ...cliente,

                    // Baja lógica.
                    is_active: false
                };
            }

            return cliente;
        });


    guardarClientes(nuevosClientes);


    return nuevosClientes.find(
        cliente =>
            cliente.id === idCliente
    );
};


// ==========================================
// EXPORTAR SERVICIO
// ==========================================

export default {

    inicializarClientes,

    obtenerClientes,

    obtenerClientePorId,

    crearCliente,

    actualizarCliente,

    eliminarCliente

};