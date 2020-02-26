// ts ->.d.ts(翻訳ファイア) -> js
import superagent from "superagent";
import fs from "fs"
import path from "path"
import DellAnalyzer from "./dellAnalyzer"

export interface Analyze {
    analyze: (html:string, filePath:string)=>string
}

class Crowller {
    private filePath = path.resolve(__dirname, '../data/course.json');

    private async getRawHtml(){
       const result = await superagent.get(this.url);
       return result.text
    }

    private writeFile(content: string){
        fs.writeFileSync(this.filePath, content)
    }

    private async initSpiderProcess(){
        const html = await this.getRawHtml();
        const fileContent = this.analyzer.analyze(html, this.filePath)
        this.writeFile(fileContent)
    }

    constructor(private url:string, private analyzer:Analyze) {
        this.initSpiderProcess();
    }
}

export default Crowller;