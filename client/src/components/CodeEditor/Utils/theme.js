export const THEMES = [

{

id:"vs-dark",

name:"Dark"

},

{

id:"light",

name:"Light"

},

{

id:"hc-black",

name:"High Contrast"

},

];

export function getTheme(id){

return THEMES.find(

theme=>theme.id===id

);

}