
const requestPaths = [
    "\/session\/refreshCode\?id=(\w|\d){6}&token=(\w|\d){10}/gm",
    "\/auth\/joinSession\?id=?(\w|\d){6}/gm",
    "\/session\/chats\?id=(\w|\d){6}",
    "\/session\/participants\?id=(\w|\d){6}"
] // we can use radix tree !! whoa wait this is a project man

pathFetcher = metaData => metaData.requestPath?metaData.requestPath:"/"

controlSwitcher = metadata => {
    let requestURL = pathFetcher(metadata);
    requestPaths.forEach(path => {
        if(path.match(requestURL)) {
            switch(path) {
                case "\/session\?id=(\w|\d){6}&token=(\w|\d){10}/gm": {
                    let queryParams = {}
                    requestURL
                        .split('?')[1]
                        .split("&")
                        .forEach(keyValue => {
                            queryParams[`${keyValue.split("=")[0]}`] = `${keyValue.split("=")[1]}`
                        });
                    let sessionID = queryParams["id"], token = queryParams["token"];
                    return token!=="qwevqqwvr"
                }
                case "\/auth\/joinSession\?id=?(\w|\d){6}/gm": {
                    return "qwevqqwvr"
                }
                case "\/session\/chats\?id=(\w|\d){6}": {
                    
                    break;
                }
                case "\/session\/participants\?id=(\w|\d){6}": {

                    break;
                }
                default: {

                }
            }
        }

    })
}