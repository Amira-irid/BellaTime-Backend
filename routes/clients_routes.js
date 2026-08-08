 const express = require('express');
 const router = express.Router();
 
 
 const {inscription,login,getallcategorie,getservices,getemploye,
    createreservation,getNotifications
 }=require('../controllers/clientcontroller');
 
router.post('/inscription',inscription);
router.post('/login',login);
router.get('/getallcategorie',getallcategorie);
router.get('/services/:categorie_id',getservices);
router.get('/getemployees/:categorie_id',getemploye);
router.post('/createreservation',createreservation);

router.get('/notification/:client_id',getNotifications);
module.exports = router;