import { Routes, Route, Navigate } from 'react-router-dom'

import Login from '../pages/Login'
import Dashboard from '../pages/Dashboard'
import ListaClientes from '../pages/ListaClientes'
import DetalleCliente from '../pages/DetalleCliente'
import ErrorPage from '../pages/ErrorPage'
import RutaProtegida from '../components/RutaProtegida'

import ClienteFormPage
    from "../pages/ClienteFormPage"

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/clientes/nuevo"
        element={<ClienteFormPage />}
      />

      {/* Esta ruta debe estar protegida ya que es para editar el cliente por un administrador
      IMPORTANTE: no se debe mostrar o modificar el password del cliente. */}
      <Route
        path="/clientes/editar/:id"
        element={<ClienteFormPage />}
      />

      
      <Route path="/login" element={<Login />} />
      <Route
        path="/"
        element={
          <RutaProtegida>
            <Dashboard />
          </RutaProtegida>
        }
      />
      <Route
        path="/clientes"
        element={
          <RutaProtegida rolesPermitidos={['Gerencia', 'Soporte']}>
            <ListaClientes />
          </RutaProtegida>
        }
      />
      <Route
        path="/clientes/:id"
        element={
         <RutaProtegida rolesPermitidos={['Gerencia', 'Soporte']}>
          <DetalleCliente />
         </RutaProtegida>
      }
      />
      <Route path="*" element={<ErrorPage />} />

    </Routes>
  )
}
export default AppRoutes