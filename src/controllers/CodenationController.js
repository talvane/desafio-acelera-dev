const utils = require('../utils/utils');

module.exports = {
    async proces(request, response) {
        const token = request.headers.token;      
        const data = await utils.getChallenge(token);
        const gravou = await utils.writeFile(data);
        let finalJson = {};
        let returndata = {};

        if (gravou && data !== 'undefined') {
            const txtDecrypt = await utils.decryptMsg(data.cifrado, data.numero_casas); //msg decifrada
            const txtResumeCrypt = await utils.cryptoResumeTxt(txtDecrypt); //msg resumo
            finalJson = await utils.updateFile(data, txtDecrypt, txtResumeCrypt); //json atualizado
            returndata = await utils.postChallenge(token);
            console.log('returndata', returndata);
        } else {
            return response.json({ error: "Not possible write file answer." });
        }
        
        return response.json(returndata);
    }   
}