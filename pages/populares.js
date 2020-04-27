import React,{useEffect, useState, useContext} from 'react';
import styled from '@emotion/styled'
import Layout from '../components/layout/Layout';
import { FirebaseContext } from '../firebase';
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';

const Populares = () => {

  const {productos:data}=useProductos('votos')
  return (
    <div>
      <Layout>
        <div className="listado-productos">
          <div className="contenedor">
            <ul className="bg-white">
              {data.map(item=><DetallesProducto 
              key={item.id}
              producto={item}
              />)}
            </ul>
          </div>
        </div>

      </Layout>
    </div>
  );
}
 
export default Populares;
