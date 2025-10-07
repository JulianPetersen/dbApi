import Role from '../models/Role'

export const createRoles = async () => {

    try {
        //estimatedDocumentCount es un metodo que sirve para verificar sin en la coleccion, ya existen documentos
        const count = await Role.estimatedDocumentCount();

        if(count > 0) return; //si el contador es mayor que cero, termina la funcion, pq ya existen documentos

        //sino, creamos los roles
        const values = await Promise.all([
            new Role({ name: 'moderator' }).save(),
            new Role({ name: 'admin' }).save(),
        ])  
 
    } catch(error) {
        console.error(error)
    } 

} 