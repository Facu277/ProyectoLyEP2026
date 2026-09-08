import {
    useEffect,
    useState
} from "react";

import {
    useNavigate,
    useParams
} from "react-router-dom";

import FormularioCliente
    from "../components/FormularioCliente.jsx";

import clienteService
    from "../services/clientesService.js";


// ==========================================
// PAGE CREAR / EDITAR CLIENTE
// ==========================================

const ClienteFormPage = () => {

    // ======================================
    // ROUTER
    // ======================================

    const navigate =
        useNavigate();

    const { id } =
        useParams();


    // Si existe id, estamos editando.
    const esEdicion =
        Boolean(id);


    // ======================================
    // ESTADOS
    // ======================================

    const [cliente, setCliente] =
        useState(null);

    const [cargando, setCargando] =
        useState(false);

    const [cargandoCliente, setCargandoCliente] =
        useState(esEdicion);

    const [mensajeError, setMensajeError] =
        useState("");


    // ======================================
    // CARGAR CLIENTE EN EDICIÓN
    // ======================================

    useEffect(() => {

        if (!esEdicion) {

            return;
        }


        const cargarCliente = async () => {

            try {

                setCargandoCliente(true);

                setMensajeError("");


                const clienteEncontrado =
                    await clienteService
                        .obtenerClientePorId(id);


                if (!clienteEncontrado) {

                    setMensajeError(
                        "No se encontró el cliente."
                    );

                    return;
                }


                setCliente(
                    clienteEncontrado
                );


            } catch (error) {

                console.error(
                    "Error al cargar cliente:",
                    error
                );

                setMensajeError(
                    "No se pudo cargar el cliente."
                );

            } finally {

                setCargandoCliente(false);
            }
        };


        cargarCliente();

    }, [id, esEdicion]);


    // ======================================
    // GUARDAR CLIENTE
    // ======================================

    const guardarCliente = async (
        datosCliente
    ) => {

        try {

            setCargando(true);

            setMensajeError("");


            // ==================================
            // EDITAR
            // ==================================

            if (esEdicion) {

                const actualizado =
                    await clienteService
                        .actualizarCliente(
                            id,
                            datosCliente
                        );


                console.log(
                    "CLIENTE ACTUALIZADO:"
                );

                console.table([
                    actualizado
                ]);


            // ==================================
            // CREAR
            // ==================================

            } else {

                const creado =
                    await clienteService
                        .crearCliente(
                            datosCliente
                        );


                console.log(
                    "CLIENTE CREADO:"
                );

                console.table([
                    creado
                ]);
            }


            // ==================================
            // LISTA ACTUALIZADA
            // ==================================

            const clientesActualizados =
                await clienteService
                    .obtenerClientes();


            console.log(
                "LISTA ACTUALIZADA DE CLIENTES:"
            );

            console.table(
                clientesActualizados
            );


            // ==================================
            // REDIRECCIÓN
            // ==================================

            navigate(
                "/clientes"
            );


        } catch (error) {

            /*
                Los errores de validación deben
                volver al FormularioCliente para
                mostrar cada campo.

                Por eso los relanzamos.
            */

            if (error.validationErrors) {

                throw error;
            }


            console.error(
                "Error al guardar cliente:",
                error
            );


            setMensajeError(
                "No se pudo guardar el cliente."
            );

            throw error;


        } finally {

            setCargando(false);
        }
    };


    // ======================================
    // CARGANDO CLIENTE
    // ======================================

    if (cargandoCliente) {

        return (
            <p>
                Cargando cliente...
            </p>
        );
    }


    // ======================================
    // CLIENTE NO ENCONTRADO
    // ======================================

    if (
        esEdicion &&
        !cliente
    ) {

        return (

            <div>

                <h1>
                    Cliente no encontrado
                </h1>

                {mensajeError && (

                    <p>
                        {mensajeError}
                    </p>
                )}

                <button
                    type="button"
                    onClick={() =>
                        navigate("/clientes")
                    }
                >
                    Volver
                </button>

            </div>
        );
    }


    // ======================================
    // PAGE
    // ======================================

    return (

        <main>

            <h1>

                {
                    esEdicion
                        ? "Editar cliente"
                        : "Crear cliente"
                }

            </h1>


            {mensajeError && (

                <p>
                    {mensajeError}
                </p>
            )}


            <FormularioCliente

                cliente={cliente}

                onSubmit={
                    guardarCliente
                }

                cargando={
                    cargando
                }

            />

        </main>
    );
};


export default ClienteFormPage;