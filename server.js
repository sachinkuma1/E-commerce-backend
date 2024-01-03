const express= require('express');
const errorHandler = require('./middleware/errorhandler');
const connectDB = require('./config');
const app=express();
const PORT=process.env.PORT||3000;

connectDB();
app.use(express.json());
app.use('/api',require('./Routes/Register'));
app.use('/api',require('./Routes/product'));



app.use(errorHandler);

app.listen(PORT, ()=>console.log(`running on port ${PORT}`));