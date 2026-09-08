import { Navigate } from 'react-router'
import useAutorizaciones from '../hooks/useAutorizaciones'

const RutaProtegida = ({ children, rolesPermitidos = [] }) => {
  const { admin, tieneRol } = useAutorizaciones()
  //Hay sesión iniciada, sino redirige al login
  if (!admin) {
    return <Navigate to="/login" replace />
  }
  //Si se definieron roles permitidos y el usuario no cumple con el rol, redirigir a la página principal
  if (rolesPermitidos.length > 0 && !tieneRol(rolesPermitidos)) {
    return <Navigate to="/" replace />
  }
  return children
}
export default RutaProtegida