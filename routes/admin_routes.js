 const express = require('express');
 const router = express.Router(); 
  const {nombre_reservation,nombre_client,nombre_employee,
    revenu,nombre_services, nombre_categories,reservation_semain,
    Tendances_revenus,reservation_recentes,ajoutecategorie,modifiecategorie,
    suppcategorie,ajouteservice,affichecategorie,modifieservices,suppservice,
    afficheservice, modifieemploye,suppemployee,afficheemployee,affichereservation,
    afficheclient,historiqueclient,loginadmin 

  } = require('../controllers/admincontroller'); 

  router.get('/nombrereservation',nombre_reservation); 
  router.get('/nombreclients',nombre_client);
  router.get('/nombreemployees',nombre_employee);
  router.get('/revenu',revenu);
  router.get('/nombreservices',nombre_services);
  router.get('/nombrecategories',nombre_categories);
  router.get('/nombrereservationsemain', reservation_semain);
  router.get('/tendancesrevenu',Tendances_revenus);
  router.get('/reservationrecentes',reservation_recentes);
  router.post('/ajoutecategorie',ajoutecategorie);
  router.put('/modifiecategorie/:id',modifiecategorie);
  router.delete('/suppcategorie/:id',suppcategorie);
  router.get('/affichecategorie',affichecategorie);
  router.post('/ajouteservice/:categorie_id',ajouteservice);
  router.put('/modifieservices/:id',modifieservices);
  router.delete('/suppservice/:id',suppservice);
  router.get('/afficheservice',afficheservice);
  router.put('/modifieemployee/:id', modifieemploye );
  router.delete('/suppemployee/:id',suppemployee);
  router.get('/afficheemployee',afficheemployee);
  router.get ('/afficherreservation',affichereservation);
  router.get('/afficheclient',afficheclient);
  router.get('/historiqueclient/:client_id',historiqueclient);
  router.post('/loginadmin',loginadmin )

  module.exports = router;