import { createContext, useState, useEffect } from 'react'

export const AutorizacionesContext = createContext()

const AutorizacionesProvider = ({ children }) => {
  const [admin, setAdmin] = useState(() => {
    try {
      const adminGuardado = localStorage.getItem('admin')
      if (adminGuardado) {
        return JSON.parse(adminGuardado)
      }
    } catch (e) {
      console.error("Error al parsear el usuario almacenado en localStorage", e)
      localStorage.removeItem('admin')
    }
    return null
  })

  useEffect(() => {
    if (admin) {
      localStorage.setItem('admin', JSON.stringify(admin))
    } else {
      localStorage.removeItem('admin')
    }
  }, [admin])

  const cerrarSesion = () => {
    setAdmin(null)
  }

  // Helpers de rol del usuario activo
  const rol = admin?.sector || null
  const esGerencia = rol === 'Gerencia'
  const esSoporte = rol === 'Soporte'

  // Función para validar si el rol actual está incluido en una lista de roles autorizados
  const tieneRol = (rolesPermitidos = []) => {
    if (!admin) return false
    if (rolesPermitidos.length === 0) return true
    return rolesPermitidos.includes(admin.sector)
  }

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
  )
}

export default AutorizacionesProvider