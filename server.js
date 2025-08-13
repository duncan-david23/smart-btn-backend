import express from "express"
import cors from 'cors'
import messagesRouter from './routers/messagesRouter.js'


const app = express();
const port = process.env.PORT || 3000;



app.use(cors({
  origin: 'http://localhost:5173', // or use "*" for testing
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res)=> {
    res.send('Hello world');
});

app.use('/api/users', messagesRouter)







app.listen(port, ()=> {
    console.log(`Server is running on port ${port} http://localhost:${port}`)
})



