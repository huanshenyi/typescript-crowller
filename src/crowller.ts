// ts ->.d.ts(翻訳ファイア) -> js
import superagent from "superagent";
import cheerio from "cheerio"

interface Course {
    title: string, 
    count: number
}

class Crowller {
    private secret = "secretKey";
    url = `http://www.dell-lee.com/typescript/demo.html?secret=${this.secret}`;

    getCourseInfo(html:string){
      const $ = cheerio.load(html)
      const courseItems = $(".course-item");
      const courseInfos: Course[] = [];
      courseItems.map((index, element)=>{
          const desc = $(element).find(".course-desc");
          const title = desc.eq(0).text()
          const count:number = parseInt(desc.eq(1).text().split("：")[1], 10)
          courseInfos.push({title, count})
      });
      const result = {
          time:(new Date()).getTime(),
          data :courseInfos
      };
    }

    async getRawHtml(){
       const result = await superagent.get(this.url);
       this.getCourseInfo(result.text);
    }
    constructor() {
        this.getRawHtml();
    }
}

const crowller = new Crowller();