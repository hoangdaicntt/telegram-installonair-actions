const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const {promisify} = require('util');

function buildForm(forms, fileForms) {

    const form = new FormData();
    for (const [key, value] of forms) {
        form.append(key, value);
    }
    for (const [key, value] of fileForms) {
        form.append(key, fs.createReadStream(value));
    }

    return form
}

async function getFormHeaders (form) {
    const getLen = promisify(form.getLength).bind(form);
    const len = await getLen();
    return {
        ...form.getHeaders(),
        'Content-Length': len
    }
}

async function uploadFile(url, forms, fileForms) {
    const form = buildForm(forms, fileForms);
    const headers = await getFormHeaders(form);
    return axios.post(url, form, {headers: headers,maxContentLength: Infinity})
}


module.exports = uploadFile;
