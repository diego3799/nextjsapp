import React, { Fragment, useState } from 'react';
import Layout from '../components/layout/Layout';
import { Formulario, Campo, InputSubmit, Error } from '../components/ui/Formulario';
import {css} from '@emotion/core'
import firebase from '../firebase'
import Router from 'next/router'
import validarIniciarSesion from '../validacion/validarIniciarSesion';
import useValidacion from '../hooks/useValidacion';
const STATE_INICIAL={
  email: '',
  password: ''
}


const Login = () => {
  const {errores,valores,handleSubmit,handleChange,handleBlur}= useValidacion(STATE_INICIAL,validarIniciarSesion,iniciarSesion);
  const {email,password}=valores;
  const [error,setError]=useState(false)
  async function iniciarSesion(){
    try {
      await firebase.login(email,password);
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
            `}>Iniciar Sesión</h1>
            <Formulario
              noValidate 
              onSubmit={handleSubmit}>
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
                value="Iniciar Sesión"
              />
            </Formulario>
          </Fragment>
      </Layout>
    </div>
  );
}
 
export default Login;
