import { exec } from "child_process";
import { promisify } from "util";
import fs from "fs/promises";
import path from "path";
import crypto from "crypto";

import {
    TEMP_RUN_PATH
} from "../utils/constants.js";


const execAsync =
promisify(exec);



/*
===================================================
CREATE TEMP DIRECTORY
===================================================
*/

const createTempDirectory =
async()=>{


    const id =
    crypto
    .randomBytes(6)
    .toString("hex");



    const folder =
    path.join(
        TEMP_RUN_PATH,
        id
    );



    await fs.mkdir(
        folder,
        {
            recursive:true
        }
    );



    return folder;

};









/*
===================================================
RUN JAVASCRIPT
===================================================
*/

const runJavaScript =
async(
    code,
    folder
)=>{


    const file =
    path.join(
        folder,
        "main.js"
    );



    await fs.writeFile(
        file,
        code
    );



    return await execAsync(

        `node ${file}`,

        {
            timeout:5000
        }

    );


};









/*
===================================================
RUN PYTHON
===================================================
*/

const runPython =
async(
    code,
    folder
)=>{


    const file =
    path.join(
        folder,
        "main.py"
    );



    await fs.writeFile(
        file,
        code
    );



    return await execAsync(

        `python ${file}`,

        {
            timeout:5000
        }

    );


};









/*
===================================================
RUN JAVA
===================================================
*/

const runJava =
async(
    code,
    folder
)=>{


    const file =
    path.join(
        folder,
        "Main.java"
    );



    await fs.writeFile(
        file,
        code
    );



    await execAsync(

        `javac ${file}`

    );



    return await execAsync(

        `java -cp ${folder} Main`,

        {
            timeout:5000
        }

    );


};









/*
===================================================
RUN C++
===================================================
*/

const runCpp =
async(
    code,
    folder
)=>{


    const file =
    path.join(
        folder,
        "main.cpp"
    );



    const output =
    path.join(
        folder,
        "main"
    );



    await fs.writeFile(
        file,
        code
    );



    await execAsync(

        `g++ ${file} -o ${output}`

    );



    return await execAsync(

        output,

        {
            timeout:5000
        }

    );


};









/*
===================================================
MAIN RUNNER
===================================================
*/

export const runCode =
async({
    language,
    code
})=>{


    if(
        !language ||
        !code
    ){

        throw new Error(
            "Language and code required"
        );

    }





    const folder =
    await createTempDirectory();





    try{


        let result;



        switch(
            language.toLowerCase()
        ){


            case "javascript":

            case "js":

                result =
                await runJavaScript(
                    code,
                    folder
                );

                break;




            case "python":

            case "py":

                result =
                await runPython(
                    code,
                    folder
                );

                break;




            case "java":

                result =
                await runJava(
                    code,
                    folder
                );

                break;




            case "cpp":

            case "c++":

                result =
                await runCpp(
                    code,
                    folder
                );

                break;




            default:

                throw new Error(
                    "Language not supported"
                );


        }




        return {

            success:true,

            output:
            result.stdout,

            error:
            result.stderr

        };


    }

    catch(error){


        return {

            success:false,

            output:"",

            error:
            error.message

        };


    }

    finally{


        await fs.rm(

            folder,

            {
                recursive:true,

                force:true

            }

        );


    }


};