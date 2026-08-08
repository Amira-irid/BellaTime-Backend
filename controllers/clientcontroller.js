const bcrypt= require('bcrypt');
const db =require('../mysql/db');
const jwt=require('jsonwebtoken');
const SECRET_KEY='bellatime_secret_key';




const inscription=async(req,res)=>{
    const {nom,email,telephone,password}=req.body;
    try{
        const verf='SELECT * FROM clients WHERE email = ?';
        db.query(verf,[email],async(err,result)=>{
             if(err)
               return  res.status(500).json({
                    message:'erreur serveur'
                })
            
            if(result.length>0)
               return  res.status(400).json({
                    message:'Email deja exist'
                })
            


        
        const hashpassword= await  bcrypt.hash(password,10);

    const sql =' INSERT INTO clients (nom,email,telephone,password) Values (?,?,?,?)'
    db.query(sql,[nom,email,telephone,hashpassword],(err,result)=>{
        if(err){
                   

                return res.status(500).json({
                    message:'Erreur lors de inscription'
                });

        }
         res.status(201).json({
                message:'Inscription réussie'
            });
        
        

    });
});

    
} 
catch(error){
    console.error(error);
    res.status(500).json({
        message:'erreur serveur'
    });
}
}
const login=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const sql='SELECT * FROM clients WHERE email =?';
        db.query(sql,[email,password],async(err,result)=>{
            if(err){
                return res.status(500).json({
                    message:'resseuye'
                })
            }  
            if(result.length===0){
                return res.status(404).json({
                    message:'Email ou mot de passe incorrect'
                })

            }
            const client=result[0];
            const isMatch=await bcrypt.compare(
                password,client.password);
                if(!isMatch){
                    return res.status(401).json({
                        message:'Email ou mot de passe incorrect'
                    })
                }
                const token=jwt.sign(
                    {
                        id:client.id,
                        email:client.email
                    },
                    SECRET_KEY,{
                        expiresIn:'7d'
                    }
                );

            res.status(201).json({
                message:'login reussie',
                token,
                client: {
                    id: client.id,
                    nom: client.nom,
                    email: client.email,
                    telephone: client.telephone,}
            })



        })


    }
    catch(error){
         console.error(error);
    res.status(500).json({
        message:'erreur serveur'
    });

    }



}  
const getallcategorie=async(req,res)=>{
    const sql='SELECT * FROM categories';
    db.query(sql,async(err,result)=>{
       if(err){
        return res.status(500).json({
            message:'erreur serveur'
        })
       }
       res.status(201).json({
        message:'categorie affiche',
        categories:result
       })

    })
} 
const getservices=async(req,res)=>{
    const {categorie_id}=req.params;
    const sql='SELECT * FROM services WHERE categorie_id = ?';
    db.query(sql,[categorie_id],async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        }
        res.status(201).json({
            message:'services afficher',
            service: result,
        })
    })

}  
const getemploye= async(req,res)=>{
    const {categorie_id}=req.params;
    const sql='SELECT * FROM employees WHERE categorie_id = ?';
    db.query(sql,[categorie_id],async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        } 
        res.status(200).json({
            message:'employe affiche',
            employees:result
        })
    })
}  
const createreservation= async(req,res)=>{
    const{client_id,employee_id,service_id,date_rdv,heure_rdv}=req.body;
    const sql= 'INSERT INTO reservations (client_id, employee_id, service_id, date_rdv, heure_rdv, status) VALUES (?,?,?,?,?,?)';
    db.query(sql,[client_id,employee_id,service_id,date_rdv,heure_rdv,'pending'],async(err,result)=>{
        if(err){
               console.error(err);
            return res.status(500).json({
                message:'erreur serveur',
                  error: err.message
            })
        }  
        res.status(201).json({
            message:'reservation creer ',
          
        })
          sendNotification(employee_id, "Nouvelle réservation reçue");
    })
}   
 
const getNotifications = (req, res) => {
    const {  receiver_id } = req.params;

    const sql = "SELECT * FROM notifications WHERE  receiver_id = ?";

    db.query(sql, [ receiver_id], (err, result) => {
        if (err) return res.status(500).json(err);

        res.json(result);
    });
};
module.exports = {inscription,
    login,
getallcategorie,
getservices,
getemploye,
createreservation,

getNotifications



} ;
