'use strict'
const app = require('./configs/app');
const mongoConfig = require('./configs/mongoConfig');
const port = 3200;

app.listen(port, ()=>{
    console.log(`Server HTTP running in port ${port}`);
});
mongoConfig.init();