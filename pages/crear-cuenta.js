import React, { Fragment, useState } from 'react';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import {css} from '@emotion/core'
import useValidacion from '../hooks/useValidacion';
import validarCrearCuenta from '../validacion/validarCrearCuenta';
import firebase from '../firebase'
import Router from 'next/router'
const STATE_INICIAL={
  nombre: '',
  email: '',
  password: ''
}


const CrearCuenta = () => {
  const {errores,valores,handleSubmit,handleChange,handleBlur}= useValidacion(STATE_INICIAL,validarCrearCuenta,crearCuenta);
  const {nombre,email,password}=valores;
  const [error,setError]=useState(false)
  async function crearCuenta(){
    try {
      await firebase.registrar(nombre,email,password);
      Router.push('/')
    } catch (error) {
      setError(error.message)
    }
  }
  return (
    <div>
      <Layout>
          <Fragment>
            <h1 css={css`
                text-align:center;
                margin-top:5rem;
            `}>Crear Cuenta</h1>
            <Formulario
              noValidate 
              onSubmit={handleSubmit}>
                <Campo>
                    <label htmlFor="nombre">Nombre</label>
                        <input 
                            type="text"
                            id="nombre"
                            placeholder="Tu Nombre"
                            name="nombre"
                            value={nombre}
                            onChange={handleChange}
                            onBlur={handleBlur}
                        />
                </Campo>
                      {errores.nombre && <Error>{errores.nombre}</Error> }
                <Campo>
                    <label htmlFor="email">Email</label>
                    <input 
                        type="email"
                        id="email"
                        placeholder="Tu Email"
                        name="email"
                        value={email}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    />
                </Campo>
                    {errores.email && <Error>{errores.email}</Error> }
                <Campo>
                <label htmlFor="password">Password</label>
                <input 
                      type="password"
                      id="password"
                      placeholder="Tu Password"
                      name="password"
                      value={password}
                      onChange={handleChange}
                      onBlur={handleBlur}
                  />
                </Campo>
                  {errores.password && <Error>{errores.password}</Error> }
                  {error&& <Error>{error}</Error> }
                
                <InputSubmit
                type="submit"
                value="Crear Cuenta"
              />
            </Formulario>
          </Fragment>
      </Layout>
    </div>
  );
}
 
export default CrearCuenta;
