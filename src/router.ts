import {Router, Request, Response} from "express";
import Crowller from './crowller'
import DellAnalyzer from "./dellAnalyzer"
import fs from "fs"
import path from "path"

interface RequestWithBody extends Request{
  body: {
    [key:string]:string | undefined;
  }
}

const router = Router();
router.get('/', (req:Request, res:Response) => {
    const isLogin = req.session ? req.session.login : false;
    if (isLogin){
       res.send(`
       <html>
          <body>
             <div>home</div>
             <a href="/getData">データ取得</a>
             <a href="/showData">データ表示</a>
             <a href="/logout">ログアウト</a>
          </body>
       </html>
       `)  
    }else{
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
    }
 })

router.get('/logout', (req:RequestWithBody, res:Response)=>{
   if(req.session){
    req.session.login = undefined;
   }
   res.redirect('/');
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

router.get('/getData', (req:RequestWithBody, res:Response)=>{
    const isLogin = req.session ? req.session.login : false;
    if(isLogin){ 
        const secret = "secretKey";
        const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
        const analyzer = DellAnalyzer.getInstance();
        new Crowller(url, analyzer);
        res.send('getData Success!')
    }else {
        res.redirect('/login')
    }
})

router.get("/showData", (req:RequestWithBody, res:Response) => {
  const isLogin = req.session ? req.session.login : false;
  if(isLogin){
    try{
      const position = path.resolve(__dirname, "../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(JSON.parse(result));
    }catch(e){
       res.send("また内容ありません")
    }
  }else{
    res.redirect("/");
  }

})

 export default router;