import {
    createContext,
    useEffect,
    useState
} from "react";

import leerJSONLocalStorage
    from "../utils/leerJSONLocalStorage.js";
import {
    administradores
} from "../services/administradoresInicializados.js";

export const AutorizacionesContext =
    createContext(null);


const AutorizacionesProvider = ({
    children
}) => {

    // ==========================================
    // ADMINISTRADOR EN SESIÓN
    // ==========================================

    const [admin, setAdmin] = useState(() => {

        const sesionGuardada = leerJSONLocalStorage(
            "admin",
            null
        );

        if (!sesionGuardada || !sesionGuardada.id) {

            return null;
        }

        const adminEncontrado = administradores.find(
            adm => adm.id === Number(sesionGuardada.id)
        );

        // Si no existe o está inactivo → sesión null y se limpia la clave.
        if (!adminEncontrado || !adminEncontrado.is_active) {

            localStorage.removeItem("admin");
            return null;
        }

        return adminEncontrado.toJSON();
    });


    // ==========================================
    // PERSISTIR SESIÓN
    // ==========================================

    useEffect(() => {

        if (admin && admin.id) {

            localStorage.setItem(
                "admin",
                JSON.stringify({
                    id: admin.id
                })
            );

        } else {

            localStorage.removeItem(
                "admin"
            );
        }

    }, [admin]);


    // ==========================================
    // CERRAR SESIÓN
    // ==========================================

    const cerrarSesion = () => {

        setAdmin(null);
    };


    // ==========================================
    // ROL / SECTOR
    // ==========================================

    const rol =
        admin?.sector ?? null;


    // Deben coincidir exactamente con
    // SECTORES = ["GERENTE", "SOPORTE"].
    const esGerencia =
        rol === "GERENTE";

    const esSoporte =
        rol === "SOPORTE";


    // ==========================================
    // VERIFICAR PERMISOS
    // ==========================================

    const tieneRol = (
        rolesPermitidos = []
    ) => {

        if (!admin) {

            return false;
        }


        if (
            rolesPermitidos.length === 0
        ) {

            return true;
        }


        return rolesPermitidos.includes(
            admin.sector
        );
    };


    return (

        <AutorizacionesContext.Provider
            value={{
                admin,
                setAdmin,
                cerrarSesion,
                rol,
                esGerencia,
                esSoporte,
                tieneRol
            }}
        >

            {children}

        </AutorizacionesContext.Provider>
    );
};


export default AutorizacionesProvider;