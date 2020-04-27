import React, { useEffect, useState } from 'react';
import Layout from '../components/layout/Layout';
import {useRouter} from 'next/router'
import DetallesProducto from '../components/layout/DetallesProducto';
import useProductos from '../hooks/useProductos';
const Buscar = () => {
  const router=useRouter();
  const [data,setData]=useState([]);
  const {query:{q}}=router;
  const {productos}=useProductos('creado');
  useEffect(()=>{
    if(q){
      const busqueda=q.toLocaleLowerCase();
      const filtro= productos.filter(item=>{
        return(
          item.nombre.toLocaleLowerCase().includes(busqueda)||
          item.descripcion.toLocaleLowerCase().includes(busqueda)
        )
      })
      setData(filtro)
      // console.log(filtro)
    }
  },[q,productos])
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
 
export default Buscar;
