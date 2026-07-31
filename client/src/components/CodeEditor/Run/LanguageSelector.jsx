import "./Run.css";

const languages = [

  {
    id: "javascript",
    name: "JavaScript"
  },

  {
    id: "java",
    name: "Java"
  },

  {
    id: "python",
    name: "Python"
  },

  {
    id: "cpp",
    name: "C++"
  },

  {
    id: "c",
    name: "C"
  },

  {
    id: "typescript",
    name: "TypeScript"
  },

];

export default function LanguageSelector({

  value,

  onChange,

}){

return(

<select

className="language-selector"

value={value}

onChange={e=>

onChange(

e.target.value

)

}

>

{

languages.map(language=>(

<option

key={language.id}

value={language.id}

>

{language.name}

</option>

))

}

</select>

);

}