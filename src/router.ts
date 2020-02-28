import fs from "fs"
import path from "path"

import {Router, Request, Response, NextFunction} from "express";
import Crowller from './utils/crowller'
import DellAnalyzer from "./utils/analyzer"
import { getResponseData } from "./utils/util";


interface BodyRequest extends Request{
  body: {[key:string]:string | undefined};
}

const checkLogin = (req:Request, res:Response, next:NextFunction) => {
  const isLogin = req.session ? req.session.login : false;
  if(isLogin) {
      next();
  }else {
    res.json(getResponseData(null, 'まずログインしてね'))
  }
}

const router = Router();
router.get('/', (req:BodyRequest, res:Response) => {
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

router.get('/logout', (req:BodyRequest, res:Response)=>{
   if(req.session){
    req.session.login = undefined;
   }
   res.redirect('/');
}) 

router.post('/login', (req:BodyRequest, res:Response) => {
  const {password} = req.body;
  const isLogin = req.session ? req.session.login : false;
  if(isLogin) {
      res.send(getResponseData(false, 'ログインしてます'))
  }else {
    if(password === "123" && req.session){
        req.session.login = true;
        res.json(getResponseData("ログインしました"))
    }else{
      res.json(getResponseData("ログイン失敗"))
    }
  }
})

router.get('/getData', checkLogin, (req:BodyRequest, res:Response)=>{
    const isLogin = req.session ? req.session.login : false;
    const secret = "secretKey";
    const url = `http://www.dell-lee.com/typescript/demo.html?secret=${secret}`;
    const analyzer = DellAnalyzer.getInstance();
    new Crowller(url, analyzer);
    res.json(getResponseData('getData Success!'))
})

router.get("/showData", checkLogin, (req:BodyRequest, res:Response) => {
    try{
      const position = path.resolve(__dirname, "../data/course.json");
      const result = fs.readFileSync(position, "utf-8");
      res.json(getResponseData(JSON.parse(result)));
    }catch(e){
       res.json(getResponseData(false, "またデータありません"))
    }
})

export default router;