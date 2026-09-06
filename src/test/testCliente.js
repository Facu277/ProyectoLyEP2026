import clienteService from "../services/clientesService.js";


// ==========================================
// PROBAR CREATE
// CREAR CLIENTE
// ==========================================

/* export const probarCrearCliente = async () => {

    const nuevoCliente = {
        email: "facundo@gmail.com",
        username: "facundo123",
        password: "123456#Facundo",

        name: {
            firstname: "Facundo",
            lastname: "Alfaro"
        },

        phone: "388-456-7890",

        address: {
            city: "San Salvador de Jujuy",
            street: "Belgrano",
            number: 123,
            zipcode: "4600"
        }
    };


    try {

        console.log("====================================");
        console.log("CREATE - CLIENTE ANTES DE CREAR:");
        console.log(nuevoCliente);


        const clienteCreado =
            await clienteService.crearCliente(nuevoCliente);


        console.log("====================================");
        console.log("CREATE - CLIENTE CREADO:");

        console.table([clienteCreado]);


        const clientesActualizados =
            await clienteService.obtenerClientes();


        console.log("LISTA ACTUALIZADA:");

        console.table(clientesActualizados);

        console.log(
            "TOTAL DE CLIENTES:",
            clientesActualizados.length
        );


        return clienteCreado;

    } catch (error) {

        console.error(
            "Error al crear el cliente:",
            error
        );
    }
}; */




// ==========================================
// PROBAR READ
// OBTENER TODOS LOS CLIENTES
// ==========================================

export const probarObtenerClientes = async () => {

    try {

        const clientes =
            await clienteService.obtenerClientes();


        console.log("====================================");
        console.log("READ - TODOS LOS CLIENTES:");

        console.table(clientes);


        console.log(
            "TOTAL DE CLIENTES:",
            clientes.length
        );


        return clientes;

    } catch (error) {

        console.error(
            "Error al obtener los clientes:",
            error
        );
    }
};




// ==========================================
// PROBAR READ
// OBTENER CLIENTE POR ID
// ==========================================

export const probarObtenerClientePorId = async (id) => {

    try {

        const cliente =
            await clienteService.obtenerClientePorId(id);


        console.log("====================================");
        console.log(
            `READ - CLIENTE CON ID ${id}:`
        );


        if (!cliente) {

            console.log(
                `No existe un cliente con ID ${id}`
            );

            return;
        }


        console.table([cliente]);


        return cliente;

    } catch (error) {

        console.error(
            "Error al obtener el cliente:",
            error
        );
    }
};




// ==========================================
// PROBAR UPDATE
// ACTUALIZAR CLIENTE
// ==========================================

export const probarActualizarCliente = async (id) => {

    const datosActualizados = {

        email: "facundo.actualizado@gmail.com",

        username: "facundoActualizado",

        name: {
            firstname: "Facundo",
            lastname: "Alfaro Actualizado"
        },

        phone: "388-999-8888",

        address: {
            city: "Palpala",
            street: "Avenida Libertad",
            number: 500,
            zipcode: "4612"
        }
    };


    try {

        console.log("====================================");
        console.log(
            `UPDATE - CLIENTE A MODIFICAR: ${id}`
        );


        const clienteAnterior =
            await clienteService.obtenerClientePorId(id);


        console.log("ANTES DE ACTUALIZAR:");

        console.table([clienteAnterior]);


        const clienteActualizado =
            await clienteService.actualizarCliente(
                id,
                datosActualizados
            );


        console.log("DESPUÉS DE ACTUALIZAR:");

        console.table([clienteActualizado]);


        const clientesActualizados =
            await clienteService.obtenerClientes();


        console.log("LISTA ACTUALIZADA:");

        console.table(clientesActualizados);


        return clienteActualizado;

    } catch (error) {

        console.error(
            "Error al actualizar el cliente:",
            error
        );
    }
};




// ==========================================
// PROBAR DELETE LÓGICO
// DESHABILITAR CLIENTE
// ==========================================

export const probarEliminarCliente = async (id) => {

    try {

        console.log("====================================");
        console.log(
            `DELETE LÓGICO - CLIENTE ID ${id}`
        );


        const clienteAnterior =
            await clienteService.obtenerClientePorId(id);


        console.log("ANTES DE DESHABILITAR:");

        console.table([clienteAnterior]);


        const clienteDeshabilitado =
            await clienteService.eliminarCliente(id);


        console.log("DESPUÉS DE DESHABILITAR:");

        console.table([clienteDeshabilitado]);


        console.log(
            "ESTADO DEL CLIENTE:",
            clienteDeshabilitado.is_active
        );


        const clientesActualizados =
            await clienteService.obtenerClientes();


        console.log("LISTA ACTUALIZADA:");

        console.table(clientesActualizados);


        return clienteDeshabilitado;

    } catch (error) {

        console.error(
            "Error al deshabilitar el cliente:",
            error
        );
    }
};




// ==========================================
// PROBAR CRUD COMPLETO
// ==========================================

export const probarCRUDCompleto = async () => {

    try {

        console.log("====================================");
        console.log("INICIO DE PRUEBA CRUD");


        // ==================================
        // CREATE
        // ==================================

        const clienteCreado =
            await probarCrearCliente();


        if (!clienteCreado) {
            return;
        }


        const idCliente =
            clienteCreado.id;


        // ==================================
        // READ
        // ==================================

        await probarObtenerClientePorId(
            idCliente
        );


        // ==================================
        // UPDATE
        // ==================================

        await probarActualizarCliente(
            idCliente
        );


        // ==================================
        // DELETE LÓGICO
        // ==================================

        await probarEliminarCliente(
            idCliente
        );


        // ==================================
        // READ FINAL
        // ==================================

        await probarObtenerClientes();


        console.log("====================================");
        console.log("FIN DE PRUEBA CRUD");


    } catch (error) {

        console.error(
            "Error durante la prueba CRUD:",
            error
        );
    }
};