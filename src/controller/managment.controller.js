import Managment from '../models/managment'


export const createManagment = async(req,res) => {
    console.log(req.userId)
    const {userId,startTime,endTime,totalHours,date,active} = req.body
    try {
        const newManagment = new Managment({userId,startTime,endTime,totalHours,date,active})
        const managmentSaved = await newManagment.save()
        res.status(200).json(managmentSaved)
    } catch (error) {
        res.status(400).json(error)
    }
}


export const getAllManagments = async (req,res) => {
    try{
        const allManagments = await Managment.find()
        res.status(200).json(allManagments)
    }catch (error){
        res.status(400).json(error)
    }
}


export const getManagmentById = async (req,res) => {
    console.log(req.params.id)
    try{
        const managment = await Managment.findById(req.params.id)
        res.status(200).json(managment)
    }catch (error){
        res.status(400).json(error)
    }
}


export const deleteManagment = async (req,res) => {
    try{
        const managmentDeleted = await Managment.findByIdAndDelete(req.params.id)
        res.status(200).json({res:'Gestion Eliminada'})
    }catch (error){
        res.status(400).json({error})
    }

}


export const checkManagmentActive = async (req,res) => {
    console.log('estamos entrando al metodo')

    try{
        const now = new Date();
        const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
        const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
    
        // Buscar si ya existe un managment de hoy y si esta activo
        const existingManagment = await Managment.findOne({
          date: { $gte: startOfDay, $lt: endOfDay },
          active:true
        });
    
        if (existingManagment) {
            return res.status(200).json({
              exists: true,
              active: existingManagment.active,
              managment: existingManagment,
            });
          } else {
            return res.status(200).json({
              exists: false,
              active: false,
            });
          }
    }catch (error) {
        console.error(error);
        res.status(500).json({
          message: 'Error al verificar el managment de hoy',
          error,
        });
      }

}


export const checkManagmentToday = async (req, res) => {
    try {
     
      const  userId  = req.userId; // o req.userId si lo tomás del token
  
      if (!userId) {
        return res.status(400).json({ message: 'Falta el userId' });
      }
  
      // Calcular inicio y fin del día (00:00:00 → 23:59:59)
      const now = new Date();
      const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 0, 0, 0);
      const endOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 0, 0, 0);
  
      // Buscar si ya existe un managment de hoy
      const existingManagment = await Managment.findOne({
        userId,
        date: { $gte: startOfDay, $lt: endOfDay },
      });
  
      if (existingManagment) {
        return res.status(200).json({
          exists: true,
          active: existingManagment.active,
          managment: existingManagment,
        });
      } else {
        return res.status(200).json({
          exists: false,
          active: false,
        });
      }
  
    } catch (error) {
      console.error(error);
      res.status(500).json({
        message: 'Error al verificar el managment de hoy',
        error,
      });
    }
  };