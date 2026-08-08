require('dotenv').config();
const express = require('express');
const db =require('./mysql/db.js');
const app = express();
const cors = require('cors');
const path =require('path')
const port =process.env.PORT || 3000;
const clientRoutes =require('./routes/clients_routes.js');
const employeRoutes=require('./routes/employees_routes.js');
const adminRoutes =require('./routes/admin_routes.js');
app.use(cors());
app.use(express.json());
app.use("/upload", express.static(path.join(__dirname, "upload")));
app.use('/api/client',clientRoutes);
app.use('/api/employe',employeRoutes);
app.use('/api/admin',adminRoutes);
app.get('/',(req,res)=>{
    res.send('serveur is running');
});
app.listen(port,()=>{
    console.log(`serveur lancesur http://localhost:${port}`);
});
