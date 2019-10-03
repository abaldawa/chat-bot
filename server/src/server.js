/**
 * User: abhijit.baldawa
 */

const
    express = require('express'),
    http = require('http'),
    path = require('path'),
    logger = require('./logger/logger'),
    socketIOServer = require('./socket_server/socketIOServer'),
    {formatPromiseResult} = require('./utils/util'),
    {getPort} = require('./config/config'),
    app = express(),
    httpServer = http.createServer(app);

/**
 * Immediately invoking async method which does all the standard server startup routine.
 */
(async () =>{
    const
        PORT = getPort();

    let
        err,
        breweriesRoutes;

    if( !PORT ) {
        logger.error(`Cannot start server as port information is missing`);
        process.exit(1);
    }

    // --------------------- 1. Add all the required express middleware ---------------------
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(express.static(path.join(__dirname, "..","..", "client", "dist")));
    // ---------------------------- 1. END -------------------------------------------------


    // ----------------------------- 2. Initialise socket IO server ----------------
    socketIOServer.init(httpServer);
    // ------------------------------------------- 2. END --------------------------


    // ------------------------------ 3. Start Http Server -------------------------------------------
    [err] = await formatPromiseResult(
                    new Promise( (resolve, reject) => {
                        httpServer
                            .listen(PORT, resolve)
                            .on('error', reject)
                    } )
                  );

    if( err ) {
        logger.error(`Error while starting server on port = ${PORT}. Error: ${err.stack || err}. Exiting...`);
        process.exit(1);
    }

    logger.info(`Server is listening on port = ${PORT}`);
    // --------------------------------- 3. END -------------------------------------------------------
})();