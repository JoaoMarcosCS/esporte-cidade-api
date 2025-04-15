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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = __importDefault(require("express"));
var config_1 = require("../database/config");
var modality_entity_1 = require("../entities/modality.entity");
var atendiment_entity_1 = require("../entities/atendiment.entity");
var router = express_1.default.Router();
var modalityRepository = config_1.AppDataSource.getRepository(modality_entity_1.Modality);
var atendimentsRepository = config_1.AppDataSource.getRepository(atendiment_entity_1.Atendiment);
router.get("/", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var modalities, error_1;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                return [4 /*yield*/, modalityRepository.find({
                        relations: ["teachers"],
                    })];
            case 1:
                modalities = _a.sent();
                res.status(200).json(modalities);
                return [3 /*break*/, 3];
            case 2:
                error_1 = _a.sent();
                console.error("Erro ao buscar modalidades:", error_1.message);
                res
                    .status(500)
                    .json({ message: "Erro ao buscar modalidades.", error: error_1.message });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
router.get("/:id/athletes-availible", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var id, athletes_availible;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                id = parseInt(req.params.id, 10);
                return [4 /*yield*/, modalityRepository.find({
                        where: {
                            id: id,
                            enrollments: {
                                active: true,
                                aproved: true,
                            },
                        },
                        select: {
                            enrollments: {
                                athlete: {
                                    name: true,
                                    cpf: true,
                                    id: true,
                                }
                            },
                            name: true,
                            id: true,
                        },
                        order: {
                            enrollments: {
                                athlete: {
                                    name: "ASC",
                                }
                            },
                        },
                        relations: ["registred_athletes", "registred_athletes.enrollments"],
                    })];
            case 1:
                athletes_availible = _a.sent();
                res.status(200).json({ athletes_availible: athletes_availible });
                return [2 /*return*/];
        }
    });
}); });
router.post("/:id/receive-atendiments", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var atendiments, error_2;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                _a.trys.push([0, 2, , 3]);
                atendiments = req.body;
                /* OBJETO ESPERADO
                    atendiment: [{
                        modalityId: number,
                        athleteId: number,
                        present: boolean
                        created_at?: date --registro automatico ou de uma chamada de outro dia
                    }]
                */
                if (!Array.isArray(atendiments) || atendiments.length === 0) {
                    res.status(400).json({ message: "Dados de atendimento inválidos." });
                }
                return [4 /*yield*/, atendimentsRepository.insert(atendiments)];
            case 1:
                _a.sent();
                res.status(201).json({ message: "Atendimentos registrados com sucesso." });
                return [3 /*break*/, 3];
            case 2:
                error_2 = _a.sent();
                console.error("Erro ao registrar atendimentos:", error_2.message);
                res.status(500).json({
                    message: "Erro ao registrar atendimentos.",
                    error: error_2.message,
                });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
exports.default = router;
//# sourceMappingURL=modality.js.map