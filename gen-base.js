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
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
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
exports.Generator = void 0;
var model_1 = __importDefault(require("./model"));
/**
 * Base class for generating random audio samples with a range of plugin parameters.
 */
var Generator = /** @class */ (function () {
    /**
     * @param {fType.paramArray} params An array of objects that look like:
     *       { param: string, min: number, max: number, numQueries: number}
     * @param {number} batches The number of batches we should generate
     * @param {fType.clientOptions} options Options object for a FluidIpcClient.
     */
    function Generator(params, batches, options) {
        this.params = params;
        this.batches = batches;
        this.options = options;
        this.samples = [];
        this.sampleNum = 0;
        this.completed = 0;
        this.batchNum = 0;
        this.clientOptions = {
            targetPort: 9999,
            targetHost: '127.0.0.1',
            header: 0xf2b49e2c,
            timeout: 30000000,
            isUnixDomainSocket: false,
        };
        this.model = new model_1.default();
        if (options)
            this.clientOptions = options;
    }
    /**
     * Generates `batches * (param.numQueries for each parameter)` random 4 bar melodies using the
     * magenta.js library, and converts them into noteArrays that can be read by the Fluid Engine
     */
    Generator.prototype.getSamples = function () {
        return __awaiter(this, void 0, void 0, function () {
            var numOfSamples, _i, _a, param, outputMel, samples, _b, outputMel_1, sample, notes;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        numOfSamples = this.batches;
                        for (_i = 0, _a = Object.values(this.params); _i < _a.length; _i++) {
                            param = _a[_i];
                            numOfSamples *= param.numQueries;
                        }
                        console.log('Generating', numOfSamples, 'samples');
                        return [4 /*yield*/, this.model.load()];
                    case 1:
                        _c.sent();
                        return [4 /*yield*/, this.model.sampleMel(numOfSamples)];
                    case 2:
                        outputMel = _c.sent();
                        console.log('Samples Generated');
                        samples = [];
                        for (_b = 0, outputMel_1 = outputMel; _b < outputMel_1.length; _b++) {
                            sample = outputMel_1[_b];
                            notes = this.model.melNotesToFluid(sample.notes, sample.quantizationInfo.stepsPerQuarter);
                            samples.push(notes);
                        }
                        this.sampleNum = 0;
                        return [2 /*return*/, samples];
                }
            });
        });
    };
    /**
     * `generate` calls `send` with every combination of values parameters can be set to,
     * `batches` times
     */
    Generator.prototype.generate = function () {
        return __awaiter(this, void 0, void 0, function () {
            var _a, getInterval, recurHelper, iter;
            var _this = this;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = this;
                        return [4 /*yield*/, this.getSamples()];
                    case 1:
                        _a.samples = _b.sent();
                        this.completed = 0;
                        this.batchNum = 0;
                        getInterval = function (min, max, num) {
                            if (num === 1)
                                return 0;
                            return (max - min) / (num - 1);
                        };
                        recurHelper = function (curr, values) { return __awaiter(_this, void 0, void 0, function () {
                            var i;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0:
                                        if (!(curr === Object.entries(this.params).length)) return [3 /*break*/, 2];
                                        return [4 /*yield*/, this.send(values, this.samples[this.sampleNum])];
                                    case 1:
                                        _a.sent();
                                        this.sampleNum++;
                                        return [3 /*break*/, 6];
                                    case 2:
                                        i = this.params[curr].min;
                                        _a.label = 3;
                                    case 3:
                                        if (!(i <= this.params[curr].max)) return [3 /*break*/, 6];
                                        values[this.params[curr].param] = i;
                                        return [4 /*yield*/, recurHelper(curr + 1, values)];
                                    case 4:
                                        _a.sent();
                                        _a.label = 5;
                                    case 5:
                                        i += getInterval(this.params[curr].min, this.params[curr].max, this.params[curr].numQueries);
                                        return [3 /*break*/, 3];
                                    case 6: return [2 /*return*/];
                                }
                            });
                        }); };
                        iter = 0;
                        _b.label = 2;
                    case 2:
                        if (!(iter < this.batches)) return [3 /*break*/, 5];
                        console.log('Sending batch:', iter);
                        return [4 /*yield*/, recurHelper(0, {})];
                    case 3:
                        _b.sent();
                        _b.label = 4;
                    case 4:
                        iter++;
                        return [3 /*break*/, 2];
                    case 5:
                        console.log('done');
                        return [2 /*return*/];
                }
            });
        });
    };
    return Generator;
}());
exports.Generator = Generator;
