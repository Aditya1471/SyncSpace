import { exec } from "child_process";
import fs from "fs";
import path from "path";
import util from "util";


const execute = util.promisify(exec);



/*
=================================================
WORKSPACE TEMP DIRECTORY
=================================================
*/

const TEMP_DIR = path.join(
    process.cwd(),
    "workspace",
    "temp"
);



if(!fs.existsSync(TEMP_DIR)){

    fs.mkdirSync(
        TEMP_DIR,
        {
            recursive:true
        }
    );

}




/*
=================================================
JAVASCRIPT RUNNER
=================================================
*/

const runJavaScript = async(code)=>{


    const file =
    path.join(
        TEMP_DIR,
        "main.js"
    );


    fs.writeFileSync(
        file,
        code
    );



    return await execute(
        `node ${file}`
    );

};





/*
=================================================
PYTHON RUNNER
=================================================
*/

const runPython = async(code)=>{


    const file =
    path.join(
        TEMP_DIR,
        "main.py"
    );


    fs.writeFileSync(
        file,
        code
    );



    return await execute(
        `python ${file}`
    );

};





/*
=================================================
JAVA RUNNER
=================================================
*/

const runJava = async(code)=>{


    const file =
    path.join(
        TEMP_DIR,
        "Main.java"
    );


    fs.writeFileSync(
        file,
        code
    );



    await execute(
        `javac ${file}`
    );



    return await execute(
        `java -cp ${TEMP_DIR} Main`
    );


};





/*
=================================================
C++ RUNNER
=================================================
*/

const runCpp = async(code)=>{


    const file =
    path.join(
        TEMP_DIR,
        "main.cpp"
    );


    const output =
    path.join(
        TEMP_DIR,
        "main"
    );



    fs.writeFileSync(
        file,
        code
    );



    await execute(
        `g++ ${file} -o ${output}`
    );



    return await execute(
        output
    );

};





/*
=================================================
C RUNNER
=================================================
*/

const runC = async(code)=>{


    const file =
    path.join(
        TEMP_DIR,
        "main.c"
    );


    const output =
    path.join(
        TEMP_DIR,
        "main"
    );



    fs.writeFileSync(
        file,
        code
    );



    await execute(
        `gcc ${file} -o ${output}`
    );



    return await execute(
        output
    );


};





/*
=================================================
TYPESCRIPT RUNNER
=================================================
*/

const runTypeScript = async(code)=>{


    const file =
    path.join(
        TEMP_DIR,
        "main.ts"
    );


    fs.writeFileSync(
        file,
        code
    );



    return await execute(
        `npx ts-node ${file}`
    );


};





/*
=================================================
MAIN LANGUAGE RUNNER
=================================================
*/

export const languageRunner = async({

    language,

    code

})=>{


    switch(language.toLowerCase()){


        case "javascript":

        case "js":

            return await runJavaScript(code);



        case "python":

        case "py":

            return await runPython(code);



        case "java":

            return await runJava(code);



        case "cpp":

        case "c++":

            return await runCpp(code);



        case "c":

            return await runC(code);



        case "typescript":

        case "ts":

            return await runTypeScript(code);



        default:

            throw new Error(
                `Unsupported language: ${language}`
            );

    }


};





export default languageRunner;