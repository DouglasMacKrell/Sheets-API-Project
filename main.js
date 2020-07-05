const { google } = require('googleapis');
const keys = require('./keys.json');

const client = new google.auth.JWT(
    keys.client_email,
    null,
    keys.private_key,
    ['https://www.googleapis.com/auth/spreadsheets']
);

client.authorize((err, tokens) => {
    if (err) {
        console.log(err);
        return;
    } else {
        console.log("Connected!");
        gsrun(client)
    }
});

const gsrun = async (cl) => {
    const gsapi = google.sheets({version: "v4", auth: cl});
    const opt = {
        spreadsheetId: '1yWZb9AnF7sPysHntyFwgEJieY9j10A3sNlNsl0fw5CE',
        range: 'Sheet1!A2:B5'
    };

    let data = await gsapi.spreadsheets.values.get(opt);
    let dataArr = data.data.values;
    let newDataArr = dataArr.map((r) => {
        r.push(r[0] + "-" + r[1])
        return r;
    });

    const updateOpt = {
        spreadsheetId: '1yWZb9AnF7sPysHntyFwgEJieY9j10A3sNlNsl0fw5CE',
        range: 'Sheet1!E2',
        valueInputOption: 'USER_ENTERED',
        resource: {
            values: newDataArr
        }
    };

    let response = await gsapi.spreadsheets.values.update(updateOpt);
    console.log("response", response)
}