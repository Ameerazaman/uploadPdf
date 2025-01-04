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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserRepository = void 0;
const UserModel_1 = __importDefault(require("../../Model/UserModel"));
const BaseRepository_1 = require("../BaseRepository");
class UserRepository extends BaseRepository_1.BaseRepository {
    constructor() {
        super(UserModel_1.default);
    }
    // **************check email exist or not********************
    emailExistCheck(email) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log(email, "email fo check");
                const result = yield this.model.findOne({ email: email });
                console.log(result);
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // *******************create User********************
    createUser(userData) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.create(userData);
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
    // ********************find user by Id**********************
    getUserById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log("get userby Id");
                const result = yield this.model.findById(id);
                console.log(result);
                return result;
            }
            catch (error) {
                return null;
            }
        });
    }
}
exports.UserRepository = UserRepository;
