"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Address = void 0;
var typeorm_1 = require("typeorm");
var user_base_entity_1 = require("./user-base.entity");
var Address = /** @class */ (function () {
    function Address() {
    }
    __decorate([
        (0, typeorm_1.PrimaryGeneratedColumn)(),
        __metadata("design:type", Number)
    ], Address.prototype, "id", void 0);
    __decorate([
        (0, typeorm_1.Column)("text"),
        __metadata("design:type", String)
    ], Address.prototype, "state", void 0);
    __decorate([
        (0, typeorm_1.Column)("text"),
        __metadata("design:type", String)
    ], Address.prototype, "city", void 0);
    __decorate([
        (0, typeorm_1.Column)("text"),
        __metadata("design:type", String)
    ], Address.prototype, "neighborhood", void 0);
    __decorate([
        (0, typeorm_1.Column)("text"),
        __metadata("design:type", String)
    ], Address.prototype, "street", void 0);
    __decorate([
        (0, typeorm_1.Column)("int"),
        __metadata("design:type", Number)
    ], Address.prototype, "number", void 0);
    __decorate([
        (0, typeorm_1.Column)("text"),
        __metadata("design:type", String)
    ], Address.prototype, "complement", void 0);
    __decorate([
        (0, typeorm_1.Column)("text"),
        __metadata("design:type", String)
    ], Address.prototype, "references", void 0);
    __decorate([
        (0, typeorm_1.ManyToOne)(function () { return user_base_entity_1.UserBase; }, { onDelete: "CASCADE" }),
        __metadata("design:type", user_base_entity_1.UserBase)
    ], Address.prototype, "user", void 0);
    Address = __decorate([
        (0, typeorm_1.Entity)('address')
    ], Address);
    return Address;
}());
exports.Address = Address;
//# sourceMappingURL=address.entity.js.map