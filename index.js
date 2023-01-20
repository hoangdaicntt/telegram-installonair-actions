const core = require('@actions/core');
const axios = require("axios");
const uploadFile = require('./uploadFile');
const HDParser = require("hd-html-parser");

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

const getToken = () => {
    var config = {
        method: 'get',
        url: 'https://www.installonair.com/',
        headers: {}
    };

    return new Promise(resolve => {
        axios(config)
            .then(async function (response) {
                const html = response.data;
                const dom = await HDParser.load(html);
                const token = dom.querySelector('input[name="_token"]')?.getAttribute("value");
                resolve(token || "")
            })
            .catch(function (error) {
                resolve("")
            });
    })

}

async function main() {
    try {
        // inputs from action
        const telegramToken = core.getInput('telegramToken') || "";
        const telegramUid = core.getInput('telegramUid') || "";
        const title = core.getInput('title') || "App Name";
        const message = core.getInput('message') || "";
        if (message) {
            sendMessage(title, telegramToken, telegramUid, message);
            return;
        }

        const user_id = core.getInput('user_id') || "74613";
        const url = "https://fupload.installonair.com/ipafile";
        const methodInput = "POST";
        const method = methodInput.toLowerCase();

        const token = await getToken();
        const forms = JSON.stringify({
            "_token": token,
            "ajax": 1,
            "user_id": user_id || "",
            "submitBtn": ""
        });

        const formsMap = jsonToMap(forms);
        const fileForms = core.getInput('fileForms') || '{"ipafile":"./test.apk"}';
        const fileFormsMap = jsonToMap(fileForms);


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

        console.log(consoleOutputJSON);

        if (statusCode >= 400) {
            core.setFailed(`HTTP request failed with status code: ${statusCode}`);
            sendMessage(title, telegramToken, telegramUid, `
                Upload Request Failed!
            `, "");
        } else {
            sendMessage(title, telegramToken, telegramUid,
                `
                Install: ${outputObject?.data?.data?.link || ""}
                AppName: ${outputObject?.data?.data?.appName || ""}
                ExpiryDate: ${outputObject?.data?.data?.expiryDate || ""}
            `, outputObject?.data?.data?.image || "");
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