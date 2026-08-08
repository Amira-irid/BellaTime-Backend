const bcrypt= require('bcrypt');
const db =require('../mysql/db');
const jwt=require('jsonwebtoken');
const SECRET_KEY='bellatime_secret_key';


 
const nombre_reservation = async(req,res)=>{

    const sql = 'SELECT COUNT(*) AS nombre_reservation FROM reservations';
    db.query(sql,async(err,result)=>{

        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            }) 
            
        } 
        res.status(200).json({
                message:'nombre reservation afficher',
                nombre_reservation: result[0].nombre_reservation

            })
    })
}    
const nombre_client = async(req,res)=>{
    const sql ='SELECT COUNT(*) AS nombre_client FROM clients';
    db.query(sql,async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            }) 
        
        } 
         res.status(200).json({
                message:'nombre client afficher',
                nombre_client:result[0].nombre_client
            })
    })
} 
const nombre_employee = async(req,res)=>{
    const sql ='SELECT COUNT(*) AS nombre_employee FROM employees';
    db.query(sql,async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        } 
         res.status(200).json({
            message:'nombre employee affiche',
            nombre_employee:result[0].nombre_employee
         })
    })
}  
const revenu = async(req,res)=>{
    const sql=`SELECT SUM(s.prix) AS revenus FROM reservations r 
    JOIN services s ON r.service_id = s.id WHERE r.status = 'completed'`;
    db.query(sql,async(err,result)=>{
        if(err){ 
          
            return res.status(500).json({
                message:'erreur serveur'
            })
        }  
        res.status(200).json({
            message:'revenu afficher',
             revenus: result[0].revenus
        })
    })
} 
const nombre_services= async(req,res)=>{
    const sql='SELECT COUNT(*) AS nombre_services FROM services';
    db.query(sql,async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        } 
        res.status(200).json({
            message:'nombre services affiche',
            nombre_services:result[0].nombre_services
        })
    })
} 
const nombre_categories= async(req,res)=>{
    const sql ='SELECT COUNT(*) AS nombre_categories FROM categories';
    db.query(sql,async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        }  
        res.status(200).json({
            message:'nombre de categories affiche',
            nombre_categories:result[0].nombre_categories
        })
    })
}  
     const reservation_semain = async(req,res)=>{
        const sql= `SELECT
DAYNAME(date_rdv) AS jour,
COUNT(*) AS total
FROM reservations
WHERE YEARWEEK(date_rdv,1)=YEARWEEK(CURDATE(),1)
GROUP BY DAYNAME(date_rdv)`;
      db.query(sql,async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur de serveur'
            })
        }  
          res.status(200).json({
            message:'affichage reussie',
            reservation_semain:result
          })
      })  

     }  
   const Tendances_revenus = async(req,res)=>{
    const sql =`SELECT
    DATE_FORMAT(r.date_rdv,'%d-%m-%Y') AS jour,
    SUM(s.prix) AS revenus
FROM reservations r
JOIN services s
ON r.service_id = s.id
WHERE r.status = 'completed'
AND YEARWEEK(r.date_rdv,1)=YEARWEEK(CURDATE(),1)
GROUP BY DATE_FORMAT(r.date_rdv,'%d-%m-%Y')`;
 db.query(sql,async(err,result)=>{
    if(err){ 
        console.log(err);
        return res.status(500).json({
            message:'erreur serveur'
        })
    } 
     res.status(200).json({
        message:'affichage reussite',
        Tendances_revenus:result

     })
 })
   }
   const reservation_recentes = async(req,res)=>{
    const sql =`SELECT
    r.id,
    c.nom AS client,
    e.nom AS employee,
    s.nom AS service,
    r.date_rdv,
    r.heure_rdv,
    r.status
FROM reservations r
JOIN clients c
ON r.client_id = c.id
JOIN employees e
ON r.employee_id = e.id
JOIN services s
ON r.service_id = s.id
ORDER BY r.created_at DESC
LIMIT 5`;
 db.query(sql,async(err,result)=>{
    if(err){ 
        console.log(err);
        return res.status(500).json({
            message:'erreur serveur'
        })
    } 
     res.status(200).json({
        message:'affichage reussite',
        reservation_recentes:result

     })
 })
   }  

   const ajoutecategorie = async (req, res) => {

    const { nom, description, image_url } = req.body;

    // Vérifier si la catégorie existe déjà
    const verf = 'SELECT * FROM categories WHERE nom = ?';

    db.query(verf, [nom], (err, result) => {

        if (err) {
            return res.status(500).json({
                message: 'Erreur serveur'
            });
        }

        // Si la catégorie existe déjà
        if (result.length > 0) {
            return res.status(400).json({
                message: 'Cette catégorie existe déjà'
            });
        }

        // Ajouter la catégorie
        const sql = `
            INSERT INTO categories (nom, description, image_url)
            VALUES (?, ?, ?)
        `;

        db.query(sql, [nom, description, image_url], (err, result) => {

            console.log(err);

            if (err) {
                return res.status(500).json({
                    message: 'Erreur serveur'
                });
            }

            res.status(201).json({
                message: 'Catégorie ajoutée avec succès'
            });

        });

    });

}; 
const modifiecategorie = async(req,res)=>{ 
        const { id } = req.params;
    const {nom,description,image_url}=req.body
    const sql ='UPDATE categories SET nom=?,description =? , image_url=? WHERE id =?';
    db.query(sql,[nom,description,image_url,id],async(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message:'erreur serveur'
            })
        } 
        res.status(200).json({
            message:'modification reussie'
        })
        })

}  
const suppcategorie = async(req,res)=>{
    const{ id }=req.params;
    const sql=' DELETE FROM categories WHERE id =?';
    db.query(sql,[id],async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        } 
        res.status(200).json({
            message:'suprission reussie '
        })
    })
}   
const affichecategorie=async(req,res)=>{
    const sql ='SELECT * FROM categories';
    db.query(sql,async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        } 
        res.status(200).json({
            message:'affichage reussie',
            categories:result
        })
    }
)
}

const ajouteservice = async(req,res)=>{
    const {categorie_id}=req.params;
    const {nom,description,prix,duree,image_url}=req.body;
    const verf ='SELECT * FROM services WHERE nom =?';
    db.query(verf,[nom],async(err,result)=>{
         console.log("URL =", req.originalUrl);
    console.log("params =", req.params);
    console.log("body =", req.body);
        if(err){
            console.log(err);
                  return res.status(500).json({
                    message:'erreur serveur'
                  })
        } 
        if(result.length>0){
            return res.status(400).json({
                message:'ce service existe'

            })

        }   
        const sql =' INSERT INTO services (nom,description,prix,duree,image_url,categorie_id) VALUES (?,?,?,?,?,?)';
    db.query(sql,[nom,description,prix,duree,image_url,categorie_id],async(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message:'erreur serveur'
            })
        }
          res.status(200).json({
            message:'insertion reussie'
          })
    })
    })  
    
}  

const modifieservices = async(req,res)=>{
    const{id}=req.params;
    const{nom,description,prix,duree,image_url,categorie_id}=req.body;
    const sql ='UPDATE services SET nom=?,description=?,prix=?, duree=?, image_url=?,categorie_id=? WHERE id=? ';
    db.query(sql,[nom,description,prix,duree,image_url,categorie_id,id],async(err,result)=>{
        if(err){
            return res.status(500).json({})
            message:'erreur serveur'
        } 
        res.status(200).json({
            message:' modification reussie'
        })
    })
}  
 const suppservice=async(req,res)=>{
    const{id}=req.params;
    const sql ='DELETE FROM services WHERE id=?';
    db.query(sql,[id],async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        }  
        res.status(200).json({
            message:'supprission reussite'
        })
    })
 } 
 const afficheservice=async(req,res)=>{
    const sql =`SELECT
    services.id,
    services.nom,
    services.description,
    services.prix,
    services.duree,
    services.image_url,
    categories.nom AS categorie
FROM services
LEFT JOIN categories
ON services.categorie_id = categories.id;`;
    db.query(sql,async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        }  
        res.status(200).json({
            message:'affichage reussie',
            services:result
        })

    })
 }  
 const modifieemploye =async(req,res)=>{
    const{id}=req.params;
    const{nom,email,telephone,specialite,categorie_id}=req.body;

    const sql='UPDATE employees SET nom=? , email=?,telephone=?,specialite=?,categorie_id=? WHERE id=?';
    db.query(sql,[nom,email,telephone,specialite,categorie_id,id],async(err,result)=>{
        if(err){
            console.log(err);
            return res.status(500).json({
                message:'erreur serveur'
            }) 
        } 
        res.status(200).json({
            message:'modification reussie'
        })
    })
 }  
 const suppemployee = async(req,res)=>{
    const{id}=req.params;
    const sql='DELETE FROM employees WHERE id=?';
    db.query(sql,[id],async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        } 
        res.status(200).json({
            message:'supprission reussite'
        })
    })
 } 
 const afficheemployee=async(req,res)=>{

    const sql =`SELECT
e.id,
e.nom,
e.email,
e.telephone,
e.specialite,
c.nom AS categorie
FROM employees e
LEFT JOIN categories c
ON e.categorie_id = c.id;`
    db.query(sql,async(err,result)=>{
        if(err){
            return res.status(500).json({
                mesage:'erreur serveur'
            })
        } 
        res.status(200).json({
            message:'affichage reussie',
            employees:result
        })
    })
 }    

const affichereservation =async(req,res)=>{
    const sql =`SELECT
    r.id,
    c.nom AS client,
    e.nom AS employee,
    s.nom AS service,
     s.prix,
    r.date_rdv,
    r.heure_rdv,
    r.status
FROM reservations r
JOIN clients c
ON r.client_id = c.id
JOIN employees e
ON r.employee_id = e.id
JOIN services s
ON r.service_id = s.id
ORDER BY r.created_at DESC
LIMIT 5`;
 db.query(sql,async(err,result)=>{
    if(err){ 
        console.log(err);
        return res.status(500).json({
            message:'erreur serveur'
        })
    } 
     res.status(200).json({
        message:'affichage reussite',
        reservations:result

     })
 })
}
const afficheclient=async(req,res)=>{
    const sql=`SELECT
        c.id,
        c.nom,
        c.email,
        c.telephone,

        COUNT(r.id) AS reservation,

        COALESCE(SUM(s.prix),0) AS prix

    FROM clients c

    LEFT JOIN reservations r
        ON c.id = r.client_id

    LEFT JOIN services s
        ON r.service_id = s.id

    GROUP BY
        c.id,
        c.nom,
        c.email,
        c.telephone
    `;
    db.query(sql,async(err,result)=>{
        if(err){
            return res.status(500).json({
                message:'erreur serveur'
            })
        } 
        res.status(200).json({
            message:'affichage reussite',
            clients:result

        })
    })
}  
const historiqueclient =async(req,res)=>{
     const { client_id } = req.params;
     // معلومات العميل + statistiques
    const sqlClient = `
        SELECT 
            c.nom,
            c.email,
            c.telephone,
            COUNT(r.id) AS nombreReservation,
            COALESCE(SUM(s.prix),0) AS totalDepense

        FROM clients c

        LEFT JOIN reservations r 
        ON c.id = r.client_id

        LEFT JOIN services s
        ON r.service_id = s.id

        WHERE c.id = ?

        GROUP BY c.id
    `;


    // Historique réservation
    const sqlHistorique = `
        SELECT 
            s.nom AS service,
            r.date_rdv,
            s.prix,
            r.status

        FROM reservations r

        JOIN services s
        ON r.service_id = s.id

        WHERE r.client_id = ?

        ORDER BY r.date_rdv DESC
    `;


    db.query(sqlClient,[client_id],(err,client)=>{

        if(err){
            return res.status(500).json({
                error: err.message
            });
        }


        db.query(sqlHistorique,[client_id],(err,historique)=>{

            if(err){
                return res.status(500).json({
                    error: err.message
                });
            }


            res.json({

                client: client[0],

                historique: historique

            });


        });


    });

}

const loginadmin =async(req,res)=>{
  

    const {email,password}=req.body;
    try{
        const sql='SELECT * FROM admin WHERE email=?'
        db.query(sql,[email],async(err,result)=>{
            if(err){
                return res.status(500).json({
                    mesage:'erreur'
                })
            }
            if(result.length==0){
                return res.status(404).json({
                    message:"email ou mot de passe incorrect"
                })
            }
            const admin=result[0];
                        const isMatch=await bcrypt.compare(
                            password,admin.password);
                            if(!isMatch){
                                return res.status(401).json({
                                    message:'Email ou mot de passe incorrect'
                                })
                            }
            const token=jwt.sign(
                                {
                                    id:admin.id,
                                    email:admin.email
                                },
                                SECRET_KEY,{
                                    expiresIn:'7d'
                                }
                            );
            
                        res.status(201).json({
                            message:'login reussie',
                            token,
                            client: {
                                id: admin.id,
                                
                                email: admin.email,
                                }
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

module.exports ={ nombre_reservation,nombre_client,nombre_employee,
    revenu,nombre_services,nombre_categories, reservation_semain,Tendances_revenus,
    reservation_recentes,ajoutecategorie,modifiecategorie,suppcategorie,
    ajouteservice,affichecategorie,modifieservices,suppservice,afficheservice,
     modifieemploye ,suppemployee,afficheemployee,affichereservation,afficheclient,
     historiqueclient,loginadmin 


}