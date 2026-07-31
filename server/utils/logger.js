import winston from "winston";





/*
====================================================
SYNCSPACE LOGGER
====================================================

Used for:

- API logs
- Errors
- Server events
- Database events
- Socket events

====================================================
*/





const logger = winston.createLogger({

    level:
    process.env.NODE_ENV === "production"
        ? "info"
        : "debug",



    format:
    winston.format.combine(

        winston.format.timestamp(),


        winston.format.errors({
            stack:true
        }),


        winston.format.json()

    ),





    transports:[


        /*
        ============================================
        ERROR LOG FILE
        ============================================
        */

        new winston.transports.File({

            filename:
            "logs/error.log",

            level:
            "error"

        }),




        /*
        ============================================
        ALL LOGS
        ============================================
        */

        new winston.transports.File({

            filename:
            "logs/combined.log"

        })

    ]

});







/*
====================================================
CONSOLE LOGGER
====================================================
*/

if(
    process.env.NODE_ENV !== "production"
){

    logger.add(

        new winston.transports.Console({

            format:
            winston.format.combine(

                winston.format.colorize(),


                winston.format.simple()

            )

        })

    );

}






export default logger;