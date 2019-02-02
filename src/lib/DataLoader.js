import {API, Storage} from "aws-amplify";
import {utf8ArrayToStr} from "./JsonHelper";



export const retrieveDataFile = async (fileName) => {
    const result = await Storage.get(fileName, {download: true, expires: 3600000});
    // console.log("Loaded audit.json ",result);
    return JSON.parse(utf8ArrayToStr(result.Body));
};

export const saveNewAudit = async (auditDataToSave) =>{
    return API.post("audits", "/audits", {
        body: auditDataToSave
    });
};

export const getUsersAudits = async () =>  {
    return API.get("audits", "/audits");
};

export const loadAuditById = async (auditAnswersId) => {
    return API.get("audits", `/audits/${auditAnswersId}`);
};

export const updateAudit = async (auditAnswersId, auditDataToSave) => {
    return API.put("audits", `/audits/${auditAnswersId}`, {
        body: auditDataToSave
    });
};