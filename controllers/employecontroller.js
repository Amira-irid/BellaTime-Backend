const bcrypt= require('bcrypt');
const db =require('../mysql/db');
const jwt=require('jsonwebtoken');
const SECRET_KEY='bellatime_secret_key';
const { sendNotification } = require('../notification/notification');


const inscriptionemployee=async(req,res)=>{
    const {nom,email,telephone,password}=req.body;
    try{
        const verf='SELECT * FROM employees WHERE email = ?';
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

    const sql =' INSERT INTO employees (nom,email,telephone,password) Values (?,?,?,?)'
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
const loginemploye=async(req,res)=>{
    const {email,password}=req.body;
    try{
        const sql='SELECT * FROM employees WHERE email =?';
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
            const employe=result[0];
            const isMatch=await bcrypt.compare(
                password,employe.password);
                if(!isMatch){
                    return res.status(401).json({
                        message:'Email ou mot de passe incorrect'
                    })
                }
                const token=jwt.sign(
                    {
                        id:employe.id,
                        email:employe.email
                    },
                    SECRET_KEY,{
                        expiresIn:'7d'
                    }
                );

            res.status(201).json({
                message:'login reussie',
                token,
                employe: {
                    id: employe.id,
                    nom: employe.nom,
                    email: employe.email,
                    telephone: employe.telephone,}
            })



        })


    }
    catch(error){
         console.error(error);
    res.status(500).json({
        message:'erreur serveur'
    });

}};    

const getDashboard = async (req, res) => {

    const { employee_id } = req.params;

    const nbreservation_sql = `
        SELECT COUNT(*) AS nb_reservations
        FROM reservations
        WHERE employee_id = ?
    `;

    db.query(nbreservation_sql, [employee_id], (err, nb_reservation) => {

        if (err) {
            return res.status(500).json({
                message: 'Erreur nb_reservation'
            });
        }

        const todayreservation_sql = `
            SELECT COUNT(*) AS today_reservations
            FROM reservations
            WHERE employee_id = ?
            AND date_rdv = CURDATE()
        `;

        db.query(todayreservation_sql, [employee_id], (err, today_reservation) => {

            if (err) {
                return res.status(500).json({
                    message: 'Erreur today reservation'
                });
            }

            const revenu_sql = `
                SELECT SUM(s.prix) AS revenus
                FROM reservations r
                JOIN services s
                ON r.service_id = s.id
                WHERE r.employee_id = ?
                AND r.status = 'completed'
            `;

            db.query(revenu_sql, [employee_id], (err, revenu) => {

                if (err) {
                    return res.status(500).json({
                        message: 'Erreur revenu'
                    });
                }

                res.status(200).json({

                    nb_reservations:
                        nb_reservation[0].nb_reservations,

                    today_reservations:
                        today_reservation[0].today_reservations,

                    revenus:
                        revenu[0].revenus || 0

                });

            });

        });

    });

};
   
const getreservationemploye= async(req,res)=>{ 
    const {client_id, service_id}=req.params;
    const sql ='SELECT c.nom AS client_name , s.nom AS service_name,r.date_rdv, r.heure_rdv, r.status FROM reservations r JOIN clients c ON r.client_id = c.id JOIN services s ON r.service_id = s.id';

    db.query(sql,[client_id, service_id],async(err,result)=>{

        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        } 
        res.status(201).json({
            message:'reservation affiche',
            reservation:result
        })
    })

    
}  
const updateReservationStatus = async (req, res) => {

    const { id } = req.params;
    const { status } = req.body;

    const updateSql = ' UPDATE reservations SET status = ? WHERE id = ?';

    db.query(updateSql, [status, id], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: "Erreur serveur"
            });
        }

        const getClientSql = ' SELECT client_id FROM reservations WHERE id = ?';

        db.query(getClientSql, [id], (err, reservation) => {

            if (err) {
                return res.status(500).json({
                    message: "Erreur serveur"
                });
            }

            const client_id = reservation[0].client_id;

            if (status === "accepted") {
                sendNotification(
                    client_id,
                    "Votre réservation est confirmée"
                );
            }

            if (status === "refused") {
                sendNotification(
                    client_id,
                    "Votre réservation est refusée"
                );
            }

            res.status(200).json({
                message: "Status mis à jour avec succès"
            });

        });

    });

}; 
const consulteplaning = async (req,res)=>{
     const { employee_id } = req.params;

    const todaySql = `SELECT * FROM reservations WHERE employee_id = ? AND date_rdv = CURDATE() AND status = 'accepted'`;

    db.query(todaySql, [employee_id], (err, today) => {

        if (err) {
            return res.status(500).json({
                message: "Erreur rendez-vous aujourd'hui"
            });
        }

        const weekSql = `
            SELECT *
            FROM reservations
            WHERE employee_id = ?
            AND YEARWEEK(date_rdv,1)=YEARWEEK(CURDATE(),1)
            AND status='accepted'
        `;

        db.query(weekSql, [employee_id], (err, week) => {

            if (err) {
                return res.status(500).json({
                    message: "Erreur rendez-vous semaine"
                });
            }

            const hourSql = `
                SELECT heure_rdv
                FROM reservations
                WHERE employee_id = ?
                AND status='accepted'
            `;

            db.query(hourSql, [employee_id], (err, hours) => {

                if (err) {
                    return res.status(500).json({
                        message: "Erreur horaires"
                    });
                }

                res.status(200).json({

                    rendez_vous_aujourdhui: today,

                    rendez_vous_semaine: week,

                    horaires_reserves: hours

                });

            });

        });

    });
}

module.exports={inscriptionemployee,loginemploye,  getDashboard,
    getreservationemploye,updateReservationStatus,consulteplaning
};