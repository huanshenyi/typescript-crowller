import {Router, Request, Response} from "express";
import Crowller from './crowller'
import DellAnalyzer from "./dellAnalyzer"

interface RequestWithBody extends Request{
  body: {
    [key:string]:string | undefined;
  }
}

const router = Router();
router.get('/', (req:Request, res:Response) => {
    res.send(`
    <html>
      <body>
        <form method="post" action="/login">
          <input type="password" name="password" />
          <button>ログイン</button>
        </form>
      </body>
    </html>
    `)
 })
 
router.post('/login', (req:RequestWithBody, res:Response) => {
  const {password} = req.body;
  const isLogin = req.session ? req.session.login : false;

  if(isLogin) {
    res.send('logined')
  }else {
    if(password === "123" && req.session){
        req.session.login = true;
        res.send('login seccess')
    }else{
       res.send('login fail')
    }
  }
})

router.post('/getData', (req:RequestWithBody, res:Response)=>{
    const {password} = req.body;
    if(req.body.password === '123'){
        const { password } = req.body 
        const secret = "secretKey";
        const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
        const analyzer = DellAnalyzer.getInstance();
        new Crowller(url, analyzer);
        res.send('getData Success!')
    }else {
        res.send(`password Error`)
    }
})

 export default router;