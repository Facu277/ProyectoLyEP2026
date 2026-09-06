import clienteService from "../services/clientesService.js";


// ==========================================
// PROBAR CREACIÓN DE CLIENTE
// ==========================================

export const probarCrearCliente = async () => {

    const nuevoCliente = {
        email: "facundo@gmail.com",
        username: "facundo123",
        password: "123456",

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
        console.log("CLIENTE ANTES DE CREAR:");
        console.log(nuevoCliente);


        // ==================================
        // CREAR CLIENTE
        // ==================================

        const clienteCreado =
            await clienteService.crearCliente(nuevoCliente);


        console.log("====================================");
        console.log("CLIENTE CREADO:");

        console.table([clienteCreado]);


        // ==================================
        // OBTENER LISTA ACTUALIZADA
        // ==================================

        const clientesActualizados =
            await clienteService.obtenerClientes();


        console.log("====================================");
        console.log("LISTA DE CLIENTES ACTUALIZADA:");

        console.table(clientesActualizados);


        // ==================================
        // MOSTRAR CANTIDAD
        // ==================================

        console.log(
            "TOTAL DE CLIENTES:",
            clientesActualizados.length
        );


        // ==================================
        // BUSCAR CLIENTE CREADO
        // ==================================

        const clienteGuardado =
            clientesActualizados.find(
                cliente =>
                    cliente.id === clienteCreado.id
            );


        console.log("====================================");
        console.log("CLIENTE ENCONTRADO EN LA LISTA:");

        console.log(clienteGuardado);


    } catch (error) {

        console.error(
            "Error al crear el cliente:",
            error
        );

    }
};