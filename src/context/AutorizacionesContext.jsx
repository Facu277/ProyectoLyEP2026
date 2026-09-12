import {
    createContext,
    useEffect,
    useState
} from "react";

import leerJSONLocalStorage
    from "../utils/leerJSONLocalStorage.js";

export const AutorizacionesContext =
    createContext(null);


const AutorizacionesProvider = ({
    children
}) => {

    // ==========================================
    // ADMINISTRADOR EN SESIÓN
    // ==========================================

    const [admin, setAdmin] = useState(() => {

        return leerJSONLocalStorage(
            "admin",
            null
        );
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