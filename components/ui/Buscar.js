import React, { useState } from 'react';

import styled from '@emotion/styled'
import { css } from '@emotion/core';
import Router from 'next/router'

const InputText=styled.input`
    border: 1px solid var(--gris3);
    padding:1rem;
    min-width:300px;
`
const InputSubmit=styled.button`
    height:3rem;
    width:3rem;
    display:block;
    background-size: 4rem;
    background-image: url(/static/img/buscar.png);
    background-repeat: no-repeat;
    position: absolute;
    right: 1rem;
    top:1px;
    background-color: white;
    border: none;
    text-indent:-999px;
    &:hover{
        cursor:pointer;
    }
`
const Buscar = () => {
    const [buscar,setBuscar]=useState('');
    const buscarProducto=e=>{
        e.preventDefault();
        if(buscar.trim()==='') return;
        Router.push({
            pathname:"/buscar",
            query:{
                q:buscar
            }
        })
    }
    return ( 
        <form
        onSubmit={buscarProducto}  
        css={css`
            position:relative;
        `}> 
            <InputText  onChange={e=>setBuscar(e.target.value)}  type="text" placeholder="Buscar Productos"/>
            <InputSubmit  type="submit">Buscar</InputSubmit>
        </form>
     );
}
 
export default Buscar;