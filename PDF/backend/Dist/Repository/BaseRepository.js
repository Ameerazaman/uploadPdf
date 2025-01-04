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
exports.BaseRepository = void 0;
class BaseRepository {
    constructor(model) {
        this.model = model;
    }
    // Create a new entity
    create(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this.model.create(data);
                return entity;
            }
            catch (error) {
                throw new Error('Error creating entity: ');
            }
        });
    }
    // Get an entity by ID
    getById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const entity = yield this.model.findById(id);
                return entity;
            }
            catch (error) {
                throw new Error('Error retrieving entity by ID: ');
            }
        });
    }
    // Update an entity
    update(id, data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const updatedEntity = yield this.model.findByIdAndUpdate(id, data, { new: true });
                return updatedEntity;
            }
            catch (error) {
                throw new Error('Error updating entity: ');
            }
        });
    }
    // Delete an entity by ID
    delete(id) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const result = yield this.model.findByIdAndDelete(id);
                return result ? true : false;
            }
            catch (error) {
                throw new Error('Error deleting entity: ');
            }
        });
    }
    // Get all entities (optional)
    getAll() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield this.model.find();
            }
            catch (error) {
                throw new Error('Error retrieving entities: ');
            }
        });
    }
}
exports.BaseRepository = BaseRepository;
