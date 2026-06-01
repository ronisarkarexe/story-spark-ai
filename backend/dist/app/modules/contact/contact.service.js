"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContactService = void 0;
const email_util_1 = require("../../../utils/email.util");
const submitContactForm = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, email_util_1.sendContactEmail)(payload);
    return {
        message: "Your feedback has been sent successfully. We will get back to you soon.",
    };
});
exports.ContactService = {
    submitContactForm,
};
