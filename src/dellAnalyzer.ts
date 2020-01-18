import cheerio from "cheerio"
import fs from "fs"
import { Analyze } from "./crowller"


interface Course {
    title: string, 
    count: number
}

interface CourseResult {
    data: Course[],
    time: number
}

interface Content {
    [propName:number]: Course[];
}

export default class Dellanalyzer implements Analyze {
    private getCourseInfo(html:string){
        const $ = cheerio.load(html)
        const courseItems = $(".course-item");
        const courseInfos: Course[] = [];
        courseItems.map((index, element)=>{
            const desc = $(element).find(".course-desc");
            const title = desc.eq(0).text()
            const count:number = parseInt(desc.eq(1).text().split("：")[1], 10)
            courseInfos.push({title, count})
        });
        return {
            time:(new Date()).getTime(),
            data :courseInfos
        };
      }

      generateJsonContent(courseInfo:CourseResult, filePath:string) {
        let fileContent: Content = {};
        if(fs.existsSync(filePath)){
           fileContent = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        }
        fileContent[courseInfo.time] = courseInfo.data
        return fileContent;
    }

      public analyze(html: string, filePath: string) {
          const courseInfo = this.getCourseInfo(html)
          const fileContent = this.generateJsonContent(courseInfo, filePath)
          return JSON.stringify(fileContent)        
      }
}