const core = require('@actions/core');
const axios = require("axios");
const uploadFile = require('./uploadFile');

const sendMessage = (title, telegramToken, telegramUid, message, imageUrl = "") => {
    var config = {
        method: 'post',
        url: `https://api.telegram.org/bot${telegramToken}/sendMessage`,
        headers: {
            'Content-Type': 'application/json'
        },
        data: {
            "parse_mode": "HTML",
            "chat_id": telegramUid,
            "text": `Build: ${title}
            ${message}
            Created at: ${new Date().toString()}
        `.split("  ").join("")
        }
    };

    if (!!imageUrl) {
        config = {
            method: 'post',
            url: `https://api.telegram.org/bot${telegramToken}/sendPhoto`,
            headers: {
                'Content-Type': 'application/json'
            },
            data: {
                "chat_id": telegramUid,
                "photo": imageUrl,
                "caption": `Build: ${title}
            ${message}
            Created at: ${new Date().toString()}
        `.split("  ").join("")
            }
        };
    }


    axios(config).then(function (response) {
        console.log("sent ok");
    }).catch(function (error) {
        console.log("error");
    });

}

async function main() {
    try {
        // inputs from action
        const telegramToken = core.getInput('telegramToken');
        const telegramUid = core.getInput('telegramUid');
        const title = core.getInput('title');
        const url = core.getInput('url');
        const methodInput = core.getInput('method');
        const method = methodInput.toLowerCase();
        const forms = core.getInput('forms');
        const formsMap = jsonToMap(forms);
        const fileForms = core.getInput('fileForms');
        const fileFormsMap = jsonToMap(fileForms);

        console.log(formsMap)

        // http request to external API
        const response = await uploadFile(url, formsMap, fileFormsMap);

        const statusCode = response.status;
        const data = response.data;
        const outputObject = {
            url,
            method,
            statusCode,
            data
        };

        const consoleOutputJSON = JSON.stringify(outputObject, undefined, 2);

        if (statusCode >= 400) {
            core.setFailed(`HTTP request failed with status code: ${statusCode}`);
        } else {
            const outputJSON = JSON.stringify(outputObject);
            core.setOutput('output', outputJSON);
        }
    } catch (error) {
        console.log(error);
        core.setFailed(error.message);
    }
}


function objToStrMap(obj) {
    let strMap = new Map();
    for (let k of Object.keys(obj)) {
        strMap.set(k, obj[k]);
    }
    return strMap;
}

/**
 *json转换为map
 */
function jsonToMap(jsonStr) {
    return objToStrMap(JSON.parse(jsonStr));
}


main();