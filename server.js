import express from "express"
import cors from 'cors'
import messagesRouter from './routers/messagesRouter.js'


const app = express();
const port = process.env.PORT || 3000;



app.use(express.json());
app.use(cors());

app.get('/', (req, res)=> {
    res.send('Hello world');
});

app.use('/api/users', messagesRouter)







app.listen(port, ()=> {
    console.log(`Server is running on port ${port} http://localhost:${port}`)
})



