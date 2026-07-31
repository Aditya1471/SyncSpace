export const LANGUAGES = [

{

id:"javascript",

name:"JavaScript",

extension:".js",

monaco:"javascript"

},

{

id:"typescript",

name:"TypeScript",

extension:".ts",

monaco:"typescript"

},

{

id:"java",

name:"Java",

extension:".java",

monaco:"java"

},

{

id:"python",

name:"Python",

extension:".py",

monaco:"python"

},

{

id:"cpp",

name:"C++",

extension:".cpp",

monaco:"cpp"

},

{

id:"c",

name:"C",

extension:".c",

monaco:"c"

},

{

id:"html",

name:"HTML",

extension:".html",

monaco:"html"

},

{

id:"css",

name:"CSS",

extension:".css",

monaco:"css"

},

{

id:"json",

name:"JSON",

extension:".json",

monaco:"json"

},

{

id:"markdown",

name:"Markdown",

extension:".md",

monaco:"markdown"

},

];

export function getLanguageByExtension(extension){

return LANGUAGES.find(

language=>language.extension===extension

);

}

export function getLanguageById(id){

return LANGUAGES.find(

language=>language.id===id

);

}