import React, { useEffect, useContext, useState, Fragment } from 'react';
import {useRouter} from 'next/router'
import { FirebaseContext } from '../../firebase';
import Error404 from '../../components/layout/404';
import Layout from '../../components/layout/Layout';
import { css } from '@emotion/core';
import styled from '@emotion/styled';
import { formatDistanceToNow } from 'date-fns';
import {es}from 'date-fns/locale';
import {Campo,InputSubmit} from '../../components/ui/Formulario'
import Boton from '../../components/ui/Boton';

const ContenedorProducto=styled.div`
@media (min-width:768px){
    display:grid;
    grid-template-columns: 2fr 1fr;
    column-gap: 2rem;
}
`
const CreadorProducto=styled.p`
    padding: .5rem 2rem;
    background-color: #da552f;
    color:#fff;
    text-transform: uppercase;
    font-weight: bold;
    display: inline-block;
    text-align:center;
`
const Producto = () => {
    const [comentario,setComentario]=useState({})
    const [error,setError]=useState(false)
    const [producto,setProducto]=useState({});
    const [consultar,setConsultar]=useState(true)
    //routing
    const router=useRouter();
    const {query: {id}}=router;
    const {firebase,usuario}=useContext(FirebaseContext)
    const {  comentarios, creado, descripcion, empresa, nombre, url, urlimagen, votos,creador,haVotado} = producto;
    useEffect(()=>{
        if(id&&consultar){
        
            const obtenerProducto=async()=>{
                const ProductoQuery=await firebase.db.collection('productos').doc(id);
                const productoDB=await ProductoQuery.get();
                // console.log(producto.data())
                if(productoDB.exists){
                    // console.log("existe")
                    setProducto(productoDB.data())
                }else{
                    setError(true)
                    // console.log("no exist")
                }
                setConsultar(false)
                
            }
            obtenerProducto()
        }
    },[id,producto])
    if(Object.keys(producto).length===0&&!error)
        return '...Cargando'
    const votarProducto=async ()=>{
        if(!usuario){
            return router.push("login")
        }
        if(haVotado.includes(usuario.uid)){
            return;
        }
        //obtener voto
        const hanVotado=[...haVotado,usuario.uid]
        const nuevoTotal=votos+1;
        //actualizamos la base de datos
        const ProductoQuery=await firebase.db.collection('productos').doc(id).update(
            {votos:nuevoTotal,
                haVotado:hanVotado}
                );
        setProducto({
            ...producto,
            votos:nuevoTotal
        })
        setConsultar(true)
    }
    const comentarioChange=e=>{
        setComentario({
            ...comentario,
            [e.target.name]:e.target.value
        })
    }
    const esCreador=(id)=>{
        if(creador.id===id){
            return true
        }
    }
    const agregarComentario=(e)=>{
        // console.log(comentario)
        e.preventDefault();
        if(!usuario){
            return router.push('/login');
        }

        comentario.usuarioId=usuario.uid;
        comentario.usuarioNombre=usuario.displayName;
        
        const nuevoComentarios=[...comentarios,comentario];
        firebase.db.collection('productos').doc(id).update({
            comentarios:nuevoComentarios
        })

        setProducto({
            ...producto,
            comentarios:nuevoComentarios
        })
        setConsultar(true)
    }
    const puedeBorrar=()=>{
        if(!usuario){
            return false;
        }
        if(creador.id===usuario.uid){
            return true;
        }
    }
    const eliminarProducto=async()=>{
        if(!usuario){
            return router.push('/login');
        }
        if(creador.id!==usuario.uid){
            return router.push('/')
        }
        try{
            await firebase.db.collection('productos').doc(id).delete();
            router.push('/')
        }catch(e){
            console.log("error")
        }

    }
    return ( 
    <Layout>
        <Fragment>
            {error?<Error404/>:
             <div className="contenedor" >
             <h1
                 css={
                     css`
                         text-align:center;
                         margin-top: 5rem;
                     `
                 }
             
             >{nombre}</h1>
             <ContenedorProducto>
                 <div>
                 <p>Publicado hace: { formatDistanceToNow(new Date(creado),{locale:es})} </p>

                 <p>Por: {creador.nombre} de {empresa}</p>
                 <img src={urlimagen}/>
                 <p>{descripcion}</p> 
                 <h2>Agrega tu comentario</h2>
                 <form onSubmit={agregarComentario}>
                     <Campo>
                         <input
                             type="text"
                             name="mensaje"
                             onChange={comentarioChange}
                         />
                     </Campo>
                     <InputSubmit
                         
                         type='submit'
                         value="Agregar Comentario"
                     />
                 </form>
                 <h2 css={css`margin:2rem 0;`}>Comentarios</h2>
                 {comentarios.length===0?"Aún no hay comentarios":
                 <ul>
                     {comentarios.map((item,i)=>
                             <li key={`${item.usuarioId}-${i}`}
                                 css={css`
                                     border:1px solid  #e1e1e1;
                                     padding: 2rem;
                                     margin: 2rem;
                                 `}
                             >
                                 <p>{item.mensaje}</p>
                                 <p>Escrito por:
                                     <span css={css`font-weight:bold;`}>
                                        {' '} {item.usuarioNombre}    
                                     </span> 
                                 </p>
                                 {esCreador(item.usuarioId)&&<CreadorProducto>
                                         Es creador
                                     </CreadorProducto>}
                             </li>
                         )}
                 </ul>
                 
                 }
                 
                 </div>
                 <aside>
                     <Boton
                         target="_blank"
                         bgColor
                         href={url}
                     >
                         Visitar URL
                     </Boton>
                     <div css={css`margin-top:5rem;`}>
                         <p css={css`text-align:center;`} >{votos} votos</p>
                         {usuario&&(
                             <Boton
                             onClick={votarProducto}
                             >
                             Votar
                         </Boton>
                         )}
                         
                         
                     </div>
                 </aside>

             </ContenedorProducto>
             {puedeBorrar()&&<Boton onClick={eliminarProducto} > Eliminar Producto</Boton>}

         </div>
     
            
            }
           </Fragment>
    </Layout> 
    );
}
 
export default Producto;