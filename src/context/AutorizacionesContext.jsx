import {
    createContext,
    useEffect,
    useState
} from "react";

export const AutorizacionesContext =
    createContext(null);


const AutorizacionesProvider = ({
    children
}) => {

    // ==========================================
    // ADMINISTRADOR EN SESIÓN
    // ==========================================

    const [admin, setAdmin] = useState(() => {

        try {

            const adminGuardado =
                localStorage.getItem("admin");


            if (adminGuardado) {

                return JSON.parse(
                    adminGuardado
                );
            }

        } catch (error) {

            console.error(
                "Error al leer el administrador guardado:",
                error
            );

            localStorage.removeItem(
                "admin"
            );
        }


        return null;
    });


    // ==========================================
    // PERSISTIR SESIÓN
    // ==========================================

    useEffect(() => {

        if (admin) {

            localStorage.setItem(
                "admin",
                JSON.stringify(admin)
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