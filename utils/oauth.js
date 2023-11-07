const fs = require("fs");
const path = require("path");
const process = require("process");
const { authenticate } = require("@google-cloud/local-auth");
const { google } = require("googleapis");
const SCOPES = ["https://www.googleapis.com/auth/drive"];
const TOKEN_PATH = path.join(process.cwd(), "token.json");
const CREDENTIALS_PATH = path.join(process.cwd(), "utils/credentials.json");
const loadSavedCredentialsIfExist = async () => {
    try {
        const content = await fs.readFile(TOKEN_PATH);
        const credentials = JSON.parse(content);
        return google.auth.fromJSON(credentials);
    } catch (err) {
        return null;
    }
};
const saveCredentials = async (client) => {
    const content = await fs.readFileSync(CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
        type: "authorized_user",
        client_id: key.client_id,
        client_secret: key.client_secret,
        refresh_token: client.credentials.refresh_token,
    });
    await fs.writeFileSync(TOKEN_PATH, payload);
};
exports.authorize = async () => {
    let client = await loadSavedCredentialsIfExist();
    if (client) {
        return client;
    }
    client = await authenticate({
        scopes: SCOPES,
        keyfilePath: CREDENTIALS_PATH,
    });
    if (client.credentials) {
        await saveCredentials(client);
    }
    return client;
};
exports.uploadBasic = async (auth, filename) => {
    const service = google.drive({ version: "v3", auth });
    const requestBody = {
        name: filename,
        fields: "id",
    };
    const media = {
        mimeType: "image/jpeg",
        body: fs.createReadStream(
            `C:/Users/ashok/Desktop/ReactProject/bharat-intern-content-management-backend/uploads/${filename}`
        ),
    };
    try {
        const file = await service.files.create({
            requestBody,
            media: media,
        });
        console.log("File Id:", file.data.id);
        return file.data.id;
    } catch (err) {
        throw err;
    }
};
