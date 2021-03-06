"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
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
var gen_base_1 = require("./gen-base");
var path_1 = __importDefault(require("path"));
var fluid = require('fluid-music');
var oscTune = function (v) { return (v + 24) / 48; };
var getRandom = function (min, max) {
    if (min === void 0) { min = 0; }
    if (max === void 0) { max = 1; }
    return Math.random() * (max - min) + min;
};
var DelayGenerator = /** @class */ (function (_super) {
    __extends(DelayGenerator, _super);
    function DelayGenerator() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    DelayGenerator.prototype.send = function (v, sample) {
        return __awaiter(this, void 0, void 0, function () {
            var client, renderClient, attackVal, decayVal, sustainVal, releaseVal, wavewarpVal, cutoffVal, msg, renderMsg;
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        client = new fluid.Client(this.clientOptions);
                        renderClient = new fluid.Client(this.clientOptions);
                        attackVal = getRandom();
                        decayVal = getRandom();
                        sustainVal = getRandom();
                        releaseVal = getRandom(0, 0.6);
                        wavewarpVal = getRandom();
                        cutoffVal = getRandom(0.2, 1);
                        msg = [
                            fluid.content.clear(),
                            fluid.audiotrack.select('melody-podo'),
                            fluid.midiclip.create('melody-podo', 0, 4, sample),
                            fluid.pluginPodolski.select(),
                            fluid.pluginPodolski.setEnv1Attack(attackVal),
                            fluid.pluginPodolski.setEnv1Decay(decayVal),
                            fluid.pluginPodolski.setEnv1Sustain(sustainVal),
                            fluid.pluginPodolski.setEnv1Release(releaseVal),
                            fluid.pluginPodolski.setOsc1Tune(oscTune(12)),
                            fluid.pluginPodolski.setOsc1WaveWarp(wavewarpVal),
                            fluid.pluginPodolski.setVcf0Cutoff(cutoffVal),
                            fluid.pluginPodolski.setVcf0KeyFollow(1),
                            fluid.pluginPodolski.setVccMode(0.3),
                            fluid.pluginTStereoDelay.select(),
                            fluid.pluginTStereoDelay.zero(),
                            fluid.pluginTStereoDelay.setDelayMs(v.delay),
                            fluid.pluginTStereoDelay.setFeedback(v.feedback),
                        ];
                        return [4 /*yield*/, client.send(msg)];
                    case 1:
                        _a.sent();
                        renderMsg = [
                            fluid.audiotrack.select('melody-podo'),
                            fluid.audiotrack.renderRegion(path_1.default.join(__dirname, 'data', "mel_" + v.delay + "_" + v.feedback + "_" + this.batchNum + "_.wav"), 0, 8),
                        ];
                        return [4 /*yield*/, renderClient.send(renderMsg).then(function () {
                                _this.completed++;
                                console.log(_this.completed, 'out of', _this.samples.length);
                            })];
                    case 2:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    };
    return DelayGenerator;
}(gen_base_1.Generator));
var params = [
    { param: 'delay', min: 0, max: 2000, numQueries: 10 },
    { param: 'feedback', min: -1, max: 1, numQueries: 10 },
];
var gen = new DelayGenerator(params, 2);
gen.generate();
