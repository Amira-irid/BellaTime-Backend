 const express = require('express');
 const router = express.Router();

  const {inscriptionemployee,loginemploye, getDashboard,
    getreservationemploye,updateReservationStatus,   
    consulteplaning
  } = require('../controllers/employecontroller');
  router.post('/inscriptionemploye',inscriptionemployee);
  router.post('/loginemploye',loginemploye);
  router.get('/dashboard/:employee_id', getDashboard);
  router.get('/reservationemploye',getreservationemploye);
  router.put('/reservation/:id/status', updateReservationStatus);
  router.get('/planning/:employee_id',consulteplaning);


  module.exports = router;