"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.consumeAd = void 0;
const utils_1 = require("../../utils");
async function consumeAd(params) {
    const contract = (0, utils_1.getContract)();
    const receipt = await contract.consumeAdViaRelayer(...params);
    // @todo (Martin): append hash to a queue and verify if it was mined
    return receipt.hash;
}
exports.consumeAd = consumeAd;
