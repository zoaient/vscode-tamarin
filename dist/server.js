"use strict";
var __getOwnPropNames = Object.getOwnPropertyNames;
var __commonJS = (cb, mod) => function __require() {
  return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
};

// node_modules/web-tree-sitter/tree-sitter.js
var require_tree_sitter = __commonJS({
  "node_modules/web-tree-sitter/tree-sitter.js"(exports, module) {
    var Module = void 0 !== Module ? Module : {};
    var TreeSitter = function() {
      var initPromise, document = "object" == typeof window ? { currentScript: window.document.currentScript } : null;
      class Parser {
        constructor() {
          this.initialize();
        }
        initialize() {
          throw new Error("cannot construct a Parser before calling `init()`");
        }
        static init(moduleOptions) {
          return initPromise || (Module = Object.assign({}, Module, moduleOptions), initPromise = new Promise((resolveInitPromise) => {
            var moduleOverrides = Object.assign({}, Module), arguments_ = [], thisProgram = "./this.program", quit_ = (e, t) => {
              throw t;
            }, ENVIRONMENT_IS_WEB = "object" == typeof window, ENVIRONMENT_IS_WORKER = "function" == typeof importScripts, ENVIRONMENT_IS_NODE = "object" == typeof process && "object" == typeof process.versions && "string" == typeof process.versions.node, scriptDirectory = "", read_, readAsync, readBinary;
            function locateFile(e) {
              return Module.locateFile ? Module.locateFile(e, scriptDirectory) : scriptDirectory + e;
            }
            if (ENVIRONMENT_IS_NODE) {
              var fs = require("fs"), nodePath = require("path");
              scriptDirectory = ENVIRONMENT_IS_WORKER ? nodePath.dirname(scriptDirectory) + "/" : __dirname + "/", read_ = (e, t) => (e = isFileURI(e) ? new URL(e) : nodePath.normalize(e), fs.readFileSync(e, t ? void 0 : "utf8")), readBinary = (e) => {
                var t = read_(e, true);
                return t.buffer || (t = new Uint8Array(t)), t;
              }, readAsync = (e, t, _, s = true) => {
                e = isFileURI(e) ? new URL(e) : nodePath.normalize(e), fs.readFile(e, s ? void 0 : "utf8", (e2, r) => {
                  e2 ? _(e2) : t(s ? r.buffer : r);
                });
              }, !Module.thisProgram && process.argv.length > 1 && (thisProgram = process.argv[1].replace(/\\/g, "/")), arguments_ = process.argv.slice(2), "undefined" != typeof module && (module.exports = Module), quit_ = (e, t) => {
                throw process.exitCode = e, t;
              };
            } else (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER) && (ENVIRONMENT_IS_WORKER ? scriptDirectory = self.location.href : void 0 !== document && document.currentScript && (scriptDirectory = document.currentScript.src), scriptDirectory = scriptDirectory.startsWith("blob:") ? "" : scriptDirectory.substr(0, scriptDirectory.replace(/[?#].*/, "").lastIndexOf("/") + 1), read_ = (e) => {
              var t = new XMLHttpRequest();
              return t.open("GET", e, false), t.send(null), t.responseText;
            }, ENVIRONMENT_IS_WORKER && (readBinary = (e) => {
              var t = new XMLHttpRequest();
              return t.open("GET", e, false), t.responseType = "arraybuffer", t.send(null), new Uint8Array(t.response);
            }), readAsync = (e, t, _) => {
              var s = new XMLHttpRequest();
              s.open("GET", e, true), s.responseType = "arraybuffer", s.onload = () => {
                200 == s.status || 0 == s.status && s.response ? t(s.response) : _();
              }, s.onerror = _, s.send(null);
            });
            var out = Module.print || console.log.bind(console), err = Module.printErr || console.error.bind(console);
            Object.assign(Module, moduleOverrides), moduleOverrides = null, Module.arguments && (arguments_ = Module.arguments), Module.thisProgram && (thisProgram = Module.thisProgram), Module.quit && (quit_ = Module.quit);
            var dynamicLibraries = Module.dynamicLibraries || [], wasmBinary, wasmMemory;
            Module.wasmBinary && (wasmBinary = Module.wasmBinary), "object" != typeof WebAssembly && abort("no native wasm support detected");
            var ABORT = false, EXITSTATUS, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64;
            function updateMemoryViews() {
              var e = wasmMemory.buffer;
              Module.HEAP8 = HEAP8 = new Int8Array(e), Module.HEAP16 = HEAP16 = new Int16Array(e), Module.HEAPU8 = HEAPU8 = new Uint8Array(e), Module.HEAPU16 = HEAPU16 = new Uint16Array(e), Module.HEAP32 = HEAP32 = new Int32Array(e), Module.HEAPU32 = HEAPU32 = new Uint32Array(e), Module.HEAPF32 = HEAPF32 = new Float32Array(e), Module.HEAPF64 = HEAPF64 = new Float64Array(e);
            }
            var INITIAL_MEMORY = Module.INITIAL_MEMORY || 33554432;
            wasmMemory = Module.wasmMemory ? Module.wasmMemory : new WebAssembly.Memory({ initial: INITIAL_MEMORY / 65536, maximum: 32768 }), updateMemoryViews(), INITIAL_MEMORY = wasmMemory.buffer.byteLength;
            var __ATPRERUN__ = [], __ATINIT__ = [], __ATMAIN__ = [], __ATPOSTRUN__ = [], __RELOC_FUNCS__ = [], runtimeInitialized = false;
            function preRun() {
              if (Module.preRun) for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length; ) addOnPreRun(Module.preRun.shift());
              callRuntimeCallbacks(__ATPRERUN__);
            }
            function initRuntime() {
              runtimeInitialized = true, callRuntimeCallbacks(__RELOC_FUNCS__), callRuntimeCallbacks(__ATINIT__);
            }
            function preMain() {
              callRuntimeCallbacks(__ATMAIN__);
            }
            function postRun() {
              if (Module.postRun) for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length; ) addOnPostRun(Module.postRun.shift());
              callRuntimeCallbacks(__ATPOSTRUN__);
            }
            function addOnPreRun(e) {
              __ATPRERUN__.unshift(e);
            }
            function addOnInit(e) {
              __ATINIT__.unshift(e);
            }
            function addOnPostRun(e) {
              __ATPOSTRUN__.unshift(e);
            }
            var runDependencies = 0, runDependencyWatcher = null, dependenciesFulfilled = null;
            function getUniqueRunDependency(e) {
              return e;
            }
            function addRunDependency(e) {
              var _a;
              runDependencies++, (_a = Module.monitorRunDependencies) == null ? void 0 : _a.call(Module, runDependencies);
            }
            function removeRunDependency(e) {
              var _a;
              if (runDependencies--, (_a = Module.monitorRunDependencies) == null ? void 0 : _a.call(Module, runDependencies), 0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled)) {
                var t = dependenciesFulfilled;
                dependenciesFulfilled = null, t();
              }
            }
            function abort(e) {
              var _a;
              throw (_a = Module.onAbort) == null ? void 0 : _a.call(Module, e), err(e = "Aborted(" + e + ")"), ABORT = true, EXITSTATUS = 1, e += ". Build with -sASSERTIONS for more info.", new WebAssembly.RuntimeError(e);
            }
            var dataURIPrefix = "data:application/octet-stream;base64,", isDataURI = (e) => e.startsWith(dataURIPrefix), isFileURI = (e) => e.startsWith("file://"), wasmBinaryFile;
            function getBinarySync(e) {
              if (e == wasmBinaryFile && wasmBinary) return new Uint8Array(wasmBinary);
              if (readBinary) return readBinary(e);
              throw "both async and sync fetching of the wasm failed";
            }
            function getBinaryPromise(e) {
              if (!wasmBinary && (ENVIRONMENT_IS_WEB || ENVIRONMENT_IS_WORKER)) {
                if ("function" == typeof fetch && !isFileURI(e)) return fetch(e, { credentials: "same-origin" }).then((t) => {
                  if (!t.ok) throw `failed to load wasm binary file at '${e}'`;
                  return t.arrayBuffer();
                }).catch(() => getBinarySync(e));
                if (readAsync) return new Promise((t, _) => {
                  readAsync(e, (e2) => t(new Uint8Array(e2)), _);
                });
              }
              return Promise.resolve().then(() => getBinarySync(e));
            }
            function instantiateArrayBuffer(e, t, _) {
              return getBinaryPromise(e).then((e2) => WebAssembly.instantiate(e2, t)).then(_, (e2) => {
                err(`failed to asynchronously prepare wasm: ${e2}`), abort(e2);
              });
            }
            function instantiateAsync(e, t, _, s) {
              return e || "function" != typeof WebAssembly.instantiateStreaming || isDataURI(t) || isFileURI(t) || ENVIRONMENT_IS_NODE || "function" != typeof fetch ? instantiateArrayBuffer(t, _, s) : fetch(t, { credentials: "same-origin" }).then((e2) => WebAssembly.instantiateStreaming(e2, _).then(s, function(e3) {
                return err(`wasm streaming compile failed: ${e3}`), err("falling back to ArrayBuffer instantiation"), instantiateArrayBuffer(t, _, s);
              }));
            }
            function createWasm() {
              var e = { env: wasmImports, wasi_snapshot_preview1: wasmImports, "GOT.mem": new Proxy(wasmImports, GOTHandler), "GOT.func": new Proxy(wasmImports, GOTHandler) };
              function t(e2, t2) {
                wasmExports = e2.exports, wasmExports = relocateExports(wasmExports, 1024);
                var _ = getDylinkMetadata(t2);
                return _.neededDynlibs && (dynamicLibraries = _.neededDynlibs.concat(dynamicLibraries)), mergeLibSymbols(wasmExports, "main"), LDSO.init(), loadDylibs(), addOnInit(wasmExports.__wasm_call_ctors), __RELOC_FUNCS__.push(wasmExports.__wasm_apply_data_relocs), removeRunDependency("wasm-instantiate"), wasmExports;
              }
              if (addRunDependency("wasm-instantiate"), Module.instantiateWasm) try {
                return Module.instantiateWasm(e, t);
              } catch (e2) {
                return err(`Module.instantiateWasm callback failed with error: ${e2}`), false;
              }
              return instantiateAsync(wasmBinary, wasmBinaryFile, e, function(e2) {
                t(e2.instance, e2.module);
              }), {};
            }
            wasmBinaryFile = "tree-sitter.wasm", isDataURI(wasmBinaryFile) || (wasmBinaryFile = locateFile(wasmBinaryFile));
            var ASM_CONSTS = {};
            function ExitStatus(e) {
              this.name = "ExitStatus", this.message = `Program terminated with exit(${e})`, this.status = e;
            }
            var GOT = {}, currentModuleWeakSymbols = /* @__PURE__ */ new Set([]), GOTHandler = { get(e, t) {
              var _ = GOT[t];
              return _ || (_ = GOT[t] = new WebAssembly.Global({ value: "i32", mutable: true })), currentModuleWeakSymbols.has(t) || (_.required = true), _;
            } }, callRuntimeCallbacks = (e) => {
              for (; e.length > 0; ) e.shift()(Module);
            }, UTF8Decoder = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, UTF8ArrayToString = (e, t, _) => {
              for (var s = t + _, r = t; e[r] && !(r >= s); ) ++r;
              if (r - t > 16 && e.buffer && UTF8Decoder) return UTF8Decoder.decode(e.subarray(t, r));
              for (var a = ""; t < r; ) {
                var o = e[t++];
                if (128 & o) {
                  var n = 63 & e[t++];
                  if (192 != (224 & o)) {
                    var l = 63 & e[t++];
                    if ((o = 224 == (240 & o) ? (15 & o) << 12 | n << 6 | l : (7 & o) << 18 | n << 12 | l << 6 | 63 & e[t++]) < 65536) a += String.fromCharCode(o);
                    else {
                      var d = o - 65536;
                      a += String.fromCharCode(55296 | d >> 10, 56320 | 1023 & d);
                    }
                  } else a += String.fromCharCode((31 & o) << 6 | n);
                } else a += String.fromCharCode(o);
              }
              return a;
            }, getDylinkMetadata = (e) => {
              var t = 0, _ = 0;
              function s() {
                for (var _2 = 0, s2 = 1; ; ) {
                  var r2 = e[t++];
                  if (_2 += (127 & r2) * s2, s2 *= 128, !(128 & r2)) break;
                }
                return _2;
              }
              function r() {
                var _2 = s();
                return UTF8ArrayToString(e, (t += _2) - _2, _2);
              }
              function a(e2, t2) {
                if (e2) throw new Error(t2);
              }
              var o = "dylink.0";
              if (e instanceof WebAssembly.Module) {
                var n = WebAssembly.Module.customSections(e, o);
                0 === n.length && (o = "dylink", n = WebAssembly.Module.customSections(e, o)), a(0 === n.length, "need dylink section"), _ = (e = new Uint8Array(n[0])).length;
              } else {
                a(!(1836278016 == new Uint32Array(new Uint8Array(e.subarray(0, 24)).buffer)[0]), "need to see wasm magic number"), a(0 !== e[8], "need the dylink section to be first"), t = 9;
                var l = s();
                _ = t + l, o = r();
              }
              var d = { neededDynlibs: [], tlsExports: /* @__PURE__ */ new Set(), weakImports: /* @__PURE__ */ new Set() };
              if ("dylink" == o) {
                d.memorySize = s(), d.memoryAlign = s(), d.tableSize = s(), d.tableAlign = s();
                for (var u = s(), m = 0; m < u; ++m) {
                  var c = r();
                  d.neededDynlibs.push(c);
                }
              } else {
                a("dylink.0" !== o);
                for (; t < _; ) {
                  var w = e[t++], p = s();
                  if (1 === w) d.memorySize = s(), d.memoryAlign = s(), d.tableSize = s(), d.tableAlign = s();
                  else if (2 === w) for (u = s(), m = 0; m < u; ++m) c = r(), d.neededDynlibs.push(c);
                  else if (3 === w) for (var h = s(); h--; ) {
                    var g = r();
                    256 & s() && d.tlsExports.add(g);
                  }
                  else if (4 === w) for (h = s(); h--; ) {
                    r(), g = r();
                    1 == (3 & s()) && d.weakImports.add(g);
                  }
                  else t += p;
                }
              }
              return d;
            };
            function getValue(e, t = "i8") {
              switch (t.endsWith("*") && (t = "*"), t) {
                case "i1":
                case "i8":
                  return HEAP8[e];
                case "i16":
                  return HEAP16[e >> 1];
                case "i32":
                  return HEAP32[e >> 2];
                case "i64":
                  abort("to do getValue(i64) use WASM_BIGINT");
                case "float":
                  return HEAPF32[e >> 2];
                case "double":
                  return HEAPF64[e >> 3];
                case "*":
                  return HEAPU32[e >> 2];
                default:
                  abort(`invalid type for getValue: ${t}`);
              }
            }
            var newDSO = (e, t, _) => {
              var s = { refcount: 1 / 0, name: e, exports: _, global: true };
              return LDSO.loadedLibsByName[e] = s, null != t && (LDSO.loadedLibsByHandle[t] = s), s;
            }, LDSO = { loadedLibsByName: {}, loadedLibsByHandle: {}, init() {
              newDSO("__main__", 0, wasmImports);
            } }, ___heap_base = 78096, zeroMemory = (e, t) => (HEAPU8.fill(0, e, e + t), e), alignMemory = (e, t) => Math.ceil(e / t) * t, getMemory = (e) => {
              if (runtimeInitialized) return zeroMemory(_malloc(e), e);
              var t = ___heap_base, _ = t + alignMemory(e, 16);
              return ___heap_base = _, GOT.__heap_base.value = _, t;
            }, isInternalSym = (e) => ["__cpp_exception", "__c_longjmp", "__wasm_apply_data_relocs", "__dso_handle", "__tls_size", "__tls_align", "__set_stack_limits", "_emscripten_tls_init", "__wasm_init_tls", "__wasm_call_ctors", "__start_em_asm", "__stop_em_asm", "__start_em_js", "__stop_em_js"].includes(e) || e.startsWith("__em_js__"), uleb128Encode = (e, t) => {
              e < 128 ? t.push(e) : t.push(e % 128 | 128, e >> 7);
            }, sigToWasmTypes = (e) => {
              for (var t = { i: "i32", j: "i64", f: "f32", d: "f64", e: "externref", p: "i32" }, _ = { parameters: [], results: "v" == e[0] ? [] : [t[e[0]]] }, s = 1; s < e.length; ++s) _.parameters.push(t[e[s]]);
              return _;
            }, generateFuncType = (e, t) => {
              var _ = e.slice(0, 1), s = e.slice(1), r = { i: 127, p: 127, j: 126, f: 125, d: 124, e: 111 };
              t.push(96), uleb128Encode(s.length, t);
              for (var a = 0; a < s.length; ++a) t.push(r[s[a]]);
              "v" == _ ? t.push(0) : t.push(1, r[_]);
            }, convertJsFunctionToWasm = (e, t) => {
              if ("function" == typeof WebAssembly.Function) return new WebAssembly.Function(sigToWasmTypes(t), e);
              var _ = [1];
              generateFuncType(t, _);
              var s = [0, 97, 115, 109, 1, 0, 0, 0, 1];
              uleb128Encode(_.length, s), s.push(..._), s.push(2, 7, 1, 1, 101, 1, 102, 0, 0, 7, 5, 1, 1, 102, 0, 0);
              var r = new WebAssembly.Module(new Uint8Array(s));
              return new WebAssembly.Instance(r, { e: { f: e } }).exports.f;
            }, wasmTableMirror = [], wasmTable = new WebAssembly.Table({ initial: 27, element: "anyfunc" }), getWasmTableEntry = (e) => {
              var t = wasmTableMirror[e];
              return t || (e >= wasmTableMirror.length && (wasmTableMirror.length = e + 1), wasmTableMirror[e] = t = wasmTable.get(e)), t;
            }, updateTableMap = (e, t) => {
              if (functionsInTableMap) for (var _ = e; _ < e + t; _++) {
                var s = getWasmTableEntry(_);
                s && functionsInTableMap.set(s, _);
              }
            }, functionsInTableMap, getFunctionAddress = (e) => (functionsInTableMap || (functionsInTableMap = /* @__PURE__ */ new WeakMap(), updateTableMap(0, wasmTable.length)), functionsInTableMap.get(e) || 0), freeTableIndexes = [], getEmptyTableSlot = () => {
              if (freeTableIndexes.length) return freeTableIndexes.pop();
              try {
                wasmTable.grow(1);
              } catch (e) {
                if (!(e instanceof RangeError)) throw e;
                throw "Unable to grow wasm table. Set ALLOW_TABLE_GROWTH.";
              }
              return wasmTable.length - 1;
            }, setWasmTableEntry = (e, t) => {
              wasmTable.set(e, t), wasmTableMirror[e] = wasmTable.get(e);
            }, addFunction = (e, t) => {
              var _ = getFunctionAddress(e);
              if (_) return _;
              var s = getEmptyTableSlot();
              try {
                setWasmTableEntry(s, e);
              } catch (_2) {
                if (!(_2 instanceof TypeError)) throw _2;
                var r = convertJsFunctionToWasm(e, t);
                setWasmTableEntry(s, r);
              }
              return functionsInTableMap.set(e, s), s;
            }, updateGOT = (e, t) => {
              for (var _ in e) if (!isInternalSym(_)) {
                var s = e[_];
                _.startsWith("orig$") && (_ = _.split("$")[1], t = true), GOT[_] ||= new WebAssembly.Global({ value: "i32", mutable: true }), (t || 0 == GOT[_].value) && ("function" == typeof s ? GOT[_].value = addFunction(s) : "number" == typeof s ? GOT[_].value = s : err(`unhandled export type for '${_}': ${typeof s}`));
              }
            }, relocateExports = (e, t, _) => {
              var s = {};
              for (var r in e) {
                var a = e[r];
                "object" == typeof a && (a = a.value), "number" == typeof a && (a += t), s[r] = a;
              }
              return updateGOT(s, _), s;
            }, isSymbolDefined = (e) => {
              var t = wasmImports[e];
              return !(!t || t.stub);
            }, dynCallLegacy = (e, t, _) => (0, Module["dynCall_" + e])(t, ..._), dynCall = (e, t, _ = []) => e.includes("j") ? dynCallLegacy(e, t, _) : getWasmTableEntry(t)(..._), createInvokeFunction = (e) => function() {
              var t = stackSave();
              try {
                return dynCall(e, arguments[0], Array.prototype.slice.call(arguments, 1));
              } catch (e2) {
                if (stackRestore(t), e2 !== e2 + 0) throw e2;
                _setThrew(1, 0);
              }
            }, resolveGlobalSymbol = (e, t = false) => {
              var _;
              return t && "orig$" + e in wasmImports && (e = "orig$" + e), isSymbolDefined(e) ? _ = wasmImports[e] : e.startsWith("invoke_") && (_ = wasmImports[e] = createInvokeFunction(e.split("_")[1])), { sym: _, name: e };
            }, UTF8ToString = (e, t) => e ? UTF8ArrayToString(HEAPU8, e, t) : "", loadWebAssemblyModule = (binary, flags, libName, localScope, handle) => {
              var metadata = getDylinkMetadata(binary);
              function loadModule() {
                var firstLoad = !handle || !HEAP8[handle + 8];
                if (firstLoad) {
                  var memAlign = Math.pow(2, metadata.memoryAlign), memoryBase = metadata.memorySize ? alignMemory(getMemory(metadata.memorySize + memAlign), memAlign) : 0, tableBase = metadata.tableSize ? wasmTable.length : 0;
                  handle && (HEAP8[handle + 8] = 1, HEAPU32[handle + 12 >> 2] = memoryBase, HEAP32[handle + 16 >> 2] = metadata.memorySize, HEAPU32[handle + 20 >> 2] = tableBase, HEAP32[handle + 24 >> 2] = metadata.tableSize);
                } else memoryBase = HEAPU32[handle + 12 >> 2], tableBase = HEAPU32[handle + 20 >> 2];
                var tableGrowthNeeded = tableBase + metadata.tableSize - wasmTable.length, moduleExports;
                function resolveSymbol(e) {
                  var t = resolveGlobalSymbol(e).sym;
                  return !t && localScope && (t = localScope[e]), t || (t = moduleExports[e]), t;
                }
                tableGrowthNeeded > 0 && wasmTable.grow(tableGrowthNeeded);
                var proxyHandler = { get(e, t) {
                  switch (t) {
                    case "__memory_base":
                      return memoryBase;
                    case "__table_base":
                      return tableBase;
                  }
                  if (t in wasmImports && !wasmImports[t].stub) return wasmImports[t];
                  var _;
                  t in e || (e[t] = (...e2) => (_ ||= resolveSymbol(t), _(...e2)));
                  return e[t];
                } }, proxy = new Proxy({}, proxyHandler), info = { "GOT.mem": new Proxy({}, GOTHandler), "GOT.func": new Proxy({}, GOTHandler), env: proxy, wasi_snapshot_preview1: proxy };
                function postInstantiation(module, instance) {
                  function addEmAsm(addr, body) {
                    for (var args = [], arity = 0; arity < 16 && -1 != body.indexOf("$" + arity); arity++) args.push("$" + arity);
                    args = args.join(",");
                    var func = `(${args}) => { ${body} };`;
                    ASM_CONSTS[start] = eval(func);
                  }
                  if (updateTableMap(tableBase, metadata.tableSize), moduleExports = relocateExports(instance.exports, memoryBase), flags.allowUndefined || reportUndefinedSymbols(), "__start_em_asm" in moduleExports) for (var start = moduleExports.__start_em_asm, stop = moduleExports.__stop_em_asm; start < stop; ) {
                    var jsString = UTF8ToString(start);
                    addEmAsm(start, jsString), start = HEAPU8.indexOf(0, start) + 1;
                  }
                  function addEmJs(name, cSig, body) {
                    var jsArgs = [];
                    if (cSig = cSig.slice(1, -1), "void" != cSig) for (var i in cSig = cSig.split(","), cSig) {
                      var jsArg = cSig[i].split(" ").pop();
                      jsArgs.push(jsArg.replace("*", ""));
                    }
                    var func = `(${jsArgs}) => ${body};`;
                    moduleExports[name] = eval(func);
                  }
                  for (var name in moduleExports) if (name.startsWith("__em_js__")) {
                    var start = moduleExports[name], jsString = UTF8ToString(start), parts = jsString.split("<::>");
                    addEmJs(name.replace("__em_js__", ""), parts[0], parts[1]), delete moduleExports[name];
                  }
                  var applyRelocs = moduleExports.__wasm_apply_data_relocs;
                  applyRelocs && (runtimeInitialized ? applyRelocs() : __RELOC_FUNCS__.push(applyRelocs));
                  var init = moduleExports.__wasm_call_ctors;
                  return init && (runtimeInitialized ? init() : __ATINIT__.push(init)), moduleExports;
                }
                if (flags.loadAsync) {
                  if (binary instanceof WebAssembly.Module) {
                    var instance = new WebAssembly.Instance(binary, info);
                    return Promise.resolve(postInstantiation(binary, instance));
                  }
                  return WebAssembly.instantiate(binary, info).then((e) => postInstantiation(e.module, e.instance));
                }
                var module = binary instanceof WebAssembly.Module ? binary : new WebAssembly.Module(binary), instance = new WebAssembly.Instance(module, info);
                return postInstantiation(module, instance);
              }
              return currentModuleWeakSymbols = metadata.weakImports, flags.loadAsync ? metadata.neededDynlibs.reduce((e, t) => e.then(() => loadDynamicLibrary(t, flags)), Promise.resolve()).then(loadModule) : (metadata.neededDynlibs.forEach((e) => loadDynamicLibrary(e, flags, localScope)), loadModule());
            }, mergeLibSymbols = (e, t) => {
              for (var [_, s] of Object.entries(e)) {
                const e2 = (e3) => {
                  isSymbolDefined(e3) || (wasmImports[e3] = s);
                };
                e2(_);
                const t2 = "__main_argc_argv";
                "main" == _ && e2(t2), _ == t2 && e2("main"), _.startsWith("dynCall_") && !Module.hasOwnProperty(_) && (Module[_] = s);
              }
            }, asyncLoad = (e, t, _, s) => {
              var r = s ? "" : getUniqueRunDependency(`al ${e}`);
              readAsync(e, (e2) => {
                t(new Uint8Array(e2)), r && removeRunDependency(r);
              }, (t2) => {
                if (!_) throw `Loading data file "${e}" failed.`;
                _();
              }), r && addRunDependency(r);
            };
            function loadDynamicLibrary(e, t = { global: true, nodelete: true }, _, s) {
              var r = LDSO.loadedLibsByName[e];
              if (r) return t.global ? r.global || (r.global = true, mergeLibSymbols(r.exports, e)) : _ && Object.assign(_, r.exports), t.nodelete && r.refcount !== 1 / 0 && (r.refcount = 1 / 0), r.refcount++, s && (LDSO.loadedLibsByHandle[s] = r), !t.loadAsync || Promise.resolve(true);
              function a() {
                if (s) {
                  var _2 = HEAPU32[s + 28 >> 2], r2 = HEAPU32[s + 32 >> 2];
                  if (_2 && r2) {
                    var a2 = HEAP8.slice(_2, _2 + r2);
                    return t.loadAsync ? Promise.resolve(a2) : a2;
                  }
                }
                var o2 = locateFile(e);
                if (t.loadAsync) return new Promise(function(e2, t2) {
                  asyncLoad(o2, e2, t2);
                });
                if (!readBinary) throw new Error(`${o2}: file not found, and synchronous loading of external files is not available`);
                return readBinary(o2);
              }
              function o() {
                return t.loadAsync ? a().then((r2) => loadWebAssemblyModule(r2, t, e, _, s)) : loadWebAssemblyModule(a(), t, e, _, s);
              }
              function n(t2) {
                r.global ? mergeLibSymbols(t2, e) : _ && Object.assign(_, t2), r.exports = t2;
              }
              return (r = newDSO(e, s, "loading")).refcount = t.nodelete ? 1 / 0 : 1, r.global = t.global, t.loadAsync ? o().then((e2) => (n(e2), true)) : (n(o()), true);
            }
            var reportUndefinedSymbols = () => {
              for (var [e, t] of Object.entries(GOT)) if (0 == t.value) {
                var _ = resolveGlobalSymbol(e, true).sym;
                if (!_ && !t.required) continue;
                if ("function" == typeof _) t.value = addFunction(_, _.sig);
                else {
                  if ("number" != typeof _) throw new Error(`bad export type for '${e}': ${typeof _}`);
                  t.value = _;
                }
              }
            }, loadDylibs = () => {
              dynamicLibraries.length ? (addRunDependency("loadDylibs"), dynamicLibraries.reduce((e, t) => e.then(() => loadDynamicLibrary(t, { loadAsync: true, global: true, nodelete: true, allowUndefined: true })), Promise.resolve()).then(() => {
                reportUndefinedSymbols(), removeRunDependency("loadDylibs");
              })) : reportUndefinedSymbols();
            }, noExitRuntime = Module.noExitRuntime || true;
            function setValue(e, t, _ = "i8") {
              switch (_.endsWith("*") && (_ = "*"), _) {
                case "i1":
                case "i8":
                  HEAP8[e] = t;
                  break;
                case "i16":
                  HEAP16[e >> 1] = t;
                  break;
                case "i32":
                  HEAP32[e >> 2] = t;
                  break;
                case "i64":
                  abort("to do setValue(i64) use WASM_BIGINT");
                case "float":
                  HEAPF32[e >> 2] = t;
                  break;
                case "double":
                  HEAPF64[e >> 3] = t;
                  break;
                case "*":
                  HEAPU32[e >> 2] = t;
                  break;
                default:
                  abort(`invalid type for setValue: ${_}`);
              }
            }
            var ___memory_base = new WebAssembly.Global({ value: "i32", mutable: false }, 1024), ___stack_pointer = new WebAssembly.Global({ value: "i32", mutable: true }, 78096), ___table_base = new WebAssembly.Global({ value: "i32", mutable: false }, 1), nowIsMonotonic = 1, __emscripten_get_now_is_monotonic = () => nowIsMonotonic;
            __emscripten_get_now_is_monotonic.sig = "i";
            var _abort = () => {
              abort("");
            };
            _abort.sig = "v";
            var _emscripten_date_now = () => Date.now(), _emscripten_get_now;
            _emscripten_date_now.sig = "d", _emscripten_get_now = () => performance.now(), _emscripten_get_now.sig = "d";
            var _emscripten_memcpy_js = (e, t, _) => HEAPU8.copyWithin(e, t, t + _);
            _emscripten_memcpy_js.sig = "vppp";
            var getHeapMax = () => 2147483648, growMemory = (e) => {
              var t = (e - wasmMemory.buffer.byteLength + 65535) / 65536;
              try {
                return wasmMemory.grow(t), updateMemoryViews(), 1;
              } catch (e2) {
              }
            }, _emscripten_resize_heap = (e) => {
              var t = HEAPU8.length;
              e >>>= 0;
              var _ = getHeapMax();
              if (e > _) return false;
              for (var s, r, a = 1; a <= 4; a *= 2) {
                var o = t * (1 + 0.2 / a);
                o = Math.min(o, e + 100663296);
                var n = Math.min(_, (s = Math.max(e, o)) + ((r = 65536) - s % r) % r);
                if (growMemory(n)) return true;
              }
              return false;
            };
            _emscripten_resize_heap.sig = "ip";
            var _fd_close = (e) => 52;
            _fd_close.sig = "ii";
            var convertI32PairToI53Checked = (e, t) => t + 2097152 >>> 0 < 4194305 - !!e ? (e >>> 0) + 4294967296 * t : NaN;
            function _fd_seek(e, t, _, s, r) {
              convertI32PairToI53Checked(t, _);
              return 70;
            }
            _fd_seek.sig = "iiiiip";
            var printCharBuffers = [null, [], []], printChar = (e, t) => {
              var _ = printCharBuffers[e];
              0 === t || 10 === t ? ((1 === e ? out : err)(UTF8ArrayToString(_, 0)), _.length = 0) : _.push(t);
            }, SYSCALLS = { varargs: void 0, get() {
              var e = HEAP32[+SYSCALLS.varargs >> 2];
              return SYSCALLS.varargs += 4, e;
            }, getp: () => SYSCALLS.get(), getStr: (e) => UTF8ToString(e) }, _fd_write = (e, t, _, s) => {
              for (var r = 0, a = 0; a < _; a++) {
                var o = HEAPU32[t >> 2], n = HEAPU32[t + 4 >> 2];
                t += 8;
                for (var l = 0; l < n; l++) printChar(e, HEAPU8[o + l]);
                r += n;
              }
              return HEAPU32[s >> 2] = r, 0;
            };
            function _tree_sitter_log_callback(e, t) {
              if (currentLogCallback) {
                const _ = UTF8ToString(t);
                currentLogCallback(_, 0 !== e);
              }
            }
            function _tree_sitter_parse_callback(e, t, _, s, r) {
              const a = currentParseCallback(t, { row: _, column: s });
              "string" == typeof a ? (setValue(r, a.length, "i32"), stringToUTF16(a, e, 10240)) : setValue(r, 0, "i32");
            }
            _fd_write.sig = "iippp";
            var runtimeKeepaliveCounter = 0, keepRuntimeAlive = () => noExitRuntime || runtimeKeepaliveCounter > 0, _proc_exit = (e) => {
              var _a;
              EXITSTATUS = e, keepRuntimeAlive() || ((_a = Module.onExit) == null ? void 0 : _a.call(Module, e), ABORT = true), quit_(e, new ExitStatus(e));
            };
            _proc_exit.sig = "vi";
            var exitJS = (e, t) => {
              EXITSTATUS = e, _proc_exit(e);
            }, handleException = (e) => {
              if (e instanceof ExitStatus || "unwind" == e) return EXITSTATUS;
              quit_(1, e);
            }, lengthBytesUTF8 = (e) => {
              for (var t = 0, _ = 0; _ < e.length; ++_) {
                var s = e.charCodeAt(_);
                s <= 127 ? t++ : s <= 2047 ? t += 2 : s >= 55296 && s <= 57343 ? (t += 4, ++_) : t += 3;
              }
              return t;
            }, stringToUTF8Array = (e, t, _, s) => {
              if (!(s > 0)) return 0;
              for (var r = _, a = _ + s - 1, o = 0; o < e.length; ++o) {
                var n = e.charCodeAt(o);
                if (n >= 55296 && n <= 57343) n = 65536 + ((1023 & n) << 10) | 1023 & e.charCodeAt(++o);
                if (n <= 127) {
                  if (_ >= a) break;
                  t[_++] = n;
                } else if (n <= 2047) {
                  if (_ + 1 >= a) break;
                  t[_++] = 192 | n >> 6, t[_++] = 128 | 63 & n;
                } else if (n <= 65535) {
                  if (_ + 2 >= a) break;
                  t[_++] = 224 | n >> 12, t[_++] = 128 | n >> 6 & 63, t[_++] = 128 | 63 & n;
                } else {
                  if (_ + 3 >= a) break;
                  t[_++] = 240 | n >> 18, t[_++] = 128 | n >> 12 & 63, t[_++] = 128 | n >> 6 & 63, t[_++] = 128 | 63 & n;
                }
              }
              return t[_] = 0, _ - r;
            }, stringToUTF8 = (e, t, _) => stringToUTF8Array(e, HEAPU8, t, _), stringToUTF8OnStack = (e) => {
              var t = lengthBytesUTF8(e) + 1, _ = stackAlloc(t);
              return stringToUTF8(e, _, t), _;
            }, stringToUTF16 = (e, t, _) => {
              if (_ ??= 2147483647, _ < 2) return 0;
              for (var s = t, r = (_ -= 2) < 2 * e.length ? _ / 2 : e.length, a = 0; a < r; ++a) {
                var o = e.charCodeAt(a);
                HEAP16[t >> 1] = o, t += 2;
              }
              return HEAP16[t >> 1] = 0, t - s;
            }, AsciiToString = (e) => {
              for (var t = ""; ; ) {
                var _ = HEAPU8[e++];
                if (!_) return t;
                t += String.fromCharCode(_);
              }
            }, wasmImports = { __heap_base: ___heap_base, __indirect_function_table: wasmTable, __memory_base: ___memory_base, __stack_pointer: ___stack_pointer, __table_base: ___table_base, _emscripten_get_now_is_monotonic: __emscripten_get_now_is_monotonic, abort: _abort, emscripten_get_now: _emscripten_get_now, emscripten_memcpy_js: _emscripten_memcpy_js, emscripten_resize_heap: _emscripten_resize_heap, fd_close: _fd_close, fd_seek: _fd_seek, fd_write: _fd_write, memory: wasmMemory, tree_sitter_log_callback: _tree_sitter_log_callback, tree_sitter_parse_callback: _tree_sitter_parse_callback }, wasmExports = createWasm(), ___wasm_call_ctors = () => (___wasm_call_ctors = wasmExports.__wasm_call_ctors)(), ___wasm_apply_data_relocs = () => (___wasm_apply_data_relocs = wasmExports.__wasm_apply_data_relocs)(), _malloc = Module._malloc = (e) => (_malloc = Module._malloc = wasmExports.malloc)(e), _calloc = Module._calloc = (e, t) => (_calloc = Module._calloc = wasmExports.calloc)(e, t), _realloc = Module._realloc = (e, t) => (_realloc = Module._realloc = wasmExports.realloc)(e, t), _free = Module._free = (e) => (_free = Module._free = wasmExports.free)(e), _ts_language_symbol_count = Module._ts_language_symbol_count = (e) => (_ts_language_symbol_count = Module._ts_language_symbol_count = wasmExports.ts_language_symbol_count)(e), _ts_language_state_count = Module._ts_language_state_count = (e) => (_ts_language_state_count = Module._ts_language_state_count = wasmExports.ts_language_state_count)(e), _ts_language_version = Module._ts_language_version = (e) => (_ts_language_version = Module._ts_language_version = wasmExports.ts_language_version)(e), _ts_language_field_count = Module._ts_language_field_count = (e) => (_ts_language_field_count = Module._ts_language_field_count = wasmExports.ts_language_field_count)(e), _ts_language_next_state = Module._ts_language_next_state = (e, t, _) => (_ts_language_next_state = Module._ts_language_next_state = wasmExports.ts_language_next_state)(e, t, _), _ts_language_symbol_name = Module._ts_language_symbol_name = (e, t) => (_ts_language_symbol_name = Module._ts_language_symbol_name = wasmExports.ts_language_symbol_name)(e, t), _ts_language_symbol_for_name = Module._ts_language_symbol_for_name = (e, t, _, s) => (_ts_language_symbol_for_name = Module._ts_language_symbol_for_name = wasmExports.ts_language_symbol_for_name)(e, t, _, s), _strncmp = Module._strncmp = (e, t, _) => (_strncmp = Module._strncmp = wasmExports.strncmp)(e, t, _), _ts_language_symbol_type = Module._ts_language_symbol_type = (e, t) => (_ts_language_symbol_type = Module._ts_language_symbol_type = wasmExports.ts_language_symbol_type)(e, t), _ts_language_field_name_for_id = Module._ts_language_field_name_for_id = (e, t) => (_ts_language_field_name_for_id = Module._ts_language_field_name_for_id = wasmExports.ts_language_field_name_for_id)(e, t), _ts_lookahead_iterator_new = Module._ts_lookahead_iterator_new = (e, t) => (_ts_lookahead_iterator_new = Module._ts_lookahead_iterator_new = wasmExports.ts_lookahead_iterator_new)(e, t), _ts_lookahead_iterator_delete = Module._ts_lookahead_iterator_delete = (e) => (_ts_lookahead_iterator_delete = Module._ts_lookahead_iterator_delete = wasmExports.ts_lookahead_iterator_delete)(e), _ts_lookahead_iterator_reset_state = Module._ts_lookahead_iterator_reset_state = (e, t) => (_ts_lookahead_iterator_reset_state = Module._ts_lookahead_iterator_reset_state = wasmExports.ts_lookahead_iterator_reset_state)(e, t), _ts_lookahead_iterator_reset = Module._ts_lookahead_iterator_reset = (e, t, _) => (_ts_lookahead_iterator_reset = Module._ts_lookahead_iterator_reset = wasmExports.ts_lookahead_iterator_reset)(e, t, _), _ts_lookahead_iterator_next = Module._ts_lookahead_iterator_next = (e) => (_ts_lookahead_iterator_next = Module._ts_lookahead_iterator_next = wasmExports.ts_lookahead_iterator_next)(e), _ts_lookahead_iterator_current_symbol = Module._ts_lookahead_iterator_current_symbol = (e) => (_ts_lookahead_iterator_current_symbol = Module._ts_lookahead_iterator_current_symbol = wasmExports.ts_lookahead_iterator_current_symbol)(e), _memset = Module._memset = (e, t, _) => (_memset = Module._memset = wasmExports.memset)(e, t, _), _memcpy = Module._memcpy = (e, t, _) => (_memcpy = Module._memcpy = wasmExports.memcpy)(e, t, _), _ts_parser_delete = Module._ts_parser_delete = (e) => (_ts_parser_delete = Module._ts_parser_delete = wasmExports.ts_parser_delete)(e), _ts_parser_reset = Module._ts_parser_reset = (e) => (_ts_parser_reset = Module._ts_parser_reset = wasmExports.ts_parser_reset)(e), _ts_parser_set_language = Module._ts_parser_set_language = (e, t) => (_ts_parser_set_language = Module._ts_parser_set_language = wasmExports.ts_parser_set_language)(e, t), _ts_parser_timeout_micros = Module._ts_parser_timeout_micros = (e) => (_ts_parser_timeout_micros = Module._ts_parser_timeout_micros = wasmExports.ts_parser_timeout_micros)(e), _ts_parser_set_timeout_micros = Module._ts_parser_set_timeout_micros = (e, t, _) => (_ts_parser_set_timeout_micros = Module._ts_parser_set_timeout_micros = wasmExports.ts_parser_set_timeout_micros)(e, t, _), _ts_parser_set_included_ranges = Module._ts_parser_set_included_ranges = (e, t, _) => (_ts_parser_set_included_ranges = Module._ts_parser_set_included_ranges = wasmExports.ts_parser_set_included_ranges)(e, t, _), _memmove = Module._memmove = (e, t, _) => (_memmove = Module._memmove = wasmExports.memmove)(e, t, _), _memcmp = Module._memcmp = (e, t, _) => (_memcmp = Module._memcmp = wasmExports.memcmp)(e, t, _), _ts_query_new = Module._ts_query_new = (e, t, _, s, r) => (_ts_query_new = Module._ts_query_new = wasmExports.ts_query_new)(e, t, _, s, r), _ts_query_delete = Module._ts_query_delete = (e) => (_ts_query_delete = Module._ts_query_delete = wasmExports.ts_query_delete)(e), _iswspace = Module._iswspace = (e) => (_iswspace = Module._iswspace = wasmExports.iswspace)(e), _iswalnum = Module._iswalnum = (e) => (_iswalnum = Module._iswalnum = wasmExports.iswalnum)(e), _ts_query_pattern_count = Module._ts_query_pattern_count = (e) => (_ts_query_pattern_count = Module._ts_query_pattern_count = wasmExports.ts_query_pattern_count)(e), _ts_query_capture_count = Module._ts_query_capture_count = (e) => (_ts_query_capture_count = Module._ts_query_capture_count = wasmExports.ts_query_capture_count)(e), _ts_query_string_count = Module._ts_query_string_count = (e) => (_ts_query_string_count = Module._ts_query_string_count = wasmExports.ts_query_string_count)(e), _ts_query_capture_name_for_id = Module._ts_query_capture_name_for_id = (e, t, _) => (_ts_query_capture_name_for_id = Module._ts_query_capture_name_for_id = wasmExports.ts_query_capture_name_for_id)(e, t, _), _ts_query_string_value_for_id = Module._ts_query_string_value_for_id = (e, t, _) => (_ts_query_string_value_for_id = Module._ts_query_string_value_for_id = wasmExports.ts_query_string_value_for_id)(e, t, _), _ts_query_predicates_for_pattern = Module._ts_query_predicates_for_pattern = (e, t, _) => (_ts_query_predicates_for_pattern = Module._ts_query_predicates_for_pattern = wasmExports.ts_query_predicates_for_pattern)(e, t, _), _ts_query_disable_capture = Module._ts_query_disable_capture = (e, t, _) => (_ts_query_disable_capture = Module._ts_query_disable_capture = wasmExports.ts_query_disable_capture)(e, t, _), _ts_tree_copy = Module._ts_tree_copy = (e) => (_ts_tree_copy = Module._ts_tree_copy = wasmExports.ts_tree_copy)(e), _ts_tree_delete = Module._ts_tree_delete = (e) => (_ts_tree_delete = Module._ts_tree_delete = wasmExports.ts_tree_delete)(e), _ts_init = Module._ts_init = () => (_ts_init = Module._ts_init = wasmExports.ts_init)(), _ts_parser_new_wasm = Module._ts_parser_new_wasm = () => (_ts_parser_new_wasm = Module._ts_parser_new_wasm = wasmExports.ts_parser_new_wasm)(), _ts_parser_enable_logger_wasm = Module._ts_parser_enable_logger_wasm = (e, t) => (_ts_parser_enable_logger_wasm = Module._ts_parser_enable_logger_wasm = wasmExports.ts_parser_enable_logger_wasm)(e, t), _ts_parser_parse_wasm = Module._ts_parser_parse_wasm = (e, t, _, s, r) => (_ts_parser_parse_wasm = Module._ts_parser_parse_wasm = wasmExports.ts_parser_parse_wasm)(e, t, _, s, r), _ts_parser_included_ranges_wasm = Module._ts_parser_included_ranges_wasm = (e) => (_ts_parser_included_ranges_wasm = Module._ts_parser_included_ranges_wasm = wasmExports.ts_parser_included_ranges_wasm)(e), _ts_language_type_is_named_wasm = Module._ts_language_type_is_named_wasm = (e, t) => (_ts_language_type_is_named_wasm = Module._ts_language_type_is_named_wasm = wasmExports.ts_language_type_is_named_wasm)(e, t), _ts_language_type_is_visible_wasm = Module._ts_language_type_is_visible_wasm = (e, t) => (_ts_language_type_is_visible_wasm = Module._ts_language_type_is_visible_wasm = wasmExports.ts_language_type_is_visible_wasm)(e, t), _ts_tree_root_node_wasm = Module._ts_tree_root_node_wasm = (e) => (_ts_tree_root_node_wasm = Module._ts_tree_root_node_wasm = wasmExports.ts_tree_root_node_wasm)(e), _ts_tree_root_node_with_offset_wasm = Module._ts_tree_root_node_with_offset_wasm = (e) => (_ts_tree_root_node_with_offset_wasm = Module._ts_tree_root_node_with_offset_wasm = wasmExports.ts_tree_root_node_with_offset_wasm)(e), _ts_tree_edit_wasm = Module._ts_tree_edit_wasm = (e) => (_ts_tree_edit_wasm = Module._ts_tree_edit_wasm = wasmExports.ts_tree_edit_wasm)(e), _ts_tree_included_ranges_wasm = Module._ts_tree_included_ranges_wasm = (e) => (_ts_tree_included_ranges_wasm = Module._ts_tree_included_ranges_wasm = wasmExports.ts_tree_included_ranges_wasm)(e), _ts_tree_get_changed_ranges_wasm = Module._ts_tree_get_changed_ranges_wasm = (e, t) => (_ts_tree_get_changed_ranges_wasm = Module._ts_tree_get_changed_ranges_wasm = wasmExports.ts_tree_get_changed_ranges_wasm)(e, t), _ts_tree_cursor_new_wasm = Module._ts_tree_cursor_new_wasm = (e) => (_ts_tree_cursor_new_wasm = Module._ts_tree_cursor_new_wasm = wasmExports.ts_tree_cursor_new_wasm)(e), _ts_tree_cursor_delete_wasm = Module._ts_tree_cursor_delete_wasm = (e) => (_ts_tree_cursor_delete_wasm = Module._ts_tree_cursor_delete_wasm = wasmExports.ts_tree_cursor_delete_wasm)(e), _ts_tree_cursor_reset_wasm = Module._ts_tree_cursor_reset_wasm = (e) => (_ts_tree_cursor_reset_wasm = Module._ts_tree_cursor_reset_wasm = wasmExports.ts_tree_cursor_reset_wasm)(e), _ts_tree_cursor_reset_to_wasm = Module._ts_tree_cursor_reset_to_wasm = (e, t) => (_ts_tree_cursor_reset_to_wasm = Module._ts_tree_cursor_reset_to_wasm = wasmExports.ts_tree_cursor_reset_to_wasm)(e, t), _ts_tree_cursor_goto_first_child_wasm = Module._ts_tree_cursor_goto_first_child_wasm = (e) => (_ts_tree_cursor_goto_first_child_wasm = Module._ts_tree_cursor_goto_first_child_wasm = wasmExports.ts_tree_cursor_goto_first_child_wasm)(e), _ts_tree_cursor_goto_last_child_wasm = Module._ts_tree_cursor_goto_last_child_wasm = (e) => (_ts_tree_cursor_goto_last_child_wasm = Module._ts_tree_cursor_goto_last_child_wasm = wasmExports.ts_tree_cursor_goto_last_child_wasm)(e), _ts_tree_cursor_goto_first_child_for_index_wasm = Module._ts_tree_cursor_goto_first_child_for_index_wasm = (e) => (_ts_tree_cursor_goto_first_child_for_index_wasm = Module._ts_tree_cursor_goto_first_child_for_index_wasm = wasmExports.ts_tree_cursor_goto_first_child_for_index_wasm)(e), _ts_tree_cursor_goto_first_child_for_position_wasm = Module._ts_tree_cursor_goto_first_child_for_position_wasm = (e) => (_ts_tree_cursor_goto_first_child_for_position_wasm = Module._ts_tree_cursor_goto_first_child_for_position_wasm = wasmExports.ts_tree_cursor_goto_first_child_for_position_wasm)(e), _ts_tree_cursor_goto_next_sibling_wasm = Module._ts_tree_cursor_goto_next_sibling_wasm = (e) => (_ts_tree_cursor_goto_next_sibling_wasm = Module._ts_tree_cursor_goto_next_sibling_wasm = wasmExports.ts_tree_cursor_goto_next_sibling_wasm)(e), _ts_tree_cursor_goto_previous_sibling_wasm = Module._ts_tree_cursor_goto_previous_sibling_wasm = (e) => (_ts_tree_cursor_goto_previous_sibling_wasm = Module._ts_tree_cursor_goto_previous_sibling_wasm = wasmExports.ts_tree_cursor_goto_previous_sibling_wasm)(e), _ts_tree_cursor_goto_descendant_wasm = Module._ts_tree_cursor_goto_descendant_wasm = (e, t) => (_ts_tree_cursor_goto_descendant_wasm = Module._ts_tree_cursor_goto_descendant_wasm = wasmExports.ts_tree_cursor_goto_descendant_wasm)(e, t), _ts_tree_cursor_goto_parent_wasm = Module._ts_tree_cursor_goto_parent_wasm = (e) => (_ts_tree_cursor_goto_parent_wasm = Module._ts_tree_cursor_goto_parent_wasm = wasmExports.ts_tree_cursor_goto_parent_wasm)(e), _ts_tree_cursor_current_node_type_id_wasm = Module._ts_tree_cursor_current_node_type_id_wasm = (e) => (_ts_tree_cursor_current_node_type_id_wasm = Module._ts_tree_cursor_current_node_type_id_wasm = wasmExports.ts_tree_cursor_current_node_type_id_wasm)(e), _ts_tree_cursor_current_node_state_id_wasm = Module._ts_tree_cursor_current_node_state_id_wasm = (e) => (_ts_tree_cursor_current_node_state_id_wasm = Module._ts_tree_cursor_current_node_state_id_wasm = wasmExports.ts_tree_cursor_current_node_state_id_wasm)(e), _ts_tree_cursor_current_node_is_named_wasm = Module._ts_tree_cursor_current_node_is_named_wasm = (e) => (_ts_tree_cursor_current_node_is_named_wasm = Module._ts_tree_cursor_current_node_is_named_wasm = wasmExports.ts_tree_cursor_current_node_is_named_wasm)(e), _ts_tree_cursor_current_node_is_missing_wasm = Module._ts_tree_cursor_current_node_is_missing_wasm = (e) => (_ts_tree_cursor_current_node_is_missing_wasm = Module._ts_tree_cursor_current_node_is_missing_wasm = wasmExports.ts_tree_cursor_current_node_is_missing_wasm)(e), _ts_tree_cursor_current_node_id_wasm = Module._ts_tree_cursor_current_node_id_wasm = (e) => (_ts_tree_cursor_current_node_id_wasm = Module._ts_tree_cursor_current_node_id_wasm = wasmExports.ts_tree_cursor_current_node_id_wasm)(e), _ts_tree_cursor_start_position_wasm = Module._ts_tree_cursor_start_position_wasm = (e) => (_ts_tree_cursor_start_position_wasm = Module._ts_tree_cursor_start_position_wasm = wasmExports.ts_tree_cursor_start_position_wasm)(e), _ts_tree_cursor_end_position_wasm = Module._ts_tree_cursor_end_position_wasm = (e) => (_ts_tree_cursor_end_position_wasm = Module._ts_tree_cursor_end_position_wasm = wasmExports.ts_tree_cursor_end_position_wasm)(e), _ts_tree_cursor_start_index_wasm = Module._ts_tree_cursor_start_index_wasm = (e) => (_ts_tree_cursor_start_index_wasm = Module._ts_tree_cursor_start_index_wasm = wasmExports.ts_tree_cursor_start_index_wasm)(e), _ts_tree_cursor_end_index_wasm = Module._ts_tree_cursor_end_index_wasm = (e) => (_ts_tree_cursor_end_index_wasm = Module._ts_tree_cursor_end_index_wasm = wasmExports.ts_tree_cursor_end_index_wasm)(e), _ts_tree_cursor_current_field_id_wasm = Module._ts_tree_cursor_current_field_id_wasm = (e) => (_ts_tree_cursor_current_field_id_wasm = Module._ts_tree_cursor_current_field_id_wasm = wasmExports.ts_tree_cursor_current_field_id_wasm)(e), _ts_tree_cursor_current_depth_wasm = Module._ts_tree_cursor_current_depth_wasm = (e) => (_ts_tree_cursor_current_depth_wasm = Module._ts_tree_cursor_current_depth_wasm = wasmExports.ts_tree_cursor_current_depth_wasm)(e), _ts_tree_cursor_current_descendant_index_wasm = Module._ts_tree_cursor_current_descendant_index_wasm = (e) => (_ts_tree_cursor_current_descendant_index_wasm = Module._ts_tree_cursor_current_descendant_index_wasm = wasmExports.ts_tree_cursor_current_descendant_index_wasm)(e), _ts_tree_cursor_current_node_wasm = Module._ts_tree_cursor_current_node_wasm = (e) => (_ts_tree_cursor_current_node_wasm = Module._ts_tree_cursor_current_node_wasm = wasmExports.ts_tree_cursor_current_node_wasm)(e), _ts_node_symbol_wasm = Module._ts_node_symbol_wasm = (e) => (_ts_node_symbol_wasm = Module._ts_node_symbol_wasm = wasmExports.ts_node_symbol_wasm)(e), _ts_node_field_name_for_child_wasm = Module._ts_node_field_name_for_child_wasm = (e, t) => (_ts_node_field_name_for_child_wasm = Module._ts_node_field_name_for_child_wasm = wasmExports.ts_node_field_name_for_child_wasm)(e, t), _ts_node_children_by_field_id_wasm = Module._ts_node_children_by_field_id_wasm = (e, t) => (_ts_node_children_by_field_id_wasm = Module._ts_node_children_by_field_id_wasm = wasmExports.ts_node_children_by_field_id_wasm)(e, t), _ts_node_first_child_for_byte_wasm = Module._ts_node_first_child_for_byte_wasm = (e) => (_ts_node_first_child_for_byte_wasm = Module._ts_node_first_child_for_byte_wasm = wasmExports.ts_node_first_child_for_byte_wasm)(e), _ts_node_first_named_child_for_byte_wasm = Module._ts_node_first_named_child_for_byte_wasm = (e) => (_ts_node_first_named_child_for_byte_wasm = Module._ts_node_first_named_child_for_byte_wasm = wasmExports.ts_node_first_named_child_for_byte_wasm)(e), _ts_node_grammar_symbol_wasm = Module._ts_node_grammar_symbol_wasm = (e) => (_ts_node_grammar_symbol_wasm = Module._ts_node_grammar_symbol_wasm = wasmExports.ts_node_grammar_symbol_wasm)(e), _ts_node_child_count_wasm = Module._ts_node_child_count_wasm = (e) => (_ts_node_child_count_wasm = Module._ts_node_child_count_wasm = wasmExports.ts_node_child_count_wasm)(e), _ts_node_named_child_count_wasm = Module._ts_node_named_child_count_wasm = (e) => (_ts_node_named_child_count_wasm = Module._ts_node_named_child_count_wasm = wasmExports.ts_node_named_child_count_wasm)(e), _ts_node_child_wasm = Module._ts_node_child_wasm = (e, t) => (_ts_node_child_wasm = Module._ts_node_child_wasm = wasmExports.ts_node_child_wasm)(e, t), _ts_node_named_child_wasm = Module._ts_node_named_child_wasm = (e, t) => (_ts_node_named_child_wasm = Module._ts_node_named_child_wasm = wasmExports.ts_node_named_child_wasm)(e, t), _ts_node_child_by_field_id_wasm = Module._ts_node_child_by_field_id_wasm = (e, t) => (_ts_node_child_by_field_id_wasm = Module._ts_node_child_by_field_id_wasm = wasmExports.ts_node_child_by_field_id_wasm)(e, t), _ts_node_next_sibling_wasm = Module._ts_node_next_sibling_wasm = (e) => (_ts_node_next_sibling_wasm = Module._ts_node_next_sibling_wasm = wasmExports.ts_node_next_sibling_wasm)(e), _ts_node_prev_sibling_wasm = Module._ts_node_prev_sibling_wasm = (e) => (_ts_node_prev_sibling_wasm = Module._ts_node_prev_sibling_wasm = wasmExports.ts_node_prev_sibling_wasm)(e), _ts_node_next_named_sibling_wasm = Module._ts_node_next_named_sibling_wasm = (e) => (_ts_node_next_named_sibling_wasm = Module._ts_node_next_named_sibling_wasm = wasmExports.ts_node_next_named_sibling_wasm)(e), _ts_node_prev_named_sibling_wasm = Module._ts_node_prev_named_sibling_wasm = (e) => (_ts_node_prev_named_sibling_wasm = Module._ts_node_prev_named_sibling_wasm = wasmExports.ts_node_prev_named_sibling_wasm)(e), _ts_node_descendant_count_wasm = Module._ts_node_descendant_count_wasm = (e) => (_ts_node_descendant_count_wasm = Module._ts_node_descendant_count_wasm = wasmExports.ts_node_descendant_count_wasm)(e), _ts_node_parent_wasm = Module._ts_node_parent_wasm = (e) => (_ts_node_parent_wasm = Module._ts_node_parent_wasm = wasmExports.ts_node_parent_wasm)(e), _ts_node_descendant_for_index_wasm = Module._ts_node_descendant_for_index_wasm = (e) => (_ts_node_descendant_for_index_wasm = Module._ts_node_descendant_for_index_wasm = wasmExports.ts_node_descendant_for_index_wasm)(e), _ts_node_named_descendant_for_index_wasm = Module._ts_node_named_descendant_for_index_wasm = (e) => (_ts_node_named_descendant_for_index_wasm = Module._ts_node_named_descendant_for_index_wasm = wasmExports.ts_node_named_descendant_for_index_wasm)(e), _ts_node_descendant_for_position_wasm = Module._ts_node_descendant_for_position_wasm = (e) => (_ts_node_descendant_for_position_wasm = Module._ts_node_descendant_for_position_wasm = wasmExports.ts_node_descendant_for_position_wasm)(e), _ts_node_named_descendant_for_position_wasm = Module._ts_node_named_descendant_for_position_wasm = (e) => (_ts_node_named_descendant_for_position_wasm = Module._ts_node_named_descendant_for_position_wasm = wasmExports.ts_node_named_descendant_for_position_wasm)(e), _ts_node_start_point_wasm = Module._ts_node_start_point_wasm = (e) => (_ts_node_start_point_wasm = Module._ts_node_start_point_wasm = wasmExports.ts_node_start_point_wasm)(e), _ts_node_end_point_wasm = Module._ts_node_end_point_wasm = (e) => (_ts_node_end_point_wasm = Module._ts_node_end_point_wasm = wasmExports.ts_node_end_point_wasm)(e), _ts_node_start_index_wasm = Module._ts_node_start_index_wasm = (e) => (_ts_node_start_index_wasm = Module._ts_node_start_index_wasm = wasmExports.ts_node_start_index_wasm)(e), _ts_node_end_index_wasm = Module._ts_node_end_index_wasm = (e) => (_ts_node_end_index_wasm = Module._ts_node_end_index_wasm = wasmExports.ts_node_end_index_wasm)(e), _ts_node_to_string_wasm = Module._ts_node_to_string_wasm = (e) => (_ts_node_to_string_wasm = Module._ts_node_to_string_wasm = wasmExports.ts_node_to_string_wasm)(e), _ts_node_children_wasm = Module._ts_node_children_wasm = (e) => (_ts_node_children_wasm = Module._ts_node_children_wasm = wasmExports.ts_node_children_wasm)(e), _ts_node_named_children_wasm = Module._ts_node_named_children_wasm = (e) => (_ts_node_named_children_wasm = Module._ts_node_named_children_wasm = wasmExports.ts_node_named_children_wasm)(e), _ts_node_descendants_of_type_wasm = Module._ts_node_descendants_of_type_wasm = (e, t, _, s, r, a, o) => (_ts_node_descendants_of_type_wasm = Module._ts_node_descendants_of_type_wasm = wasmExports.ts_node_descendants_of_type_wasm)(e, t, _, s, r, a, o), _ts_node_is_named_wasm = Module._ts_node_is_named_wasm = (e) => (_ts_node_is_named_wasm = Module._ts_node_is_named_wasm = wasmExports.ts_node_is_named_wasm)(e), _ts_node_has_changes_wasm = Module._ts_node_has_changes_wasm = (e) => (_ts_node_has_changes_wasm = Module._ts_node_has_changes_wasm = wasmExports.ts_node_has_changes_wasm)(e), _ts_node_has_error_wasm = Module._ts_node_has_error_wasm = (e) => (_ts_node_has_error_wasm = Module._ts_node_has_error_wasm = wasmExports.ts_node_has_error_wasm)(e), _ts_node_is_error_wasm = Module._ts_node_is_error_wasm = (e) => (_ts_node_is_error_wasm = Module._ts_node_is_error_wasm = wasmExports.ts_node_is_error_wasm)(e), _ts_node_is_missing_wasm = Module._ts_node_is_missing_wasm = (e) => (_ts_node_is_missing_wasm = Module._ts_node_is_missing_wasm = wasmExports.ts_node_is_missing_wasm)(e), _ts_node_is_extra_wasm = Module._ts_node_is_extra_wasm = (e) => (_ts_node_is_extra_wasm = Module._ts_node_is_extra_wasm = wasmExports.ts_node_is_extra_wasm)(e), _ts_node_parse_state_wasm = Module._ts_node_parse_state_wasm = (e) => (_ts_node_parse_state_wasm = Module._ts_node_parse_state_wasm = wasmExports.ts_node_parse_state_wasm)(e), _ts_node_next_parse_state_wasm = Module._ts_node_next_parse_state_wasm = (e) => (_ts_node_next_parse_state_wasm = Module._ts_node_next_parse_state_wasm = wasmExports.ts_node_next_parse_state_wasm)(e), _ts_query_matches_wasm = Module._ts_query_matches_wasm = (e, t, _, s, r, a, o, n, l, d) => (_ts_query_matches_wasm = Module._ts_query_matches_wasm = wasmExports.ts_query_matches_wasm)(e, t, _, s, r, a, o, n, l, d), _ts_query_captures_wasm = Module._ts_query_captures_wasm = (e, t, _, s, r, a, o, n, l, d) => (_ts_query_captures_wasm = Module._ts_query_captures_wasm = wasmExports.ts_query_captures_wasm)(e, t, _, s, r, a, o, n, l, d), _iswalpha = Module._iswalpha = (e) => (_iswalpha = Module._iswalpha = wasmExports.iswalpha)(e), _iswblank = Module._iswblank = (e) => (_iswblank = Module._iswblank = wasmExports.iswblank)(e), _iswdigit = Module._iswdigit = (e) => (_iswdigit = Module._iswdigit = wasmExports.iswdigit)(e), _iswlower = Module._iswlower = (e) => (_iswlower = Module._iswlower = wasmExports.iswlower)(e), _iswupper = Module._iswupper = (e) => (_iswupper = Module._iswupper = wasmExports.iswupper)(e), _iswxdigit = Module._iswxdigit = (e) => (_iswxdigit = Module._iswxdigit = wasmExports.iswxdigit)(e), _memchr = Module._memchr = (e, t, _) => (_memchr = Module._memchr = wasmExports.memchr)(e, t, _), _strlen = Module._strlen = (e) => (_strlen = Module._strlen = wasmExports.strlen)(e), _strcmp = Module._strcmp = (e, t) => (_strcmp = Module._strcmp = wasmExports.strcmp)(e, t), _strncat = Module._strncat = (e, t, _) => (_strncat = Module._strncat = wasmExports.strncat)(e, t, _), _strncpy = Module._strncpy = (e, t, _) => (_strncpy = Module._strncpy = wasmExports.strncpy)(e, t, _), _towlower = Module._towlower = (e) => (_towlower = Module._towlower = wasmExports.towlower)(e), _towupper = Module._towupper = (e) => (_towupper = Module._towupper = wasmExports.towupper)(e), _setThrew = (e, t) => (_setThrew = wasmExports.setThrew)(e, t), stackSave = () => (stackSave = wasmExports.stackSave)(), stackRestore = (e) => (stackRestore = wasmExports.stackRestore)(e), stackAlloc = (e) => (stackAlloc = wasmExports.stackAlloc)(e), dynCall_jiji = Module.dynCall_jiji = (e, t, _, s, r) => (dynCall_jiji = Module.dynCall_jiji = wasmExports.dynCall_jiji)(e, t, _, s, r), _orig$ts_parser_timeout_micros = Module._orig$ts_parser_timeout_micros = (e) => (_orig$ts_parser_timeout_micros = Module._orig$ts_parser_timeout_micros = wasmExports.orig$ts_parser_timeout_micros)(e), _orig$ts_parser_set_timeout_micros = Module._orig$ts_parser_set_timeout_micros = (e, t) => (_orig$ts_parser_set_timeout_micros = Module._orig$ts_parser_set_timeout_micros = wasmExports.orig$ts_parser_set_timeout_micros)(e, t), calledRun;
            function callMain(e = []) {
              var t = resolveGlobalSymbol("main").sym;
              if (t) {
                e.unshift(thisProgram);
                var _ = e.length, s = stackAlloc(4 * (_ + 1)), r = s;
                e.forEach((e2) => {
                  HEAPU32[r >> 2] = stringToUTF8OnStack(e2), r += 4;
                }), HEAPU32[r >> 2] = 0;
                try {
                  var a = t(_, s);
                  return exitJS(a, true), a;
                } catch (e2) {
                  return handleException(e2);
                }
              }
            }
            function run(e = arguments_) {
              function t() {
                calledRun || (calledRun = true, Module.calledRun = true, ABORT || (initRuntime(), preMain(), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), shouldRunNow && callMain(e), postRun()));
              }
              runDependencies > 0 || (preRun(), runDependencies > 0 || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                  Module.setStatus("");
                }, 1), t();
              }, 1)) : t()));
            }
            if (Module.AsciiToString = AsciiToString, Module.stringToUTF16 = stringToUTF16, dependenciesFulfilled = function e() {
              calledRun || run(), calledRun || (dependenciesFulfilled = e);
            }, Module.preInit) for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0; ) Module.preInit.pop()();
            var shouldRunNow = true;
            Module.noInitialRun && (shouldRunNow = false), run();
            const C = Module, INTERNAL = {}, SIZE_OF_INT = 4, SIZE_OF_CURSOR = 4 * SIZE_OF_INT, SIZE_OF_NODE = 5 * SIZE_OF_INT, SIZE_OF_POINT = 2 * SIZE_OF_INT, SIZE_OF_RANGE = 2 * SIZE_OF_INT + 2 * SIZE_OF_POINT, ZERO_POINT = { row: 0, column: 0 }, QUERY_WORD_REGEX = /[\w-.]*/g, PREDICATE_STEP_TYPE_CAPTURE = 1, PREDICATE_STEP_TYPE_STRING = 2, LANGUAGE_FUNCTION_REGEX = /^_?tree_sitter_\w+/;
            let VERSION, MIN_COMPATIBLE_VERSION, TRANSFER_BUFFER, currentParseCallback, currentLogCallback;
            class ParserImpl {
              static init() {
                TRANSFER_BUFFER = C._ts_init(), VERSION = getValue(TRANSFER_BUFFER, "i32"), MIN_COMPATIBLE_VERSION = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
              }
              initialize() {
                C._ts_parser_new_wasm(), this[0] = getValue(TRANSFER_BUFFER, "i32"), this[1] = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
              }
              delete() {
                C._ts_parser_delete(this[0]), C._free(this[1]), this[0] = 0, this[1] = 0;
              }
              setLanguage(e) {
                let t;
                if (e) {
                  if (e.constructor !== Language) throw new Error("Argument must be a Language");
                  {
                    t = e[0];
                    const _ = C._ts_language_version(t);
                    if (_ < MIN_COMPATIBLE_VERSION || VERSION < _) throw new Error(`Incompatible language version ${_}. Compatibility range ${MIN_COMPATIBLE_VERSION} through ${VERSION}.`);
                  }
                } else t = 0, e = null;
                return this.language = e, C._ts_parser_set_language(this[0], t), this;
              }
              getLanguage() {
                return this.language;
              }
              parse(e, t, _) {
                if ("string" == typeof e) currentParseCallback = (t2, _2) => e.slice(t2);
                else {
                  if ("function" != typeof e) throw new Error("Argument must be a string or a function");
                  currentParseCallback = e;
                }
                this.logCallback ? (currentLogCallback = this.logCallback, C._ts_parser_enable_logger_wasm(this[0], 1)) : (currentLogCallback = null, C._ts_parser_enable_logger_wasm(this[0], 0));
                let s = 0, r = 0;
                if (_ == null ? void 0 : _.includedRanges) {
                  s = _.includedRanges.length, r = C._calloc(s, SIZE_OF_RANGE);
                  let e2 = r;
                  for (let t2 = 0; t2 < s; t2++) marshalRange(e2, _.includedRanges[t2]), e2 += SIZE_OF_RANGE;
                }
                const a = C._ts_parser_parse_wasm(this[0], this[1], t ? t[0] : 0, r, s);
                if (!a) throw currentParseCallback = null, currentLogCallback = null, new Error("Parsing failed");
                const o = new Tree(INTERNAL, a, this.language, currentParseCallback);
                return currentParseCallback = null, currentLogCallback = null, o;
              }
              reset() {
                C._ts_parser_reset(this[0]);
              }
              getIncludedRanges() {
                C._ts_parser_included_ranges_wasm(this[0]);
                const e = getValue(TRANSFER_BUFFER, "i32"), t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), _ = new Array(e);
                if (e > 0) {
                  let s = t;
                  for (let t2 = 0; t2 < e; t2++) _[t2] = unmarshalRange(s), s += SIZE_OF_RANGE;
                  C._free(t);
                }
                return _;
              }
              getTimeoutMicros() {
                return C._ts_parser_timeout_micros(this[0]);
              }
              setTimeoutMicros(e) {
                C._ts_parser_set_timeout_micros(this[0], e);
              }
              setLogger(e) {
                if (e) {
                  if ("function" != typeof e) throw new Error("Logger callback must be a function");
                } else e = null;
                return this.logCallback = e, this;
              }
              getLogger() {
                return this.logCallback;
              }
            }
            class Tree {
              constructor(e, t, _, s) {
                assertInternal(e), this[0] = t, this.language = _, this.textCallback = s;
              }
              copy() {
                const e = C._ts_tree_copy(this[0]);
                return new Tree(INTERNAL, e, this.language, this.textCallback);
              }
              delete() {
                C._ts_tree_delete(this[0]), this[0] = 0;
              }
              edit(e) {
                marshalEdit(e), C._ts_tree_edit_wasm(this[0]);
              }
              get rootNode() {
                return C._ts_tree_root_node_wasm(this[0]), unmarshalNode(this);
              }
              rootNodeWithOffset(e, t) {
                const _ = TRANSFER_BUFFER + SIZE_OF_NODE;
                return setValue(_, e, "i32"), marshalPoint(_ + SIZE_OF_INT, t), C._ts_tree_root_node_with_offset_wasm(this[0]), unmarshalNode(this);
              }
              getLanguage() {
                return this.language;
              }
              walk() {
                return this.rootNode.walk();
              }
              getChangedRanges(e) {
                if (e.constructor !== Tree) throw new TypeError("Argument must be a Tree");
                C._ts_tree_get_changed_ranges_wasm(this[0], e[0]);
                const t = getValue(TRANSFER_BUFFER, "i32"), _ = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), s = new Array(t);
                if (t > 0) {
                  let e2 = _;
                  for (let _2 = 0; _2 < t; _2++) s[_2] = unmarshalRange(e2), e2 += SIZE_OF_RANGE;
                  C._free(_);
                }
                return s;
              }
              getIncludedRanges() {
                C._ts_tree_included_ranges_wasm(this[0]);
                const e = getValue(TRANSFER_BUFFER, "i32"), t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), _ = new Array(e);
                if (e > 0) {
                  let s = t;
                  for (let t2 = 0; t2 < e; t2++) _[t2] = unmarshalRange(s), s += SIZE_OF_RANGE;
                  C._free(t);
                }
                return _;
              }
            }
            class Node {
              constructor(e, t) {
                assertInternal(e), this.tree = t;
              }
              get typeId() {
                return marshalNode(this), C._ts_node_symbol_wasm(this.tree[0]);
              }
              get grammarId() {
                return marshalNode(this), C._ts_node_grammar_symbol_wasm(this.tree[0]);
              }
              get type() {
                return this.tree.language.types[this.typeId] || "ERROR";
              }
              get grammarType() {
                return this.tree.language.types[this.grammarId] || "ERROR";
              }
              get endPosition() {
                return marshalNode(this), C._ts_node_end_point_wasm(this.tree[0]), unmarshalPoint(TRANSFER_BUFFER);
              }
              get endIndex() {
                return marshalNode(this), C._ts_node_end_index_wasm(this.tree[0]);
              }
              get text() {
                return getText(this.tree, this.startIndex, this.endIndex);
              }
              get parseState() {
                return marshalNode(this), C._ts_node_parse_state_wasm(this.tree[0]);
              }
              get nextParseState() {
                return marshalNode(this), C._ts_node_next_parse_state_wasm(this.tree[0]);
              }
              get isNamed() {
                return marshalNode(this), 1 === C._ts_node_is_named_wasm(this.tree[0]);
              }
              get hasError() {
                return marshalNode(this), 1 === C._ts_node_has_error_wasm(this.tree[0]);
              }
              get hasChanges() {
                return marshalNode(this), 1 === C._ts_node_has_changes_wasm(this.tree[0]);
              }
              get isError() {
                return marshalNode(this), 1 === C._ts_node_is_error_wasm(this.tree[0]);
              }
              get isMissing() {
                return marshalNode(this), 1 === C._ts_node_is_missing_wasm(this.tree[0]);
              }
              get isExtra() {
                return marshalNode(this), 1 === C._ts_node_is_extra_wasm(this.tree[0]);
              }
              equals(e) {
                return this.id === e.id;
              }
              child(e) {
                return marshalNode(this), C._ts_node_child_wasm(this.tree[0], e), unmarshalNode(this.tree);
              }
              namedChild(e) {
                return marshalNode(this), C._ts_node_named_child_wasm(this.tree[0], e), unmarshalNode(this.tree);
              }
              childForFieldId(e) {
                return marshalNode(this), C._ts_node_child_by_field_id_wasm(this.tree[0], e), unmarshalNode(this.tree);
              }
              childForFieldName(e) {
                const t = this.tree.language.fields.indexOf(e);
                return -1 !== t ? this.childForFieldId(t) : null;
              }
              fieldNameForChild(e) {
                marshalNode(this);
                const t = C._ts_node_field_name_for_child_wasm(this.tree[0], e);
                if (!t) return null;
                return AsciiToString(t);
              }
              childrenForFieldName(e) {
                const t = this.tree.language.fields.indexOf(e);
                return -1 !== t && 0 !== t ? this.childrenForFieldId(t) : [];
              }
              childrenForFieldId(e) {
                marshalNode(this), C._ts_node_children_by_field_id_wasm(this.tree[0], e);
                const t = getValue(TRANSFER_BUFFER, "i32"), _ = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), s = new Array(t);
                if (t > 0) {
                  let e2 = _;
                  for (let _2 = 0; _2 < t; _2++) s[_2] = unmarshalNode(this.tree, e2), e2 += SIZE_OF_NODE;
                  C._free(_);
                }
                return s;
              }
              firstChildForIndex(e) {
                marshalNode(this);
                return setValue(TRANSFER_BUFFER + SIZE_OF_NODE, e, "i32"), C._ts_node_first_child_for_byte_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              firstNamedChildForIndex(e) {
                marshalNode(this);
                return setValue(TRANSFER_BUFFER + SIZE_OF_NODE, e, "i32"), C._ts_node_first_named_child_for_byte_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get childCount() {
                return marshalNode(this), C._ts_node_child_count_wasm(this.tree[0]);
              }
              get namedChildCount() {
                return marshalNode(this), C._ts_node_named_child_count_wasm(this.tree[0]);
              }
              get firstChild() {
                return this.child(0);
              }
              get firstNamedChild() {
                return this.namedChild(0);
              }
              get lastChild() {
                return this.child(this.childCount - 1);
              }
              get lastNamedChild() {
                return this.namedChild(this.namedChildCount - 1);
              }
              get children() {
                if (!this._children) {
                  marshalNode(this), C._ts_node_children_wasm(this.tree[0]);
                  const e = getValue(TRANSFER_BUFFER, "i32"), t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
                  if (this._children = new Array(e), e > 0) {
                    let _ = t;
                    for (let t2 = 0; t2 < e; t2++) this._children[t2] = unmarshalNode(this.tree, _), _ += SIZE_OF_NODE;
                    C._free(t);
                  }
                }
                return this._children;
              }
              get namedChildren() {
                if (!this._namedChildren) {
                  marshalNode(this), C._ts_node_named_children_wasm(this.tree[0]);
                  const e = getValue(TRANSFER_BUFFER, "i32"), t = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32");
                  if (this._namedChildren = new Array(e), e > 0) {
                    let _ = t;
                    for (let t2 = 0; t2 < e; t2++) this._namedChildren[t2] = unmarshalNode(this.tree, _), _ += SIZE_OF_NODE;
                    C._free(t);
                  }
                }
                return this._namedChildren;
              }
              descendantsOfType(e, t, _) {
                Array.isArray(e) || (e = [e]), t || (t = ZERO_POINT), _ || (_ = ZERO_POINT);
                const s = [], r = this.tree.language.types;
                for (let t2 = 0, _2 = r.length; t2 < _2; t2++) e.includes(r[t2]) && s.push(t2);
                const a = C._malloc(SIZE_OF_INT * s.length);
                for (let e2 = 0, t2 = s.length; e2 < t2; e2++) setValue(a + e2 * SIZE_OF_INT, s[e2], "i32");
                marshalNode(this), C._ts_node_descendants_of_type_wasm(this.tree[0], a, s.length, t.row, t.column, _.row, _.column);
                const o = getValue(TRANSFER_BUFFER, "i32"), n = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), l = new Array(o);
                if (o > 0) {
                  let e2 = n;
                  for (let t2 = 0; t2 < o; t2++) l[t2] = unmarshalNode(this.tree, e2), e2 += SIZE_OF_NODE;
                }
                return C._free(n), C._free(a), l;
              }
              get nextSibling() {
                return marshalNode(this), C._ts_node_next_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get previousSibling() {
                return marshalNode(this), C._ts_node_prev_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get nextNamedSibling() {
                return marshalNode(this), C._ts_node_next_named_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get previousNamedSibling() {
                return marshalNode(this), C._ts_node_prev_named_sibling_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get descendantCount() {
                return marshalNode(this), C._ts_node_descendant_count_wasm(this.tree[0]);
              }
              get parent() {
                return marshalNode(this), C._ts_node_parent_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              descendantForIndex(e, t = e) {
                if ("number" != typeof e || "number" != typeof t) throw new Error("Arguments must be numbers");
                marshalNode(this);
                const _ = TRANSFER_BUFFER + SIZE_OF_NODE;
                return setValue(_, e, "i32"), setValue(_ + SIZE_OF_INT, t, "i32"), C._ts_node_descendant_for_index_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              namedDescendantForIndex(e, t = e) {
                if ("number" != typeof e || "number" != typeof t) throw new Error("Arguments must be numbers");
                marshalNode(this);
                const _ = TRANSFER_BUFFER + SIZE_OF_NODE;
                return setValue(_, e, "i32"), setValue(_ + SIZE_OF_INT, t, "i32"), C._ts_node_named_descendant_for_index_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              descendantForPosition(e, t = e) {
                if (!isPoint(e) || !isPoint(t)) throw new Error("Arguments must be {row, column} objects");
                marshalNode(this);
                const _ = TRANSFER_BUFFER + SIZE_OF_NODE;
                return marshalPoint(_, e), marshalPoint(_ + SIZE_OF_POINT, t), C._ts_node_descendant_for_position_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              namedDescendantForPosition(e, t = e) {
                if (!isPoint(e) || !isPoint(t)) throw new Error("Arguments must be {row, column} objects");
                marshalNode(this);
                const _ = TRANSFER_BUFFER + SIZE_OF_NODE;
                return marshalPoint(_, e), marshalPoint(_ + SIZE_OF_POINT, t), C._ts_node_named_descendant_for_position_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              walk() {
                return marshalNode(this), C._ts_tree_cursor_new_wasm(this.tree[0]), new TreeCursor(INTERNAL, this.tree);
              }
              toString() {
                marshalNode(this);
                const e = C._ts_node_to_string_wasm(this.tree[0]), t = AsciiToString(e);
                return C._free(e), t;
              }
            }
            class TreeCursor {
              constructor(e, t) {
                assertInternal(e), this.tree = t, unmarshalTreeCursor(this);
              }
              delete() {
                marshalTreeCursor(this), C._ts_tree_cursor_delete_wasm(this.tree[0]), this[0] = this[1] = this[2] = 0;
              }
              reset(e) {
                marshalNode(e), marshalTreeCursor(this, TRANSFER_BUFFER + SIZE_OF_NODE), C._ts_tree_cursor_reset_wasm(this.tree[0]), unmarshalTreeCursor(this);
              }
              resetTo(e) {
                marshalTreeCursor(this, TRANSFER_BUFFER), marshalTreeCursor(e, TRANSFER_BUFFER + SIZE_OF_CURSOR), C._ts_tree_cursor_reset_to_wasm(this.tree[0], e.tree[0]), unmarshalTreeCursor(this);
              }
              get nodeType() {
                return this.tree.language.types[this.nodeTypeId] || "ERROR";
              }
              get nodeTypeId() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_node_type_id_wasm(this.tree[0]);
              }
              get nodeStateId() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_node_state_id_wasm(this.tree[0]);
              }
              get nodeId() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_node_id_wasm(this.tree[0]);
              }
              get nodeIsNamed() {
                return marshalTreeCursor(this), 1 === C._ts_tree_cursor_current_node_is_named_wasm(this.tree[0]);
              }
              get nodeIsMissing() {
                return marshalTreeCursor(this), 1 === C._ts_tree_cursor_current_node_is_missing_wasm(this.tree[0]);
              }
              get nodeText() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_start_index_wasm(this.tree[0]), t = C._ts_tree_cursor_end_index_wasm(this.tree[0]);
                return getText(this.tree, e, t);
              }
              get startPosition() {
                return marshalTreeCursor(this), C._ts_tree_cursor_start_position_wasm(this.tree[0]), unmarshalPoint(TRANSFER_BUFFER);
              }
              get endPosition() {
                return marshalTreeCursor(this), C._ts_tree_cursor_end_position_wasm(this.tree[0]), unmarshalPoint(TRANSFER_BUFFER);
              }
              get startIndex() {
                return marshalTreeCursor(this), C._ts_tree_cursor_start_index_wasm(this.tree[0]);
              }
              get endIndex() {
                return marshalTreeCursor(this), C._ts_tree_cursor_end_index_wasm(this.tree[0]);
              }
              get currentNode() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_node_wasm(this.tree[0]), unmarshalNode(this.tree);
              }
              get currentFieldId() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_field_id_wasm(this.tree[0]);
              }
              get currentFieldName() {
                return this.tree.language.fields[this.currentFieldId];
              }
              get currentDepth() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_depth_wasm(this.tree[0]);
              }
              get currentDescendantIndex() {
                return marshalTreeCursor(this), C._ts_tree_cursor_current_descendant_index_wasm(this.tree[0]);
              }
              gotoFirstChild() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_goto_first_child_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === e;
              }
              gotoLastChild() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_goto_last_child_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === e;
              }
              gotoFirstChildForIndex(e) {
                marshalTreeCursor(this), setValue(TRANSFER_BUFFER + SIZE_OF_CURSOR, e, "i32");
                const t = C._ts_tree_cursor_goto_first_child_for_index_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === t;
              }
              gotoFirstChildForPosition(e) {
                marshalTreeCursor(this), marshalPoint(TRANSFER_BUFFER + SIZE_OF_CURSOR, e);
                const t = C._ts_tree_cursor_goto_first_child_for_position_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === t;
              }
              gotoNextSibling() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_goto_next_sibling_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === e;
              }
              gotoPreviousSibling() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_goto_previous_sibling_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === e;
              }
              gotoDescendant(e) {
                marshalTreeCursor(this), C._ts_tree_cursor_goto_descendant_wasm(this.tree[0], e), unmarshalTreeCursor(this);
              }
              gotoParent() {
                marshalTreeCursor(this);
                const e = C._ts_tree_cursor_goto_parent_wasm(this.tree[0]);
                return unmarshalTreeCursor(this), 1 === e;
              }
            }
            class Language {
              constructor(e, t) {
                assertInternal(e), this[0] = t, this.types = new Array(C._ts_language_symbol_count(this[0]));
                for (let e2 = 0, t2 = this.types.length; e2 < t2; e2++) C._ts_language_symbol_type(this[0], e2) < 2 && (this.types[e2] = UTF8ToString(C._ts_language_symbol_name(this[0], e2)));
                this.fields = new Array(C._ts_language_field_count(this[0]) + 1);
                for (let e2 = 0, t2 = this.fields.length; e2 < t2; e2++) {
                  const t3 = C._ts_language_field_name_for_id(this[0], e2);
                  this.fields[e2] = 0 !== t3 ? UTF8ToString(t3) : null;
                }
              }
              get version() {
                return C._ts_language_version(this[0]);
              }
              get fieldCount() {
                return this.fields.length - 1;
              }
              get stateCount() {
                return C._ts_language_state_count(this[0]);
              }
              fieldIdForName(e) {
                const t = this.fields.indexOf(e);
                return -1 !== t ? t : null;
              }
              fieldNameForId(e) {
                return this.fields[e] || null;
              }
              idForNodeType(e, t) {
                const _ = lengthBytesUTF8(e), s = C._malloc(_ + 1);
                stringToUTF8(e, s, _ + 1);
                const r = C._ts_language_symbol_for_name(this[0], s, _, t);
                return C._free(s), r || null;
              }
              get nodeTypeCount() {
                return C._ts_language_symbol_count(this[0]);
              }
              nodeTypeForId(e) {
                const t = C._ts_language_symbol_name(this[0], e);
                return t ? UTF8ToString(t) : null;
              }
              nodeTypeIsNamed(e) {
                return !!C._ts_language_type_is_named_wasm(this[0], e);
              }
              nodeTypeIsVisible(e) {
                return !!C._ts_language_type_is_visible_wasm(this[0], e);
              }
              nextState(e, t) {
                return C._ts_language_next_state(this[0], e, t);
              }
              lookaheadIterator(e) {
                const t = C._ts_lookahead_iterator_new(this[0], e);
                return t ? new LookaheadIterable(INTERNAL, t, this) : null;
              }
              query(e) {
                const t = lengthBytesUTF8(e), _ = C._malloc(t + 1);
                stringToUTF8(e, _, t + 1);
                const s = C._ts_query_new(this[0], _, t, TRANSFER_BUFFER, TRANSFER_BUFFER + SIZE_OF_INT);
                if (!s) {
                  const t2 = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), s2 = getValue(TRANSFER_BUFFER, "i32"), r2 = UTF8ToString(_, s2).length, a2 = e.substr(r2, 100).split("\n")[0];
                  let o2, n2 = a2.match(QUERY_WORD_REGEX)[0];
                  switch (t2) {
                    case 2:
                      o2 = new RangeError(`Bad node name '${n2}'`);
                      break;
                    case 3:
                      o2 = new RangeError(`Bad field name '${n2}'`);
                      break;
                    case 4:
                      o2 = new RangeError(`Bad capture name @${n2}`);
                      break;
                    case 5:
                      o2 = new TypeError(`Bad pattern structure at offset ${r2}: '${a2}'...`), n2 = "";
                      break;
                    default:
                      o2 = new SyntaxError(`Bad syntax at offset ${r2}: '${a2}'...`), n2 = "";
                  }
                  throw o2.index = r2, o2.length = n2.length, C._free(_), o2;
                }
                const r = C._ts_query_string_count(s), a = C._ts_query_capture_count(s), o = C._ts_query_pattern_count(s), n = new Array(a), l = new Array(r);
                for (let e2 = 0; e2 < a; e2++) {
                  const t2 = C._ts_query_capture_name_for_id(s, e2, TRANSFER_BUFFER), _2 = getValue(TRANSFER_BUFFER, "i32");
                  n[e2] = UTF8ToString(t2, _2);
                }
                for (let e2 = 0; e2 < r; e2++) {
                  const t2 = C._ts_query_string_value_for_id(s, e2, TRANSFER_BUFFER), _2 = getValue(TRANSFER_BUFFER, "i32");
                  l[e2] = UTF8ToString(t2, _2);
                }
                const d = new Array(o), u = new Array(o), m = new Array(o), c = new Array(o), w = new Array(o);
                for (let e2 = 0; e2 < o; e2++) {
                  const t2 = C._ts_query_predicates_for_pattern(s, e2, TRANSFER_BUFFER), _2 = getValue(TRANSFER_BUFFER, "i32");
                  c[e2] = [], w[e2] = [];
                  const r2 = [];
                  let a2 = t2;
                  for (let t3 = 0; t3 < _2; t3++) {
                    const t4 = getValue(a2, "i32");
                    a2 += SIZE_OF_INT;
                    const _3 = getValue(a2, "i32");
                    if (a2 += SIZE_OF_INT, t4 === PREDICATE_STEP_TYPE_CAPTURE) r2.push({ type: "capture", name: n[_3] });
                    else if (t4 === PREDICATE_STEP_TYPE_STRING) r2.push({ type: "string", value: l[_3] });
                    else if (r2.length > 0) {
                      if ("string" !== r2[0].type) throw new Error("Predicates must begin with a literal value");
                      const t5 = r2[0].value;
                      let _4, s2 = true, a3 = true;
                      switch (t5) {
                        case "any-not-eq?":
                        case "not-eq?":
                          s2 = false;
                        case "any-eq?":
                        case "eq?":
                          if (3 !== r2.length) throw new Error(`Wrong number of arguments to \`#${t5}\` predicate. Expected 2, got ${r2.length - 1}`);
                          if ("capture" !== r2[1].type) throw new Error(`First argument of \`#${t5}\` predicate must be a capture. Got "${r2[1].value}"`);
                          if (a3 = !t5.startsWith("any-"), "capture" === r2[2].type) {
                            const t6 = r2[1].name, _5 = r2[2].name;
                            w[e2].push((e3) => {
                              const r3 = [], o3 = [];
                              for (const s3 of e3) s3.name === t6 && r3.push(s3.node), s3.name === _5 && o3.push(s3.node);
                              const n3 = (e4, t7, _6) => _6 ? e4.text === t7.text : e4.text !== t7.text;
                              return a3 ? r3.every((e4) => o3.some((t7) => n3(e4, t7, s2))) : r3.some((e4) => o3.some((t7) => n3(e4, t7, s2)));
                            });
                          } else {
                            _4 = r2[1].name;
                            const t6 = r2[2].value, o3 = (e3) => e3.text === t6, n3 = (e3) => e3.text !== t6;
                            w[e2].push((e3) => {
                              const t7 = [];
                              for (const s3 of e3) s3.name === _4 && t7.push(s3.node);
                              const r3 = s2 ? o3 : n3;
                              return a3 ? t7.every(r3) : t7.some(r3);
                            });
                          }
                          break;
                        case "any-not-match?":
                        case "not-match?":
                          s2 = false;
                        case "any-match?":
                        case "match?":
                          if (3 !== r2.length) throw new Error(`Wrong number of arguments to \`#${t5}\` predicate. Expected 2, got ${r2.length - 1}.`);
                          if ("capture" !== r2[1].type) throw new Error(`First argument of \`#${t5}\` predicate must be a capture. Got "${r2[1].value}".`);
                          if ("string" !== r2[2].type) throw new Error(`Second argument of \`#${t5}\` predicate must be a string. Got @${r2[2].value}.`);
                          _4 = r2[1].name;
                          const o2 = new RegExp(r2[2].value);
                          a3 = !t5.startsWith("any-"), w[e2].push((e3) => {
                            const t6 = [];
                            for (const s3 of e3) s3.name === _4 && t6.push(s3.node.text);
                            const r3 = (e4, t7) => t7 ? o2.test(e4) : !o2.test(e4);
                            return 0 === t6.length ? !s2 : a3 ? t6.every((e4) => r3(e4, s2)) : t6.some((e4) => r3(e4, s2));
                          });
                          break;
                        case "set!":
                          if (r2.length < 2 || r2.length > 3) throw new Error(`Wrong number of arguments to \`#set!\` predicate. Expected 1 or 2. Got ${r2.length - 1}.`);
                          if (r2.some((e3) => "string" !== e3.type)) throw new Error('Arguments to `#set!` predicate must be a strings.".');
                          d[e2] || (d[e2] = {}), d[e2][r2[1].value] = r2[2] ? r2[2].value : null;
                          break;
                        case "is?":
                        case "is-not?":
                          if (r2.length < 2 || r2.length > 3) throw new Error(`Wrong number of arguments to \`#${t5}\` predicate. Expected 1 or 2. Got ${r2.length - 1}.`);
                          if (r2.some((e3) => "string" !== e3.type)) throw new Error(`Arguments to \`#${t5}\` predicate must be a strings.".`);
                          const n2 = "is?" === t5 ? u : m;
                          n2[e2] || (n2[e2] = {}), n2[e2][r2[1].value] = r2[2] ? r2[2].value : null;
                          break;
                        case "not-any-of?":
                          s2 = false;
                        case "any-of?":
                          if (r2.length < 2) throw new Error(`Wrong number of arguments to \`#${t5}\` predicate. Expected at least 1. Got ${r2.length - 1}.`);
                          if ("capture" !== r2[1].type) throw new Error(`First argument of \`#${t5}\` predicate must be a capture. Got "${r2[1].value}".`);
                          for (let e3 = 2; e3 < r2.length; e3++) if ("string" !== r2[e3].type) throw new Error(`Arguments to \`#${t5}\` predicate must be a strings.".`);
                          _4 = r2[1].name;
                          const l2 = r2.slice(2).map((e3) => e3.value);
                          w[e2].push((e3) => {
                            const t6 = [];
                            for (const s3 of e3) s3.name === _4 && t6.push(s3.node.text);
                            return 0 === t6.length ? !s2 : t6.every((e4) => l2.includes(e4)) === s2;
                          });
                          break;
                        default:
                          c[e2].push({ operator: t5, operands: r2.slice(1) });
                      }
                      r2.length = 0;
                    }
                  }
                  Object.freeze(d[e2]), Object.freeze(u[e2]), Object.freeze(m[e2]);
                }
                return C._free(_), new Query(INTERNAL, s, n, w, c, Object.freeze(d), Object.freeze(u), Object.freeze(m));
              }
              static load(e) {
                let t;
                if (e instanceof Uint8Array) t = Promise.resolve(e);
                else {
                  const _ = e;
                  if ("undefined" != typeof process && process.versions && process.versions.node) {
                    const e2 = require("fs");
                    t = Promise.resolve(e2.readFileSync(_));
                  } else t = fetch(_).then((e2) => e2.arrayBuffer().then((t2) => {
                    if (e2.ok) return new Uint8Array(t2);
                    {
                      const _2 = new TextDecoder("utf-8").decode(t2);
                      throw new Error(`Language.load failed with status ${e2.status}.

${_2}`);
                    }
                  }));
                }
                return t.then((e2) => loadWebAssemblyModule(e2, { loadAsync: true })).then((e2) => {
                  const t2 = Object.keys(e2), _ = t2.find((e3) => LANGUAGE_FUNCTION_REGEX.test(e3) && !e3.includes("external_scanner_"));
                  _ || console.log(`Couldn't find language function in WASM file. Symbols:
${JSON.stringify(t2, null, 2)}`);
                  const s = e2[_]();
                  return new Language(INTERNAL, s);
                });
              }
            }
            class LookaheadIterable {
              constructor(e, t, _) {
                assertInternal(e), this[0] = t, this.language = _;
              }
              get currentTypeId() {
                return C._ts_lookahead_iterator_current_symbol(this[0]);
              }
              get currentType() {
                return this.language.types[this.currentTypeId] || "ERROR";
              }
              delete() {
                C._ts_lookahead_iterator_delete(this[0]), this[0] = 0;
              }
              resetState(e) {
                return C._ts_lookahead_iterator_reset_state(this[0], e);
              }
              reset(e, t) {
                return !!C._ts_lookahead_iterator_reset(this[0], e[0], t) && (this.language = e, true);
              }
              [Symbol.iterator]() {
                const e = this;
                return { next: () => C._ts_lookahead_iterator_next(e[0]) ? { done: false, value: e.currentType } : { done: true, value: "" } };
              }
            }
            class Query {
              constructor(e, t, _, s, r, a, o, n) {
                assertInternal(e), this[0] = t, this.captureNames = _, this.textPredicates = s, this.predicates = r, this.setProperties = a, this.assertedProperties = o, this.refutedProperties = n, this.exceededMatchLimit = false;
              }
              delete() {
                C._ts_query_delete(this[0]), this[0] = 0;
              }
              matches(e, { startPosition: t = ZERO_POINT, endPosition: _ = ZERO_POINT, startIndex: s = 0, endIndex: r = 0, matchLimit: a = 4294967295, maxStartDepth: o = 4294967295 } = {}) {
                if ("number" != typeof a) throw new Error("Arguments must be numbers");
                marshalNode(e), C._ts_query_matches_wasm(this[0], e.tree[0], t.row, t.column, _.row, _.column, s, r, a, o);
                const n = getValue(TRANSFER_BUFFER, "i32"), l = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), d = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32"), u = new Array(n);
                this.exceededMatchLimit = Boolean(d);
                let m = 0, c = l;
                for (let t2 = 0; t2 < n; t2++) {
                  const t3 = getValue(c, "i32");
                  c += SIZE_OF_INT;
                  const _2 = getValue(c, "i32");
                  c += SIZE_OF_INT;
                  const s2 = new Array(_2);
                  if (c = unmarshalCaptures(this, e.tree, c, s2), this.textPredicates[t3].every((e2) => e2(s2))) {
                    u[m] = { pattern: t3, captures: s2 };
                    const e2 = this.setProperties[t3];
                    e2 && (u[m].setProperties = e2);
                    const _3 = this.assertedProperties[t3];
                    _3 && (u[m].assertedProperties = _3);
                    const r2 = this.refutedProperties[t3];
                    r2 && (u[m].refutedProperties = r2), m++;
                  }
                }
                return u.length = m, C._free(l), u;
              }
              captures(e, { startPosition: t = ZERO_POINT, endPosition: _ = ZERO_POINT, startIndex: s = 0, endIndex: r = 0, matchLimit: a = 4294967295, maxStartDepth: o = 4294967295 } = {}) {
                if ("number" != typeof a) throw new Error("Arguments must be numbers");
                marshalNode(e), C._ts_query_captures_wasm(this[0], e.tree[0], t.row, t.column, _.row, _.column, s, r, a, o);
                const n = getValue(TRANSFER_BUFFER, "i32"), l = getValue(TRANSFER_BUFFER + SIZE_OF_INT, "i32"), d = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32"), u = [];
                this.exceededMatchLimit = Boolean(d);
                const m = [];
                let c = l;
                for (let t2 = 0; t2 < n; t2++) {
                  const t3 = getValue(c, "i32");
                  c += SIZE_OF_INT;
                  const _2 = getValue(c, "i32");
                  c += SIZE_OF_INT;
                  const s2 = getValue(c, "i32");
                  if (c += SIZE_OF_INT, m.length = _2, c = unmarshalCaptures(this, e.tree, c, m), this.textPredicates[t3].every((e2) => e2(m))) {
                    const e2 = m[s2], _3 = this.setProperties[t3];
                    _3 && (e2.setProperties = _3);
                    const r2 = this.assertedProperties[t3];
                    r2 && (e2.assertedProperties = r2);
                    const a2 = this.refutedProperties[t3];
                    a2 && (e2.refutedProperties = a2), u.push(e2);
                  }
                }
                return C._free(l), u;
              }
              predicatesForPattern(e) {
                return this.predicates[e];
              }
              disableCapture(e) {
                const t = lengthBytesUTF8(e), _ = C._malloc(t + 1);
                stringToUTF8(e, _, t + 1), C._ts_query_disable_capture(this[0], _, t), C._free(_);
              }
              didExceedMatchLimit() {
                return this.exceededMatchLimit;
              }
            }
            function getText(e, t, _) {
              const s = _ - t;
              let r = e.textCallback(t, null, _);
              for (t += r.length; t < _; ) {
                const s2 = e.textCallback(t, null, _);
                if (!(s2 && s2.length > 0)) break;
                t += s2.length, r += s2;
              }
              return t > _ && (r = r.slice(0, s)), r;
            }
            function unmarshalCaptures(e, t, _, s) {
              for (let r = 0, a = s.length; r < a; r++) {
                const a2 = getValue(_, "i32"), o = unmarshalNode(t, _ += SIZE_OF_INT);
                _ += SIZE_OF_NODE, s[r] = { name: e.captureNames[a2], node: o };
              }
              return _;
            }
            function assertInternal(e) {
              if (e !== INTERNAL) throw new Error("Illegal constructor");
            }
            function isPoint(e) {
              return e && "number" == typeof e.row && "number" == typeof e.column;
            }
            function marshalNode(e) {
              let t = TRANSFER_BUFFER;
              setValue(t, e.id, "i32"), t += SIZE_OF_INT, setValue(t, e.startIndex, "i32"), t += SIZE_OF_INT, setValue(t, e.startPosition.row, "i32"), t += SIZE_OF_INT, setValue(t, e.startPosition.column, "i32"), t += SIZE_OF_INT, setValue(t, e[0], "i32");
            }
            function unmarshalNode(e, t = TRANSFER_BUFFER) {
              const _ = getValue(t, "i32");
              if (0 === _) return null;
              const s = getValue(t += SIZE_OF_INT, "i32"), r = getValue(t += SIZE_OF_INT, "i32"), a = getValue(t += SIZE_OF_INT, "i32"), o = getValue(t += SIZE_OF_INT, "i32"), n = new Node(INTERNAL, e);
              return n.id = _, n.startIndex = s, n.startPosition = { row: r, column: a }, n[0] = o, n;
            }
            function marshalTreeCursor(e, t = TRANSFER_BUFFER) {
              setValue(t + 0 * SIZE_OF_INT, e[0], "i32"), setValue(t + 1 * SIZE_OF_INT, e[1], "i32"), setValue(t + 2 * SIZE_OF_INT, e[2], "i32"), setValue(t + 3 * SIZE_OF_INT, e[3], "i32");
            }
            function unmarshalTreeCursor(e) {
              e[0] = getValue(TRANSFER_BUFFER + 0 * SIZE_OF_INT, "i32"), e[1] = getValue(TRANSFER_BUFFER + 1 * SIZE_OF_INT, "i32"), e[2] = getValue(TRANSFER_BUFFER + 2 * SIZE_OF_INT, "i32"), e[3] = getValue(TRANSFER_BUFFER + 3 * SIZE_OF_INT, "i32");
            }
            function marshalPoint(e, t) {
              setValue(e, t.row, "i32"), setValue(e + SIZE_OF_INT, t.column, "i32");
            }
            function unmarshalPoint(e) {
              return { row: getValue(e, "i32") >>> 0, column: getValue(e + SIZE_OF_INT, "i32") >>> 0 };
            }
            function marshalRange(e, t) {
              marshalPoint(e, t.startPosition), marshalPoint(e += SIZE_OF_POINT, t.endPosition), setValue(e += SIZE_OF_POINT, t.startIndex, "i32"), setValue(e += SIZE_OF_INT, t.endIndex, "i32"), e += SIZE_OF_INT;
            }
            function unmarshalRange(e) {
              const t = {};
              return t.startPosition = unmarshalPoint(e), e += SIZE_OF_POINT, t.endPosition = unmarshalPoint(e), e += SIZE_OF_POINT, t.startIndex = getValue(e, "i32") >>> 0, e += SIZE_OF_INT, t.endIndex = getValue(e, "i32") >>> 0, t;
            }
            function marshalEdit(e) {
              let t = TRANSFER_BUFFER;
              marshalPoint(t, e.startPosition), t += SIZE_OF_POINT, marshalPoint(t, e.oldEndPosition), t += SIZE_OF_POINT, marshalPoint(t, e.newEndPosition), t += SIZE_OF_POINT, setValue(t, e.startIndex, "i32"), t += SIZE_OF_INT, setValue(t, e.oldEndIndex, "i32"), t += SIZE_OF_INT, setValue(t, e.newEndIndex, "i32"), t += SIZE_OF_INT;
            }
            for (const e of Object.getOwnPropertyNames(ParserImpl.prototype)) Object.defineProperty(Parser.prototype, e, { value: ParserImpl.prototype[e], enumerable: false, writable: false });
            Parser.Language = Language, Module.onRuntimeInitialized = () => {
              ParserImpl.init(), resolveInitPromise();
            };
          }));
        }
      }
      return Parser;
    }();
    "object" == typeof exports && (module.exports = TreeSitter);
  }
});

// server/src/server.ts
var import_vscode_languageserver_textdocument = require("vscode-languageserver-textdocument");
var import_node = require("vscode-languageserver/node");

// server/src/features/syntax_errors.ts
var import_vscode_languageserver2 = require("vscode-languageserver");

// server/src/features/checks/utils.ts
var import_vscode_languageserver = require("vscode-languageserver");
var Parser2 = require_tree_sitter();
function build_error_display(node, document2, message) {
  const start2 = document2.positionAt(node.startIndex);
  const end = document2.positionAt(node.endIndex > node.startIndex ? node.endIndex : node.startIndex + 1);
  return {
    range: import_vscode_languageserver.Range.create(start2, end),
    message,
    severity: import_vscode_languageserver.DiagnosticSeverity.Error,
    source: "tamarin"
  };
}
function build_warning_display(node, document2, message) {
  const start2 = document2.positionAt(node.startIndex);
  const end = document2.positionAt(node.endIndex > node.startIndex ? node.endIndex : node.startIndex + 1);
  return {
    range: import_vscode_languageserver.Range.create(start2, end),
    message,
    severity: import_vscode_languageserver.DiagnosticSeverity.Warning,
    source: "tamarin"
  };
}
function getName(node, document2) {
  if (node && node.isNamed) {
    return document2.getText(import_vscode_languageserver.Range.create(
      document2.positionAt(node.startIndex),
      document2.positionAt(node.endIndex)
    ));
  } else {
    return "None";
  }
}
function levenshteinDistance(s1, s2) {
  const matrix = [];
  for (let i2 = 0; i2 <= s2.length; i2++) {
    matrix[i2] = [i2];
  }
  for (let j = 0; j <= s1.length; j++) {
    matrix[0][j] = j;
  }
  for (let i2 = 1; i2 <= s2.length; i2++) {
    for (let j = 1; j <= s1.length; j++) {
      if (s2.charAt(i2 - 1) === s1.charAt(j - 1)) {
        matrix[i2][j] = matrix[i2 - 1][j - 1];
      } else {
        matrix[i2][j] = Math.min(
          matrix[i2 - 1][j - 1] + 1,
          // substitution
          Math.min(
            matrix[i2][j - 1] + 1,
            // insertion
            matrix[i2 - 1][j] + 1
            // deletion
          )
        );
      }
    }
  }
  return matrix[s2.length][s1.length];
}
function get_child_grammar_type(node) {
  let results = [];
  for (let child of node.children) {
    results.push(child.grammarType);
  }
  return results;
}

// server/src/features/syntax_errors.ts
var Parser3 = require_tree_sitter();
function get_child_index(node) {
  if (node.parent === null) {
    return null;
  }
  const children = node.parent.children;
  for (let i2 = 0; i2 < children.length; i2++) {
    if (children[i2].id === node.id) {
      return i2 >= 0 ? i2 : null;
    }
  }
  return 0;
}
async function detect_errors(tree, document2) {
  let diags = [];
  function typesOfError(node) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o, _p, _q, _r, _s, _t, _u;
    if (node.grammarType === "theory" || ((_b = (_a = node.nextSibling) == null ? void 0 : _a.nextSibling) == null ? void 0 : _b.grammarType) === "begin" || ((_c = node.nextSibling) == null ? void 0 : _c.grammarType) === "begin") {
      diags.push(build_error_display(node, document2, "MISSING 'theory' or 'begin'"));
    } else if (((_d = node.firstChild) == null ? void 0 : _d.grammarType) === "builtins" || ((_e = node.firstChild) == null ? void 0 : _e.grammarType) === "functions" || ((_f = node.firstChild) == null ? void 0 : _f.grammarType) === "macros") {
      diags.push(build_error_display(node, document2, "MISSING ':' "));
    } else if (((_g = node.nextSibling) == null ? void 0 : _g.grammarType) === "built_in") {
      diags.push(build_error_display(node, document2, "MISSING ',' "));
    } else if (((_h = node.firstChild) == null ? void 0 : _h.grammarType) === "rule" && (((_i = node.firstChild.nextSibling) == null ? void 0 : _i.grammarType) != "ident" || ((_k = (_j = node.firstChild.nextSibling) == null ? void 0 : _j.nextSibling) == null ? void 0 : _k.grammarType) != ":")) {
      diags.push(build_error_display(node, document2, "MISSING ':' or rule name "));
    } else if (((_l = node.firstChild) == null ? void 0 : _l.grammarType) === "lemma") {
      diags.push(build_error_display(node, document2, "MISSING ':' or lemma name "));
    } else if (((_m = node.firstChild) == null ? void 0 : _m.grammarType) === "premise" || ((_n = node.firstChild) == null ? void 0 : _n.grammarType) === "rule" && (((_o = node.firstChild.nextSibling) == null ? void 0 : _o.grammarType) === "ident" || ((_q = (_p = node.firstChild.nextSibling) == null ? void 0 : _p.nextSibling) == null ? void 0 : _q.grammarType) === ":")) {
      diags.push(build_error_display(node, document2, "ERROR in rule structure the syntax for a rule is either \n []-->[] \n or \n []--[]->[]"));
    } else if (((_r = node.firstChild) == null ? void 0 : _r.grammarType) === "pre_defined") {
      diags.push(build_error_display(node, document2, "MISSING generalized quantifier"));
    } else if (((_s = node.firstChild) == null ? void 0 : _s.grammarType) === "nested_formula" || ((_t = node.firstChild) == null ? void 0 : _t.grammarType) === "action_constraint" || ((_u = node.firstChild) == null ? void 0 : _u.grammarType) === "conjunction") {
      diags.push(build_error_display(node, document2, "EXPECTING '&', '\u2227', '|', '\u2228', '==>'"));
    } else {
      diags.push(build_error_display(node, document2, node.toString().slice(1, -1)));
    }
  }
  function rangeContains(range, pos) {
    if (pos.line < range.start.line || pos.line > range.end.line) return false;
    if (pos.line === range.start.line && pos.character < range.start.character) return false;
    if (pos.line === range.end.line && pos.character > range.end.character) return false;
    return true;
  }
  function findMatches(node) {
    var _a, _b, _c;
    if (node.isMissing) {
      let myId = get_child_index(node);
      if (myId === null) {
        return;
      }
      if (((_b = (_a = node.parent) == null ? void 0 : _a.child(myId - 1)) == null ? void 0 : _b.type) === "single_comment") {
        let start2;
        if (node.parent.child(myId - 2) != null) {
          start2 = (_c = node.parent.child(myId - 2)) == null ? void 0 : _c.endIndex;
        } else {
          start2 = 0;
        }
        let positionStart = document2.positionAt(start2 ?? 0);
        const range = import_vscode_languageserver2.Range.create(positionStart, import_vscode_languageserver2.Position.create(positionStart.line, positionStart.character + 1));
        const existingDiag = diags.find((d) => rangeContains(d.range, positionStart));
        if (!existingDiag) {
          diags.push({
            range,
            message: node.toString().slice(1, -1),
            severity: import_vscode_languageserver2.DiagnosticSeverity.Error,
            source: "tamarin"
          });
        }
      } else {
        diags.push(build_error_display(node, document2, node.toString().slice(1, -1)));
      }
    } else if (node.isError) {
      if (node.firstChild && node.firstChild.grammarType === "multi_comment") {
        const childNode = node.child(1);
        if (childNode) {
          typesOfError(childNode);
        }
      } else {
        typesOfError(node);
      }
      return;
    } else if (node.grammarType === "end") {
      const endPosition = document2.positionAt(node.endIndex);
      const endOfDocumentPosition = document2.positionAt(document2.getText().length);
      const unreachableRange = import_vscode_languageserver2.Range.create(endPosition, endOfDocumentPosition);
      let hasContentAfterEnd = false;
      const text = document2.getText();
      let inMultiLineComment = false;
      for (let lineNum = endPosition.line + 1; lineNum <= endOfDocumentPosition.line; lineNum++) {
        const line = text.split("\n")[lineNum];
        if (!inMultiLineComment) {
          if (line.trim().startsWith("/*")) {
            inMultiLineComment = true;
          } else if (line.trim() !== "" && !line.trim().startsWith("//")) {
            hasContentAfterEnd = true;
            break;
          }
        } else {
          if (line.trim().endsWith("*/")) {
            inMultiLineComment = false;
          }
        }
      }
      if (hasContentAfterEnd) {
        const message = "Code unreachable";
        const severity = import_vscode_languageserver2.DiagnosticSeverity.Warning;
        diags.push({
          range: unreachableRange,
          message,
          severity,
          source: "tamarin"
        });
      }
    }
    for (let child of node.children) {
      findMatches(child);
    }
  }
  findMatches(tree);
  return { diagnostics: diags };
}

// server/node_modules/vscode-languageserver-types/lib/esm/main.js
var DocumentUri;
(function(DocumentUri2) {
  function is(value) {
    return typeof value === "string";
  }
  DocumentUri2.is = is;
})(DocumentUri || (DocumentUri = {}));
var URI;
(function(URI2) {
  function is(value) {
    return typeof value === "string";
  }
  URI2.is = is;
})(URI || (URI = {}));
var integer;
(function(integer2) {
  integer2.MIN_VALUE = -2147483648;
  integer2.MAX_VALUE = 2147483647;
  function is(value) {
    return typeof value === "number" && integer2.MIN_VALUE <= value && value <= integer2.MAX_VALUE;
  }
  integer2.is = is;
})(integer || (integer = {}));
var uinteger;
(function(uinteger2) {
  uinteger2.MIN_VALUE = 0;
  uinteger2.MAX_VALUE = 2147483647;
  function is(value) {
    return typeof value === "number" && uinteger2.MIN_VALUE <= value && value <= uinteger2.MAX_VALUE;
  }
  uinteger2.is = is;
})(uinteger || (uinteger = {}));
var Position2;
(function(Position4) {
  function create(line, character) {
    if (line === Number.MAX_VALUE) {
      line = uinteger.MAX_VALUE;
    }
    if (character === Number.MAX_VALUE) {
      character = uinteger.MAX_VALUE;
    }
    return { line, character };
  }
  Position4.create = create;
  function is(value) {
    let candidate = value;
    return Is.objectLiteral(candidate) && Is.uinteger(candidate.line) && Is.uinteger(candidate.character);
  }
  Position4.is = is;
})(Position2 || (Position2 = {}));
var Range3;
(function(Range6) {
  function create(one, two, three, four) {
    if (Is.uinteger(one) && Is.uinteger(two) && Is.uinteger(three) && Is.uinteger(four)) {
      return { start: Position2.create(one, two), end: Position2.create(three, four) };
    } else if (Position2.is(one) && Position2.is(two)) {
      return { start: one, end: two };
    } else {
      throw new Error(`Range#create called with invalid arguments[${one}, ${two}, ${three}, ${four}]`);
    }
  }
  Range6.create = create;
  function is(value) {
    let candidate = value;
    return Is.objectLiteral(candidate) && Position2.is(candidate.start) && Position2.is(candidate.end);
  }
  Range6.is = is;
})(Range3 || (Range3 = {}));
var Location;
(function(Location3) {
  function create(uri, range) {
    return { uri, range };
  }
  Location3.create = create;
  function is(value) {
    let candidate = value;
    return Is.objectLiteral(candidate) && Range3.is(candidate.range) && (Is.string(candidate.uri) || Is.undefined(candidate.uri));
  }
  Location3.is = is;
})(Location || (Location = {}));
var LocationLink;
(function(LocationLink2) {
  function create(targetUri, targetRange, targetSelectionRange, originSelectionRange) {
    return { targetUri, targetRange, targetSelectionRange, originSelectionRange };
  }
  LocationLink2.create = create;
  function is(value) {
    let candidate = value;
    return Is.objectLiteral(candidate) && Range3.is(candidate.targetRange) && Is.string(candidate.targetUri) && Range3.is(candidate.targetSelectionRange) && (Range3.is(candidate.originSelectionRange) || Is.undefined(candidate.originSelectionRange));
  }
  LocationLink2.is = is;
})(LocationLink || (LocationLink = {}));
var Color;
(function(Color2) {
  function create(red, green, blue, alpha) {
    return {
      red,
      green,
      blue,
      alpha
    };
  }
  Color2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.numberRange(candidate.red, 0, 1) && Is.numberRange(candidate.green, 0, 1) && Is.numberRange(candidate.blue, 0, 1) && Is.numberRange(candidate.alpha, 0, 1);
  }
  Color2.is = is;
})(Color || (Color = {}));
var ColorInformation;
(function(ColorInformation2) {
  function create(range, color) {
    return {
      range,
      color
    };
  }
  ColorInformation2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Range3.is(candidate.range) && Color.is(candidate.color);
  }
  ColorInformation2.is = is;
})(ColorInformation || (ColorInformation = {}));
var ColorPresentation;
(function(ColorPresentation2) {
  function create(label, textEdit, additionalTextEdits) {
    return {
      label,
      textEdit,
      additionalTextEdits
    };
  }
  ColorPresentation2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.undefined(candidate.textEdit) || TextEdit.is(candidate)) && (Is.undefined(candidate.additionalTextEdits) || Is.typedArray(candidate.additionalTextEdits, TextEdit.is));
  }
  ColorPresentation2.is = is;
})(ColorPresentation || (ColorPresentation = {}));
var FoldingRangeKind;
(function(FoldingRangeKind2) {
  FoldingRangeKind2.Comment = "comment";
  FoldingRangeKind2.Imports = "imports";
  FoldingRangeKind2.Region = "region";
})(FoldingRangeKind || (FoldingRangeKind = {}));
var FoldingRange;
(function(FoldingRange2) {
  function create(startLine, endLine, startCharacter, endCharacter, kind, collapsedText) {
    const result = {
      startLine,
      endLine
    };
    if (Is.defined(startCharacter)) {
      result.startCharacter = startCharacter;
    }
    if (Is.defined(endCharacter)) {
      result.endCharacter = endCharacter;
    }
    if (Is.defined(kind)) {
      result.kind = kind;
    }
    if (Is.defined(collapsedText)) {
      result.collapsedText = collapsedText;
    }
    return result;
  }
  FoldingRange2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.uinteger(candidate.startLine) && Is.uinteger(candidate.startLine) && (Is.undefined(candidate.startCharacter) || Is.uinteger(candidate.startCharacter)) && (Is.undefined(candidate.endCharacter) || Is.uinteger(candidate.endCharacter)) && (Is.undefined(candidate.kind) || Is.string(candidate.kind));
  }
  FoldingRange2.is = is;
})(FoldingRange || (FoldingRange = {}));
var DiagnosticRelatedInformation;
(function(DiagnosticRelatedInformation2) {
  function create(location, message) {
    return {
      location,
      message
    };
  }
  DiagnosticRelatedInformation2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Location.is(candidate.location) && Is.string(candidate.message);
  }
  DiagnosticRelatedInformation2.is = is;
})(DiagnosticRelatedInformation || (DiagnosticRelatedInformation = {}));
var DiagnosticSeverity3;
(function(DiagnosticSeverity7) {
  DiagnosticSeverity7.Error = 1;
  DiagnosticSeverity7.Warning = 2;
  DiagnosticSeverity7.Information = 3;
  DiagnosticSeverity7.Hint = 4;
})(DiagnosticSeverity3 || (DiagnosticSeverity3 = {}));
var DiagnosticTag;
(function(DiagnosticTag2) {
  DiagnosticTag2.Unnecessary = 1;
  DiagnosticTag2.Deprecated = 2;
})(DiagnosticTag || (DiagnosticTag = {}));
var CodeDescription;
(function(CodeDescription2) {
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.string(candidate.href);
  }
  CodeDescription2.is = is;
})(CodeDescription || (CodeDescription = {}));
var Diagnostic3;
(function(Diagnostic8) {
  function create(range, message, severity, code, source, relatedInformation) {
    let result = { range, message };
    if (Is.defined(severity)) {
      result.severity = severity;
    }
    if (Is.defined(code)) {
      result.code = code;
    }
    if (Is.defined(source)) {
      result.source = source;
    }
    if (Is.defined(relatedInformation)) {
      result.relatedInformation = relatedInformation;
    }
    return result;
  }
  Diagnostic8.create = create;
  function is(value) {
    var _a;
    let candidate = value;
    return Is.defined(candidate) && Range3.is(candidate.range) && Is.string(candidate.message) && (Is.number(candidate.severity) || Is.undefined(candidate.severity)) && (Is.integer(candidate.code) || Is.string(candidate.code) || Is.undefined(candidate.code)) && (Is.undefined(candidate.codeDescription) || Is.string((_a = candidate.codeDescription) === null || _a === void 0 ? void 0 : _a.href)) && (Is.string(candidate.source) || Is.undefined(candidate.source)) && (Is.undefined(candidate.relatedInformation) || Is.typedArray(candidate.relatedInformation, DiagnosticRelatedInformation.is));
  }
  Diagnostic8.is = is;
})(Diagnostic3 || (Diagnostic3 = {}));
var Command;
(function(Command2) {
  function create(title, command, ...args2) {
    let result = { title, command };
    if (Is.defined(args2) && args2.length > 0) {
      result.arguments = args2;
    }
    return result;
  }
  Command2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.title) && Is.string(candidate.command);
  }
  Command2.is = is;
})(Command || (Command = {}));
var TextEdit;
(function(TextEdit2) {
  function replace(range, newText) {
    return { range, newText };
  }
  TextEdit2.replace = replace;
  function insert(position, newText) {
    return { range: { start: position, end: position }, newText };
  }
  TextEdit2.insert = insert;
  function del(range) {
    return { range, newText: "" };
  }
  TextEdit2.del = del;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.string(candidate.newText) && Range3.is(candidate.range);
  }
  TextEdit2.is = is;
})(TextEdit || (TextEdit = {}));
var ChangeAnnotation;
(function(ChangeAnnotation2) {
  function create(label, needsConfirmation, description) {
    const result = { label };
    if (needsConfirmation !== void 0) {
      result.needsConfirmation = needsConfirmation;
    }
    if (description !== void 0) {
      result.description = description;
    }
    return result;
  }
  ChangeAnnotation2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Is.string(candidate.label) && (Is.boolean(candidate.needsConfirmation) || candidate.needsConfirmation === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
  }
  ChangeAnnotation2.is = is;
})(ChangeAnnotation || (ChangeAnnotation = {}));
var ChangeAnnotationIdentifier;
(function(ChangeAnnotationIdentifier2) {
  function is(value) {
    const candidate = value;
    return Is.string(candidate);
  }
  ChangeAnnotationIdentifier2.is = is;
})(ChangeAnnotationIdentifier || (ChangeAnnotationIdentifier = {}));
var AnnotatedTextEdit;
(function(AnnotatedTextEdit2) {
  function replace(range, newText, annotation) {
    return { range, newText, annotationId: annotation };
  }
  AnnotatedTextEdit2.replace = replace;
  function insert(position, newText, annotation) {
    return { range: { start: position, end: position }, newText, annotationId: annotation };
  }
  AnnotatedTextEdit2.insert = insert;
  function del(range, annotation) {
    return { range, newText: "", annotationId: annotation };
  }
  AnnotatedTextEdit2.del = del;
  function is(value) {
    const candidate = value;
    return TextEdit.is(candidate) && (ChangeAnnotation.is(candidate.annotationId) || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  AnnotatedTextEdit2.is = is;
})(AnnotatedTextEdit || (AnnotatedTextEdit = {}));
var TextDocumentEdit;
(function(TextDocumentEdit2) {
  function create(textDocument, edits) {
    return { textDocument, edits };
  }
  TextDocumentEdit2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && OptionalVersionedTextDocumentIdentifier.is(candidate.textDocument) && Array.isArray(candidate.edits);
  }
  TextDocumentEdit2.is = is;
})(TextDocumentEdit || (TextDocumentEdit = {}));
var CreateFile;
(function(CreateFile2) {
  function create(uri, options, annotation) {
    let result = {
      kind: "create",
      uri
    };
    if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
      result.options = options;
    }
    if (annotation !== void 0) {
      result.annotationId = annotation;
    }
    return result;
  }
  CreateFile2.create = create;
  function is(value) {
    let candidate = value;
    return candidate && candidate.kind === "create" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  CreateFile2.is = is;
})(CreateFile || (CreateFile = {}));
var RenameFile;
(function(RenameFile2) {
  function create(oldUri, newUri, options, annotation) {
    let result = {
      kind: "rename",
      oldUri,
      newUri
    };
    if (options !== void 0 && (options.overwrite !== void 0 || options.ignoreIfExists !== void 0)) {
      result.options = options;
    }
    if (annotation !== void 0) {
      result.annotationId = annotation;
    }
    return result;
  }
  RenameFile2.create = create;
  function is(value) {
    let candidate = value;
    return candidate && candidate.kind === "rename" && Is.string(candidate.oldUri) && Is.string(candidate.newUri) && (candidate.options === void 0 || (candidate.options.overwrite === void 0 || Is.boolean(candidate.options.overwrite)) && (candidate.options.ignoreIfExists === void 0 || Is.boolean(candidate.options.ignoreIfExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  RenameFile2.is = is;
})(RenameFile || (RenameFile = {}));
var DeleteFile;
(function(DeleteFile2) {
  function create(uri, options, annotation) {
    let result = {
      kind: "delete",
      uri
    };
    if (options !== void 0 && (options.recursive !== void 0 || options.ignoreIfNotExists !== void 0)) {
      result.options = options;
    }
    if (annotation !== void 0) {
      result.annotationId = annotation;
    }
    return result;
  }
  DeleteFile2.create = create;
  function is(value) {
    let candidate = value;
    return candidate && candidate.kind === "delete" && Is.string(candidate.uri) && (candidate.options === void 0 || (candidate.options.recursive === void 0 || Is.boolean(candidate.options.recursive)) && (candidate.options.ignoreIfNotExists === void 0 || Is.boolean(candidate.options.ignoreIfNotExists))) && (candidate.annotationId === void 0 || ChangeAnnotationIdentifier.is(candidate.annotationId));
  }
  DeleteFile2.is = is;
})(DeleteFile || (DeleteFile = {}));
var WorkspaceEdit;
(function(WorkspaceEdit4) {
  function is(value) {
    let candidate = value;
    return candidate && (candidate.changes !== void 0 || candidate.documentChanges !== void 0) && (candidate.documentChanges === void 0 || candidate.documentChanges.every((change) => {
      if (Is.string(change.kind)) {
        return CreateFile.is(change) || RenameFile.is(change) || DeleteFile.is(change);
      } else {
        return TextDocumentEdit.is(change);
      }
    }));
  }
  WorkspaceEdit4.is = is;
})(WorkspaceEdit || (WorkspaceEdit = {}));
var TextDocumentIdentifier;
(function(TextDocumentIdentifier2) {
  function create(uri) {
    return { uri };
  }
  TextDocumentIdentifier2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri);
  }
  TextDocumentIdentifier2.is = is;
})(TextDocumentIdentifier || (TextDocumentIdentifier = {}));
var VersionedTextDocumentIdentifier;
(function(VersionedTextDocumentIdentifier2) {
  function create(uri, version) {
    return { uri, version };
  }
  VersionedTextDocumentIdentifier2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && Is.integer(candidate.version);
  }
  VersionedTextDocumentIdentifier2.is = is;
})(VersionedTextDocumentIdentifier || (VersionedTextDocumentIdentifier = {}));
var OptionalVersionedTextDocumentIdentifier;
(function(OptionalVersionedTextDocumentIdentifier2) {
  function create(uri, version) {
    return { uri, version };
  }
  OptionalVersionedTextDocumentIdentifier2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && (candidate.version === null || Is.integer(candidate.version));
  }
  OptionalVersionedTextDocumentIdentifier2.is = is;
})(OptionalVersionedTextDocumentIdentifier || (OptionalVersionedTextDocumentIdentifier = {}));
var TextDocumentItem;
(function(TextDocumentItem2) {
  function create(uri, languageId, version, text) {
    return { uri, languageId, version, text };
  }
  TextDocumentItem2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && Is.string(candidate.languageId) && Is.integer(candidate.version) && Is.string(candidate.text);
  }
  TextDocumentItem2.is = is;
})(TextDocumentItem || (TextDocumentItem = {}));
var MarkupKind;
(function(MarkupKind2) {
  MarkupKind2.PlainText = "plaintext";
  MarkupKind2.Markdown = "markdown";
  function is(value) {
    const candidate = value;
    return candidate === MarkupKind2.PlainText || candidate === MarkupKind2.Markdown;
  }
  MarkupKind2.is = is;
})(MarkupKind || (MarkupKind = {}));
var MarkupContent;
(function(MarkupContent2) {
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(value) && MarkupKind.is(candidate.kind) && Is.string(candidate.value);
  }
  MarkupContent2.is = is;
})(MarkupContent || (MarkupContent = {}));
var CompletionItemKind;
(function(CompletionItemKind2) {
  CompletionItemKind2.Text = 1;
  CompletionItemKind2.Method = 2;
  CompletionItemKind2.Function = 3;
  CompletionItemKind2.Constructor = 4;
  CompletionItemKind2.Field = 5;
  CompletionItemKind2.Variable = 6;
  CompletionItemKind2.Class = 7;
  CompletionItemKind2.Interface = 8;
  CompletionItemKind2.Module = 9;
  CompletionItemKind2.Property = 10;
  CompletionItemKind2.Unit = 11;
  CompletionItemKind2.Value = 12;
  CompletionItemKind2.Enum = 13;
  CompletionItemKind2.Keyword = 14;
  CompletionItemKind2.Snippet = 15;
  CompletionItemKind2.Color = 16;
  CompletionItemKind2.File = 17;
  CompletionItemKind2.Reference = 18;
  CompletionItemKind2.Folder = 19;
  CompletionItemKind2.EnumMember = 20;
  CompletionItemKind2.Constant = 21;
  CompletionItemKind2.Struct = 22;
  CompletionItemKind2.Event = 23;
  CompletionItemKind2.Operator = 24;
  CompletionItemKind2.TypeParameter = 25;
})(CompletionItemKind || (CompletionItemKind = {}));
var InsertTextFormat;
(function(InsertTextFormat2) {
  InsertTextFormat2.PlainText = 1;
  InsertTextFormat2.Snippet = 2;
})(InsertTextFormat || (InsertTextFormat = {}));
var CompletionItemTag;
(function(CompletionItemTag2) {
  CompletionItemTag2.Deprecated = 1;
})(CompletionItemTag || (CompletionItemTag = {}));
var InsertReplaceEdit;
(function(InsertReplaceEdit2) {
  function create(newText, insert, replace) {
    return { newText, insert, replace };
  }
  InsertReplaceEdit2.create = create;
  function is(value) {
    const candidate = value;
    return candidate && Is.string(candidate.newText) && Range3.is(candidate.insert) && Range3.is(candidate.replace);
  }
  InsertReplaceEdit2.is = is;
})(InsertReplaceEdit || (InsertReplaceEdit = {}));
var InsertTextMode;
(function(InsertTextMode2) {
  InsertTextMode2.asIs = 1;
  InsertTextMode2.adjustIndentation = 2;
})(InsertTextMode || (InsertTextMode = {}));
var CompletionItemLabelDetails;
(function(CompletionItemLabelDetails2) {
  function is(value) {
    const candidate = value;
    return candidate && (Is.string(candidate.detail) || candidate.detail === void 0) && (Is.string(candidate.description) || candidate.description === void 0);
  }
  CompletionItemLabelDetails2.is = is;
})(CompletionItemLabelDetails || (CompletionItemLabelDetails = {}));
var CompletionItem;
(function(CompletionItem2) {
  function create(label) {
    return { label };
  }
  CompletionItem2.create = create;
})(CompletionItem || (CompletionItem = {}));
var CompletionList;
(function(CompletionList2) {
  function create(items, isIncomplete) {
    return { items: items ? items : [], isIncomplete: !!isIncomplete };
  }
  CompletionList2.create = create;
})(CompletionList || (CompletionList = {}));
var MarkedString;
(function(MarkedString2) {
  function fromPlainText(plainText) {
    return plainText.replace(/[\\`*_{}[\]()#+\-.!]/g, "\\$&");
  }
  MarkedString2.fromPlainText = fromPlainText;
  function is(value) {
    const candidate = value;
    return Is.string(candidate) || Is.objectLiteral(candidate) && Is.string(candidate.language) && Is.string(candidate.value);
  }
  MarkedString2.is = is;
})(MarkedString || (MarkedString = {}));
var Hover;
(function(Hover2) {
  function is(value) {
    let candidate = value;
    return !!candidate && Is.objectLiteral(candidate) && (MarkupContent.is(candidate.contents) || MarkedString.is(candidate.contents) || Is.typedArray(candidate.contents, MarkedString.is)) && (value.range === void 0 || Range3.is(value.range));
  }
  Hover2.is = is;
})(Hover || (Hover = {}));
var ParameterInformation;
(function(ParameterInformation2) {
  function create(label, documentation) {
    return documentation ? { label, documentation } : { label };
  }
  ParameterInformation2.create = create;
})(ParameterInformation || (ParameterInformation = {}));
var SignatureInformation;
(function(SignatureInformation2) {
  function create(label, documentation, ...parameters) {
    let result = { label };
    if (Is.defined(documentation)) {
      result.documentation = documentation;
    }
    if (Is.defined(parameters)) {
      result.parameters = parameters;
    } else {
      result.parameters = [];
    }
    return result;
  }
  SignatureInformation2.create = create;
})(SignatureInformation || (SignatureInformation = {}));
var DocumentHighlightKind;
(function(DocumentHighlightKind2) {
  DocumentHighlightKind2.Text = 1;
  DocumentHighlightKind2.Read = 2;
  DocumentHighlightKind2.Write = 3;
})(DocumentHighlightKind || (DocumentHighlightKind = {}));
var DocumentHighlight;
(function(DocumentHighlight2) {
  function create(range, kind) {
    let result = { range };
    if (Is.number(kind)) {
      result.kind = kind;
    }
    return result;
  }
  DocumentHighlight2.create = create;
})(DocumentHighlight || (DocumentHighlight = {}));
var SymbolKind;
(function(SymbolKind2) {
  SymbolKind2.File = 1;
  SymbolKind2.Module = 2;
  SymbolKind2.Namespace = 3;
  SymbolKind2.Package = 4;
  SymbolKind2.Class = 5;
  SymbolKind2.Method = 6;
  SymbolKind2.Property = 7;
  SymbolKind2.Field = 8;
  SymbolKind2.Constructor = 9;
  SymbolKind2.Enum = 10;
  SymbolKind2.Interface = 11;
  SymbolKind2.Function = 12;
  SymbolKind2.Variable = 13;
  SymbolKind2.Constant = 14;
  SymbolKind2.String = 15;
  SymbolKind2.Number = 16;
  SymbolKind2.Boolean = 17;
  SymbolKind2.Array = 18;
  SymbolKind2.Object = 19;
  SymbolKind2.Key = 20;
  SymbolKind2.Null = 21;
  SymbolKind2.EnumMember = 22;
  SymbolKind2.Struct = 23;
  SymbolKind2.Event = 24;
  SymbolKind2.Operator = 25;
  SymbolKind2.TypeParameter = 26;
})(SymbolKind || (SymbolKind = {}));
var SymbolTag;
(function(SymbolTag2) {
  SymbolTag2.Deprecated = 1;
})(SymbolTag || (SymbolTag = {}));
var SymbolInformation;
(function(SymbolInformation2) {
  function create(name2, kind, range, uri, containerName) {
    let result = {
      name: name2,
      kind,
      location: { uri, range }
    };
    if (containerName) {
      result.containerName = containerName;
    }
    return result;
  }
  SymbolInformation2.create = create;
})(SymbolInformation || (SymbolInformation = {}));
var WorkspaceSymbol;
(function(WorkspaceSymbol2) {
  function create(name2, kind, uri, range) {
    return range !== void 0 ? { name: name2, kind, location: { uri, range } } : { name: name2, kind, location: { uri } };
  }
  WorkspaceSymbol2.create = create;
})(WorkspaceSymbol || (WorkspaceSymbol = {}));
var DocumentSymbol;
(function(DocumentSymbol2) {
  function create(name2, detail, kind, range, selectionRange, children) {
    let result = {
      name: name2,
      detail,
      kind,
      range,
      selectionRange
    };
    if (children !== void 0) {
      result.children = children;
    }
    return result;
  }
  DocumentSymbol2.create = create;
  function is(value) {
    let candidate = value;
    return candidate && Is.string(candidate.name) && Is.number(candidate.kind) && Range3.is(candidate.range) && Range3.is(candidate.selectionRange) && (candidate.detail === void 0 || Is.string(candidate.detail)) && (candidate.deprecated === void 0 || Is.boolean(candidate.deprecated)) && (candidate.children === void 0 || Array.isArray(candidate.children)) && (candidate.tags === void 0 || Array.isArray(candidate.tags));
  }
  DocumentSymbol2.is = is;
})(DocumentSymbol || (DocumentSymbol = {}));
var CodeActionKind;
(function(CodeActionKind2) {
  CodeActionKind2.Empty = "";
  CodeActionKind2.QuickFix = "quickfix";
  CodeActionKind2.Refactor = "refactor";
  CodeActionKind2.RefactorExtract = "refactor.extract";
  CodeActionKind2.RefactorInline = "refactor.inline";
  CodeActionKind2.RefactorRewrite = "refactor.rewrite";
  CodeActionKind2.Source = "source";
  CodeActionKind2.SourceOrganizeImports = "source.organizeImports";
  CodeActionKind2.SourceFixAll = "source.fixAll";
})(CodeActionKind || (CodeActionKind = {}));
var CodeActionTriggerKind;
(function(CodeActionTriggerKind2) {
  CodeActionTriggerKind2.Invoked = 1;
  CodeActionTriggerKind2.Automatic = 2;
})(CodeActionTriggerKind || (CodeActionTriggerKind = {}));
var CodeActionContext;
(function(CodeActionContext2) {
  function create(diagnostics, only, triggerKind) {
    let result = { diagnostics };
    if (only !== void 0 && only !== null) {
      result.only = only;
    }
    if (triggerKind !== void 0 && triggerKind !== null) {
      result.triggerKind = triggerKind;
    }
    return result;
  }
  CodeActionContext2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.typedArray(candidate.diagnostics, Diagnostic3.is) && (candidate.only === void 0 || Is.typedArray(candidate.only, Is.string)) && (candidate.triggerKind === void 0 || candidate.triggerKind === CodeActionTriggerKind.Invoked || candidate.triggerKind === CodeActionTriggerKind.Automatic);
  }
  CodeActionContext2.is = is;
})(CodeActionContext || (CodeActionContext = {}));
var CodeAction;
(function(CodeAction2) {
  function create(title, kindOrCommandOrEdit, kind) {
    let result = { title };
    let checkKind = true;
    if (typeof kindOrCommandOrEdit === "string") {
      checkKind = false;
      result.kind = kindOrCommandOrEdit;
    } else if (Command.is(kindOrCommandOrEdit)) {
      result.command = kindOrCommandOrEdit;
    } else {
      result.edit = kindOrCommandOrEdit;
    }
    if (checkKind && kind !== void 0) {
      result.kind = kind;
    }
    return result;
  }
  CodeAction2.create = create;
  function is(value) {
    let candidate = value;
    return candidate && Is.string(candidate.title) && (candidate.diagnostics === void 0 || Is.typedArray(candidate.diagnostics, Diagnostic3.is)) && (candidate.kind === void 0 || Is.string(candidate.kind)) && (candidate.edit !== void 0 || candidate.command !== void 0) && (candidate.command === void 0 || Command.is(candidate.command)) && (candidate.isPreferred === void 0 || Is.boolean(candidate.isPreferred)) && (candidate.edit === void 0 || WorkspaceEdit.is(candidate.edit));
  }
  CodeAction2.is = is;
})(CodeAction || (CodeAction = {}));
var CodeLens;
(function(CodeLens2) {
  function create(range, data) {
    let result = { range };
    if (Is.defined(data)) {
      result.data = data;
    }
    return result;
  }
  CodeLens2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Range3.is(candidate.range) && (Is.undefined(candidate.command) || Command.is(candidate.command));
  }
  CodeLens2.is = is;
})(CodeLens || (CodeLens = {}));
var FormattingOptions;
(function(FormattingOptions2) {
  function create(tabSize, insertSpaces) {
    return { tabSize, insertSpaces };
  }
  FormattingOptions2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.uinteger(candidate.tabSize) && Is.boolean(candidate.insertSpaces);
  }
  FormattingOptions2.is = is;
})(FormattingOptions || (FormattingOptions = {}));
var DocumentLink;
(function(DocumentLink2) {
  function create(range, target, data) {
    return { range, target, data };
  }
  DocumentLink2.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Range3.is(candidate.range) && (Is.undefined(candidate.target) || Is.string(candidate.target));
  }
  DocumentLink2.is = is;
})(DocumentLink || (DocumentLink = {}));
var SelectionRange;
(function(SelectionRange2) {
  function create(range, parent) {
    return { range, parent };
  }
  SelectionRange2.create = create;
  function is(value) {
    let candidate = value;
    return Is.objectLiteral(candidate) && Range3.is(candidate.range) && (candidate.parent === void 0 || SelectionRange2.is(candidate.parent));
  }
  SelectionRange2.is = is;
})(SelectionRange || (SelectionRange = {}));
var SemanticTokenTypes;
(function(SemanticTokenTypes2) {
  SemanticTokenTypes2["namespace"] = "namespace";
  SemanticTokenTypes2["type"] = "type";
  SemanticTokenTypes2["class"] = "class";
  SemanticTokenTypes2["enum"] = "enum";
  SemanticTokenTypes2["interface"] = "interface";
  SemanticTokenTypes2["struct"] = "struct";
  SemanticTokenTypes2["typeParameter"] = "typeParameter";
  SemanticTokenTypes2["parameter"] = "parameter";
  SemanticTokenTypes2["variable"] = "variable";
  SemanticTokenTypes2["property"] = "property";
  SemanticTokenTypes2["enumMember"] = "enumMember";
  SemanticTokenTypes2["event"] = "event";
  SemanticTokenTypes2["function"] = "function";
  SemanticTokenTypes2["method"] = "method";
  SemanticTokenTypes2["macro"] = "macro";
  SemanticTokenTypes2["keyword"] = "keyword";
  SemanticTokenTypes2["modifier"] = "modifier";
  SemanticTokenTypes2["comment"] = "comment";
  SemanticTokenTypes2["string"] = "string";
  SemanticTokenTypes2["number"] = "number";
  SemanticTokenTypes2["regexp"] = "regexp";
  SemanticTokenTypes2["operator"] = "operator";
  SemanticTokenTypes2["decorator"] = "decorator";
})(SemanticTokenTypes || (SemanticTokenTypes = {}));
var SemanticTokenModifiers;
(function(SemanticTokenModifiers2) {
  SemanticTokenModifiers2["declaration"] = "declaration";
  SemanticTokenModifiers2["definition"] = "definition";
  SemanticTokenModifiers2["readonly"] = "readonly";
  SemanticTokenModifiers2["static"] = "static";
  SemanticTokenModifiers2["deprecated"] = "deprecated";
  SemanticTokenModifiers2["abstract"] = "abstract";
  SemanticTokenModifiers2["async"] = "async";
  SemanticTokenModifiers2["modification"] = "modification";
  SemanticTokenModifiers2["documentation"] = "documentation";
  SemanticTokenModifiers2["defaultLibrary"] = "defaultLibrary";
})(SemanticTokenModifiers || (SemanticTokenModifiers = {}));
var SemanticTokens;
(function(SemanticTokens2) {
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && (candidate.resultId === void 0 || typeof candidate.resultId === "string") && Array.isArray(candidate.data) && (candidate.data.length === 0 || typeof candidate.data[0] === "number");
  }
  SemanticTokens2.is = is;
})(SemanticTokens || (SemanticTokens = {}));
var InlineValueText;
(function(InlineValueText2) {
  function create(range, text) {
    return { range, text };
  }
  InlineValueText2.create = create;
  function is(value) {
    const candidate = value;
    return candidate !== void 0 && candidate !== null && Range3.is(candidate.range) && Is.string(candidate.text);
  }
  InlineValueText2.is = is;
})(InlineValueText || (InlineValueText = {}));
var InlineValueVariableLookup;
(function(InlineValueVariableLookup2) {
  function create(range, variableName, caseSensitiveLookup) {
    return { range, variableName, caseSensitiveLookup };
  }
  InlineValueVariableLookup2.create = create;
  function is(value) {
    const candidate = value;
    return candidate !== void 0 && candidate !== null && Range3.is(candidate.range) && Is.boolean(candidate.caseSensitiveLookup) && (Is.string(candidate.variableName) || candidate.variableName === void 0);
  }
  InlineValueVariableLookup2.is = is;
})(InlineValueVariableLookup || (InlineValueVariableLookup = {}));
var InlineValueEvaluatableExpression;
(function(InlineValueEvaluatableExpression2) {
  function create(range, expression) {
    return { range, expression };
  }
  InlineValueEvaluatableExpression2.create = create;
  function is(value) {
    const candidate = value;
    return candidate !== void 0 && candidate !== null && Range3.is(candidate.range) && (Is.string(candidate.expression) || candidate.expression === void 0);
  }
  InlineValueEvaluatableExpression2.is = is;
})(InlineValueEvaluatableExpression || (InlineValueEvaluatableExpression = {}));
var InlineValueContext;
(function(InlineValueContext2) {
  function create(frameId, stoppedLocation) {
    return { frameId, stoppedLocation };
  }
  InlineValueContext2.create = create;
  function is(value) {
    const candidate = value;
    return Is.defined(candidate) && Range3.is(value.stoppedLocation);
  }
  InlineValueContext2.is = is;
})(InlineValueContext || (InlineValueContext = {}));
var InlayHintKind;
(function(InlayHintKind2) {
  InlayHintKind2.Type = 1;
  InlayHintKind2.Parameter = 2;
  function is(value) {
    return value === 1 || value === 2;
  }
  InlayHintKind2.is = is;
})(InlayHintKind || (InlayHintKind = {}));
var InlayHintLabelPart;
(function(InlayHintLabelPart2) {
  function create(value) {
    return { value };
  }
  InlayHintLabelPart2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && (candidate.tooltip === void 0 || Is.string(candidate.tooltip) || MarkupContent.is(candidate.tooltip)) && (candidate.location === void 0 || Location.is(candidate.location)) && (candidate.command === void 0 || Command.is(candidate.command));
  }
  InlayHintLabelPart2.is = is;
})(InlayHintLabelPart || (InlayHintLabelPart = {}));
var InlayHint;
(function(InlayHint2) {
  function create(position, label, kind) {
    const result = { position, label };
    if (kind !== void 0) {
      result.kind = kind;
    }
    return result;
  }
  InlayHint2.create = create;
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && Position2.is(candidate.position) && (Is.string(candidate.label) || Is.typedArray(candidate.label, InlayHintLabelPart.is)) && (candidate.kind === void 0 || InlayHintKind.is(candidate.kind)) && candidate.textEdits === void 0 || Is.typedArray(candidate.textEdits, TextEdit.is) && (candidate.tooltip === void 0 || Is.string(candidate.tooltip) || MarkupContent.is(candidate.tooltip)) && (candidate.paddingLeft === void 0 || Is.boolean(candidate.paddingLeft)) && (candidate.paddingRight === void 0 || Is.boolean(candidate.paddingRight));
  }
  InlayHint2.is = is;
})(InlayHint || (InlayHint = {}));
var StringValue;
(function(StringValue2) {
  function createSnippet(value) {
    return { kind: "snippet", value };
  }
  StringValue2.createSnippet = createSnippet;
})(StringValue || (StringValue = {}));
var InlineCompletionItem;
(function(InlineCompletionItem2) {
  function create(insertText, filterText, range, command) {
    return { insertText, filterText, range, command };
  }
  InlineCompletionItem2.create = create;
})(InlineCompletionItem || (InlineCompletionItem = {}));
var InlineCompletionList;
(function(InlineCompletionList2) {
  function create(items) {
    return { items };
  }
  InlineCompletionList2.create = create;
})(InlineCompletionList || (InlineCompletionList = {}));
var InlineCompletionTriggerKind;
(function(InlineCompletionTriggerKind2) {
  InlineCompletionTriggerKind2.Invoked = 0;
  InlineCompletionTriggerKind2.Automatic = 1;
})(InlineCompletionTriggerKind || (InlineCompletionTriggerKind = {}));
var SelectedCompletionInfo;
(function(SelectedCompletionInfo2) {
  function create(range, text) {
    return { range, text };
  }
  SelectedCompletionInfo2.create = create;
})(SelectedCompletionInfo || (SelectedCompletionInfo = {}));
var InlineCompletionContext;
(function(InlineCompletionContext2) {
  function create(triggerKind, selectedCompletionInfo) {
    return { triggerKind, selectedCompletionInfo };
  }
  InlineCompletionContext2.create = create;
})(InlineCompletionContext || (InlineCompletionContext = {}));
var WorkspaceFolder;
(function(WorkspaceFolder2) {
  function is(value) {
    const candidate = value;
    return Is.objectLiteral(candidate) && URI.is(candidate.uri) && Is.string(candidate.name);
  }
  WorkspaceFolder2.is = is;
})(WorkspaceFolder || (WorkspaceFolder = {}));
var TextDocument;
(function(TextDocument3) {
  function create(uri, languageId, version, content) {
    return new FullTextDocument(uri, languageId, version, content);
  }
  TextDocument3.create = create;
  function is(value) {
    let candidate = value;
    return Is.defined(candidate) && Is.string(candidate.uri) && (Is.undefined(candidate.languageId) || Is.string(candidate.languageId)) && Is.uinteger(candidate.lineCount) && Is.func(candidate.getText) && Is.func(candidate.positionAt) && Is.func(candidate.offsetAt) ? true : false;
  }
  TextDocument3.is = is;
  function applyEdits(document2, edits) {
    let text = document2.getText();
    let sortedEdits = mergeSort(edits, (a, b) => {
      let diff = a.range.start.line - b.range.start.line;
      if (diff === 0) {
        return a.range.start.character - b.range.start.character;
      }
      return diff;
    });
    let lastModifiedOffset = text.length;
    for (let i2 = sortedEdits.length - 1; i2 >= 0; i2--) {
      let e = sortedEdits[i2];
      let startOffset = document2.offsetAt(e.range.start);
      let endOffset = document2.offsetAt(e.range.end);
      if (endOffset <= lastModifiedOffset) {
        text = text.substring(0, startOffset) + e.newText + text.substring(endOffset, text.length);
      } else {
        throw new Error("Overlapping edit");
      }
      lastModifiedOffset = startOffset;
    }
    return text;
  }
  TextDocument3.applyEdits = applyEdits;
  function mergeSort(data, compare) {
    if (data.length <= 1) {
      return data;
    }
    const p = data.length / 2 | 0;
    const left = data.slice(0, p);
    const right = data.slice(p);
    mergeSort(left, compare);
    mergeSort(right, compare);
    let leftIdx = 0;
    let rightIdx = 0;
    let i2 = 0;
    while (leftIdx < left.length && rightIdx < right.length) {
      let ret = compare(left[leftIdx], right[rightIdx]);
      if (ret <= 0) {
        data[i2++] = left[leftIdx++];
      } else {
        data[i2++] = right[rightIdx++];
      }
    }
    while (leftIdx < left.length) {
      data[i2++] = left[leftIdx++];
    }
    while (rightIdx < right.length) {
      data[i2++] = right[rightIdx++];
    }
    return data;
  }
})(TextDocument || (TextDocument = {}));
var FullTextDocument = class {
  constructor(uri, languageId, version, content) {
    this._uri = uri;
    this._languageId = languageId;
    this._version = version;
    this._content = content;
    this._lineOffsets = void 0;
  }
  get uri() {
    return this._uri;
  }
  get languageId() {
    return this._languageId;
  }
  get version() {
    return this._version;
  }
  getText(range) {
    if (range) {
      let start2 = this.offsetAt(range.start);
      let end = this.offsetAt(range.end);
      return this._content.substring(start2, end);
    }
    return this._content;
  }
  update(event, version) {
    this._content = event.text;
    this._version = version;
    this._lineOffsets = void 0;
  }
  getLineOffsets() {
    if (this._lineOffsets === void 0) {
      let lineOffsets = [];
      let text = this._content;
      let isLineStart = true;
      for (let i2 = 0; i2 < text.length; i2++) {
        if (isLineStart) {
          lineOffsets.push(i2);
          isLineStart = false;
        }
        let ch = text.charAt(i2);
        isLineStart = ch === "\r" || ch === "\n";
        if (ch === "\r" && i2 + 1 < text.length && text.charAt(i2 + 1) === "\n") {
          i2++;
        }
      }
      if (isLineStart && text.length > 0) {
        lineOffsets.push(text.length);
      }
      this._lineOffsets = lineOffsets;
    }
    return this._lineOffsets;
  }
  positionAt(offset) {
    offset = Math.max(Math.min(offset, this._content.length), 0);
    let lineOffsets = this.getLineOffsets();
    let low = 0, high = lineOffsets.length;
    if (high === 0) {
      return Position2.create(0, offset);
    }
    while (low < high) {
      let mid = Math.floor((low + high) / 2);
      if (lineOffsets[mid] > offset) {
        high = mid;
      } else {
        low = mid + 1;
      }
    }
    let line = low - 1;
    return Position2.create(line, offset - lineOffsets[line]);
  }
  offsetAt(position) {
    let lineOffsets = this.getLineOffsets();
    if (position.line >= lineOffsets.length) {
      return this._content.length;
    } else if (position.line < 0) {
      return 0;
    }
    let lineOffset = lineOffsets[position.line];
    let nextLineOffset = position.line + 1 < lineOffsets.length ? lineOffsets[position.line + 1] : this._content.length;
    return Math.max(Math.min(lineOffset + position.character, nextLineOffset), lineOffset);
  }
  get lineCount() {
    return this.getLineOffsets().length;
  }
};
var Is;
(function(Is2) {
  const toString = Object.prototype.toString;
  function defined(value) {
    return typeof value !== "undefined";
  }
  Is2.defined = defined;
  function undefined2(value) {
    return typeof value === "undefined";
  }
  Is2.undefined = undefined2;
  function boolean(value) {
    return value === true || value === false;
  }
  Is2.boolean = boolean;
  function string(value) {
    return toString.call(value) === "[object String]";
  }
  Is2.string = string;
  function number(value) {
    return toString.call(value) === "[object Number]";
  }
  Is2.number = number;
  function numberRange(value, min, max) {
    return toString.call(value) === "[object Number]" && min <= value && value <= max;
  }
  Is2.numberRange = numberRange;
  function integer2(value) {
    return toString.call(value) === "[object Number]" && -2147483648 <= value && value <= 2147483647;
  }
  Is2.integer = integer2;
  function uinteger2(value) {
    return toString.call(value) === "[object Number]" && 0 <= value && value <= 2147483647;
  }
  Is2.uinteger = uinteger2;
  function func2(value) {
    return toString.call(value) === "[object Function]";
  }
  Is2.func = func2;
  function objectLiteral(value) {
    return value !== null && typeof value === "object";
  }
  Is2.objectLiteral = objectLiteral;
  function typedArray(value, check) {
    return Array.isArray(value) && value.every(check);
  }
  Is2.typedArray = typedArray;
})(Is || (Is = {}));

// server/src/symbol_table/tamarinTypes.ts
var Parser4 = require_tree_sitter();

// server/src/symbol_table/utils.ts
var Parser5 = require_tree_sitter();
function find_variables(node) {
  var _a;
  let vars = [];
  if (node.grammarType === "msg_var_or_nullary_fun" /* MVONF */ && ((_a = node.parent) == null ? void 0 : _a.grammarType) === "equation" /* Equation */) {
    vars.push(node);
    return vars;
  }
  for (let child of node.children) {
    if (child.grammarType === "proof_method") {
      continue;
    }
    if (child.grammarType === "pub_var" || child.grammarType === "fresh_var" || child.grammarType === "msg_var_or_nullary_fun" /* MVONF */ || child.grammarType === "nat_var" || child.grammarType === "temporal_var") {
      vars.push(child);
      vars = vars.concat(find_variables(child));
    } else {
      vars = vars.concat(find_variables(child));
    }
  }
  return vars;
}
function find_linear_fact(node) {
  let vars = [];
  for (let child of node.children) {
    if (child.grammarType === "proof_method") {
      continue;
    }
    if (child.grammarType === "linear_fact" /* LinearF */ || child.grammarType === "nary_app" /* NARY */ || child.grammarType === "persistent_fact" /* PersistentF */) {
      vars.push(child);
      vars = vars.concat(find_linear_fact(child));
    } else {
      vars = vars.concat(find_linear_fact(child));
    }
  }
  return vars;
}
function find_narry(node) {
  let vars = [];
  for (let child of node.children) {
    if (child.grammarType === "nary_app" /* NARY */) {
      vars.push(child);
      vars = vars.concat(find_linear_fact(child));
    } else {
      vars = vars.concat(find_linear_fact(child));
    }
  }
  return vars;
}
function get_arity(node) {
  let arity2 = 0;
  if (node)
    for (let arg of node) {
      if (arg.type !== ",") {
        arity2++;
      }
    }
  return arity2;
}
function get_macro_arity(node) {
  let arity2 = -1;
  if (node)
    for (let arg of node) {
      if (arg.type === "=") {
        break;
      }
      if (arg.type !== "," && arg.type !== "(" && arg.type !== ")") {
        arity2++;
      }
    }
  return arity2;
}
function get_range(node) {
  const startPosition = {
    line: node.startPosition.row,
    character: node.startPosition.column
  };
  const endPosition = {
    line: node.endPosition.row,
    character: node.endPosition.column
  };
  return { start: startPosition, end: endPosition };
}

// server/src/symbol_table/tamarinConstants.ts
var ReservedFacts = ["Fr", "In", "Out", "KD", "KU", "K", "diff"];
var ExistingBuiltIns = [
  "diffie-hellman",
  "hashing",
  "symmetric-encryption",
  "asymmetric-encryption",
  "signing",
  "revealing-signing",
  "bilinear-pairing",
  "xor",
  "default"
];
var AssociatedFunctions = [
  ["inv", "1", "1", "0"],
  ["h", "1"],
  ["sdec", "2", "senc", "2"],
  ["aenc", "2", "adec", "2", "pk", "1"],
  ["sign", "2", "verify", "3", "pk", "1", "true", "0"],
  ["revealSign", "2", "revealVerify", "3", "getMessage", "1", "pk", "1", "true", "0"],
  ["pmult", "2", "em", "2"],
  ["XOR", "2", "zero", "0"],
  ["fst", "1", "snd", "1", "pair", "2"]
];

// server/src/features/checks/checkReservedFacts.ts
var Parser6 = require_tree_sitter();
function check_reserved_facts(node, editor) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  const diags = [];
  for (let child of node.children) {
    if (child.grammarType === "linear_fact" /* LinearF */ || child.grammarType === "persistent_fact" /* PersistentF */) {
      const fact_name = getName(child.child(0), editor);
      if (fact_name === ReservedFacts[0]) {
        if (node.grammarType === "conclusion") {
          diags.push(build_warning_display(child, editor, "Fr fact cannot be used in conclusion of a rule"));
        }
        if (((_a = child.child(2)) == null ? void 0 : _a.children) && get_arity((_b = child.child(2)) == null ? void 0 : _b.children) !== 1) {
          diags.push(build_error_display(child, editor, "Error: incorrect arity for Fr fact, only 1 argument expected"));
        }
      } else if (fact_name === ReservedFacts[1]) {
        if (node.grammarType === "conclusion") {
          diags.push(build_warning_display(child, editor, "In fact cannot be used in conclusion of a rule"));
        }
        if (((_c = child.child(2)) == null ? void 0 : _c.children) && get_arity((_d = child.child(2)) == null ? void 0 : _d.children) !== 1) {
          diags.push(build_error_display(child, editor, "Error: incorrect arity for In fact, only 1 argument expected"));
        }
      } else if (fact_name === ReservedFacts[2]) {
        if (node.grammarType === "premise") {
          diags.push(build_warning_display(child, editor, "Out fact cannot be used in premise of a rule"));
        }
        if (((_e = child.child(2)) == null ? void 0 : _e.children) && get_arity((_f = child.child(2)) == null ? void 0 : _f.children) !== 1) {
          diags.push(build_error_display(child, editor, "Error: incorrect arity for Out fact, only 1 argument expected"));
        }
      } else if ((fact_name === ReservedFacts[3] || fact_name === ReservedFacts[4] || fact_name === ReservedFacts[5]) && ((_g = node.parent) == null ? void 0 : _g.grammarType) === "simple_rule") {
        diags.push(build_warning_display(child, editor, "You are not supposed to use KD KU or action K in a rule "));
      } else if (fact_name === ReservedFacts[6]) {
        if (get_arity((_h = child.child(2)) == null ? void 0 : _h.children) != 2) {
          diags.push(build_error_display(child, editor, "Error : incorrect arity for diff fact, 2 arguments expected"));
        }
      }
    } else if (child.grammarType === "nary_app") {
      const fact_name_node = child.child(0);
      if (fact_name_node !== null && fact_name_node !== void 0) {
        const fact_name = getName(fact_name_node, editor);
        if (fact_name === ReservedFacts[6]) {
          if (node.grammarType === "equation" /* Equation */ || node.grammarType === "mset_term") {
            diags.push(build_warning_display(child, editor, "Warning  :  diff fact cannot be used in an equation"));
          }
        }
      }
    } else {
      diags.push(...check_reserved_facts(child, editor));
    }
  }
  return diags;
}

// server/src/symbol_table/create_symbol_table.ts
var Parser7 = require_tree_sitter();
var createSymbolTable = async (root, document2) => {
  let diags = [];
  const symbolTableVisitor = new SymbolTableVisitor();
  const symbolTable = await symbolTableVisitor.visit(root, document2, diags);
  symbolTable.setRootNodedocumentDiags(root, document2, diags);
  convert_linear_facts(symbolTable);
  return { symbolTable, diags };
};
function convert_linear_facts(ts) {
  var _a;
  for (let symbol of ts.getSymbols()) {
    if (symbol.declaration === "linear_fact" /* LinearF */ && ((_a = symbol.node.previousSibling) == null ? void 0 : _a.grammarType) === "!") {
      symbol.declaration = "persistent_fact" /* PersistentF */;
    }
  }
}
function convert(grammar_type) {
  if (grammar_type === "nary_app") {
    return "nary_app" /* NARY */;
  } else if (grammar_type === "linear_fact") {
    return "linear_fact" /* LinearF */;
  } else {
    return "default" /* DEFAULT */;
  }
  ;
}
var SymbolTableVisitor = class {
  constructor(symbolTable = new TamarinSymbolTable(), context = void 0) {
    this.symbolTable = symbolTable;
    this.context = context;
    this.visitcounter = 0;
    this.context = context;
  }
  // Used to add fst snd and pair symbols only once
  defaultResult() {
    return this.symbolTable;
  }
  /* Method that builds the symbol table adding every symbols while visiting the AST*/
  async visit(root, document2, diags) {
    var _a, _b;
    if (this.visitcounter === 0) {
      this.visitcounter++;
      for (let k = 0; k < AssociatedFunctions[AssociatedFunctions.length - 1].length; k += 2) {
        this.registerfucntion(root, "functions" /* Functions */, AssociatedFunctions[AssociatedFunctions.length - 1][k], parseInt(AssociatedFunctions[AssociatedFunctions.length - 1][k + 1]), root, get_range(root));
      }
    }
    for (let i2 = 0; i2 < root.children.length; i2++) {
      const child = root.child(i2);
      if (!child) {
        continue;
      }
      if ((child == null ? void 0 : child.grammarType) === "lemma" /* Lemma */ && (root.grammarType === "lemma" || root.grammarType === "diff_lemma") && root.parent !== null && (child == null ? void 0 : child.nextSibling)) {
        this.registerident(root, "lemma" /* Lemma */, getName(child == null ? void 0 : child.nextSibling, document2), root.parent, get_range(child == null ? void 0 : child.nextSibling));
        this.register_facts_searched(root, document2, root, "action_fact" /* ActionF */);
        this.register_vars_lemma(root, "lemma_variable" /* LemmaVariable */, document2);
      } else if ((child == null ? void 0 : child.grammarType) === "restriction" /* Restriction */ && root.grammarType === "restriction" && root.parent !== null && (child == null ? void 0 : child.nextSibling)) {
        this.registerident(root, "restriction" /* Restriction */, getName(child == null ? void 0 : child.nextSibling, document2), root.parent, get_range(child == null ? void 0 : child.nextSibling));
        this.register_facts_searched(root, document2, root);
        this.register_vars_lemma(root, "restriction_variable" /* RestrictionVariable */, document2);
      } else if ((child == null ? void 0 : child.grammarType) === "rule" /* Rule */ && root.grammarType === "simple_rule" && root.parent !== null && (child == null ? void 0 : child.nextSibling)) {
        this.registerident(root, "rule" /* Rule */, getName(child.nextSibling, document2), root.parent, get_range(child.nextSibling));
        diags.push(...check_reserved_facts(root, document2));
      } else if ((child == null ? void 0 : child.grammarType) === "quantified_formula" /* QF */) {
        continue;
      } else if ((child == null ? void 0 : child.grammarType) === "nested_formula" /* NF */) {
        continue;
      } else if ((child == null ? void 0 : child.grammarType) === "functions" /* Functions */) {
        for (let grandchild of child.children) {
          if (grandchild.grammarType === "function_pub" /* FUNCP */ || grandchild.grammarType === "function_private" /* FUNCPR */ || grandchild.grammarType === "function_destructor" /* FUNCD */ || grandchild.grammarType === "function_custom" /* FUNCUST */) {
            const funcNameNode = grandchild.child(0);
            if (funcNameNode) {
              this.registerfucntion(grandchild, "functions" /* Functions */, getName(grandchild.child(0), document2), parseInt(getName(grandchild.child(2), document2)), root, get_range(funcNameNode));
            }
          } else if (grandchild.grammarType === "function_untyped" && grandchild.child(0) !== null) {
            const funcName = getName(grandchild.child(0), document2);
            const arity2 = parseInt(getName(grandchild.child(2), document2));
            const funcNode = grandchild.child(0);
            if (funcNode) {
              this.registerfucntion(grandchild, "functions" /* Functions */, funcName, arity2, root, get_range(funcNode));
            }
          }
        }
      } else if ((child == null ? void 0 : child.grammarType) === "macros" /* Macros */ || (child == null ? void 0 : child.grammarType) === "equations" /* Equations */) {
        for (let grandchild of child.children) {
          if (grandchild.grammarType === "macro" /* Macro */) {
            const macroNameNode = grandchild.child(0);
            if (macroNameNode) {
              this.registerfucntion(grandchild, "macro" /* Macro */, getName(macroNameNode, document2), get_macro_arity(grandchild.children), root, get_range(macroNameNode));
            }
            this.register_facts_searched(grandchild, document2, grandchild, "nary_app" /* NARY */);
            let eqcount = 0;
            for (let ggchild of grandchild.children) {
              if (ggchild.grammarType === "=") {
                eqcount++;
              }
              if (eqcount === 0) {
                this.register_vars_left_macro_part(ggchild, "left_macro_variable" /* LMacroVariable */, document2, grandchild);
              } else {
                this.register_vars_rule(ggchild, "right_macro_variable" /* RMacroVariable */, document2, grandchild);
              }
            }
          } else if (grandchild.grammarType === "equation" /* Equation */) {
            diags.push(...check_reserved_facts(grandchild, document2));
            this.register_facts_searched(grandchild, document2, grandchild, "nary_app" /* NARY */);
            let eqcount = 0;
            for (let ggchild of grandchild.children) {
              if (ggchild.grammarType === "=") {
                eqcount++;
                continue;
              }
              if (eqcount === 0) {
                this.register_vars_rule(ggchild, "left_equation_variable" /* LEquationVariable */, document2, grandchild);
              } else {
                this.register_vars_rule(ggchild, "right_equation_variable" /* REquationVariable */, document2, grandchild);
              }
            }
          }
        }
      } else if ((child == null ? void 0 : child.grammarType) === "built_ins" /* Builtins */) {
        let pkcount = 0;
        for (let grandchild of child.children) {
          if (grandchild.grammarType === "built_in" /* Builtin */ && grandchild.child(0) !== null) {
            const builtinType = ((_a = grandchild.child(0)) == null ? void 0 : _a.grammarType) ?? "";
            this.registerident(grandchild, "built_in" /* Builtin */, builtinType, root, get_range(grandchild));
            const built_in_index = ExistingBuiltIns.indexOf(builtinType);
            if (built_in_index >= 0) {
              for (let k = 0; k < AssociatedFunctions[built_in_index].length; k += 2) {
                if (AssociatedFunctions[built_in_index][k] === "pk" && pkcount > 1) {
                  break;
                }
                this.registerfucntion(grandchild, "functions" /* Functions */, AssociatedFunctions[built_in_index][k], parseInt(AssociatedFunctions[built_in_index][k + 1]), root, get_range(grandchild));
              }
            }
            if (builtinType === "asymmetric-encryption" || builtinType === "signing" || builtinType === "revealing-signing") {
              pkcount++;
            }
          }
        }
      } else if ((child == null ? void 0 : child.grammarType) === "action_fact" /* ActionF */) {
        for (let grandchild of child.children) {
          if (grandchild.grammarType === "linear_fact" /* LinearF */ && grandchild.child(2) !== null) {
            const args2 = (_b = grandchild.child(2)) == null ? void 0 : _b.children;
            if (args2) {
              let arity2 = get_arity(args2);
              const node = grandchild.child(0);
              if (node) {
                this.registerfucntion(grandchild, "action_fact" /* ActionF */, getName(grandchild.child(0), document2), arity2, root, get_range(node));
              }
            }
          }
        }
        this.register_narry(child, document2, root);
        this.register_vars_rule(child, "action_fact_variable" /* ActionFVariable */, document2, root);
      } else if ((child == null ? void 0 : child.grammarType) === "conclusion" /* Conclusion */) {
        this.register_facts_searched(child, document2, root);
        this.register_vars_rule(child, "conclusion_variable" /* CCLVariable */, document2, root);
      } else if ((child == null ? void 0 : child.grammarType) === "premise" /* Premise */) {
        this.register_facts_searched(child, document2, root);
        this.register_vars_rule(child, "premise_variable" /* PRVariable */, document2, root);
      } else if ((child == null ? void 0 : child.grammarType) === "rule_let_block" /* Rule_let_block */) {
        this.register_vars_rule(child, "premise_variable" /* PRVariable */, document2, root);
      } else {
        if (child !== null) {
          await this.visit(child, document2, diags);
        }
      }
    }
    return this.symbolTable;
  }
  //Method used to register vars found by find variables function 
  register_vars_rule(node, type, document2, root) {
    var _a;
    let vars = find_variables(node);
    for (let k = 0; k < vars.length; k++) {
      if (vars[k].grammarType === "msg_var_or_nullary_fun" /* MVONF */) {
        let isregistered = false;
        for (let symbol of this.symbolTable.getSymbols()) {
          if (symbol.declaration === "functions" /* Functions */) {
            if (symbol.name === getName(vars[k], document2)) {
              isregistered = true;
              this.registerfucntion(vars[k], "nary_app" /* NARY */, symbol.name, 0, root, get_range(vars[k]));
            }
          } else {
            continue;
          }
        }
        const nameNode = vars[k].child(0);
        if (!isregistered && nameNode) {
          this.registerident(vars[k], type, getName(vars[k].child(0), document2), root, get_range(nameNode));
        }
      } else {
        const nameNode = vars[k].child(1);
        if (nameNode) {
          this.registerident(vars[k], type, getName(vars[k].child(1), document2), root, get_range(nameNode), (_a = vars[k].child(0)) == null ? void 0 : _a.grammarType);
        }
      }
    }
  }
  register_vars_left_macro_part(node, type, document2, root) {
    var _a;
    if (node.grammarType === "msg_var_or_nullary_fun" /* MVONF */) {
      let isregistered = false;
      for (let symbol of this.symbolTable.getSymbols()) {
        if (symbol.declaration === "functions" /* Functions */) {
          if (symbol.name === getName(node, document2)) {
            isregistered = true;
            this.registerfucntion(node, "nary_app" /* NARY */, symbol.name, 0, root, get_range(node));
          }
        } else {
          continue;
        }
      }
      if (!isregistered) {
        const nameNode = node.child(0);
        if (nameNode) {
          this.registerident(node, type, getName(node.child(0), document2), root, get_range(nameNode));
        }
      }
    } else if (node.grammarType === "pub_var" || node.grammarType === "fresh_var" || node.grammarType === "nat_var" || node.grammarType === "temporal_var") {
      const nameNode = node.child(1);
      if (nameNode) {
        this.registerident(node, type, getName(node.child(1), document2), root, get_range(nameNode), (_a = node.child(0)) == null ? void 0 : _a.grammarType);
      }
    }
  }
  register_vars_lemma(node, type, document2) {
    var _a;
    let vars = find_variables(node);
    for (let k = 0; k < vars.length; k++) {
      let context = vars[k];
      while (context.grammarType !== "nested_formula" /* NF */ && context.grammarType !== "conjunction" && context.grammarType !== "disjunction" && (context.grammarType !== "lemma" /* Lemma */ && context.grammarType !== "restriction" /* Restriction */ && context.grammarType !== "diff_lemma")) {
        if (context.parent) {
          context = context.parent;
        }
      }
      if (vars[k].parent !== null) {
        if (vars[k].grammarType === "msg_var_or_nullary_fun" /* MVONF */ || vars[k].grammarType === "temporal_var" /* TMPV */ && vars[k].children.length === 1) {
          let isregistered = false;
          for (let symbol of this.symbolTable.getSymbols()) {
            if (symbol.declaration === "functions" /* Functions */) {
              if (symbol.name === getName(vars[k], document2)) {
                isregistered = true;
                this.registerfucntion(vars[k], "nary_app" /* NARY */, symbol.name, 0, context, get_range(vars[k]));
              }
            } else {
              continue;
            }
          }
          if (!isregistered) {
            const nameNode = vars[k].child(0);
            if (nameNode) {
              this.registerident(vars[k], type, getName(vars[k].child(0), document2), context, get_range(nameNode));
            }
          }
        } else {
          const nameNode = vars[k].child(1);
          if (nameNode) {
            this.registerident(vars[k], type, getName(vars[k].child(1), document2), context, get_range(nameNode), (_a = vars[k].child(0)) == null ? void 0 : _a.grammarType);
          }
        }
      }
    }
  }
  /* Function used to register the facts found with find_linear_fact*/
  register_facts_searched(node, document2, root, type) {
    var _a, _b;
    let vars = find_linear_fact(node);
    for (let k = 0; k < vars.length; k++) {
      const factName = getName(vars[k].child(0), document2);
      if (ReservedFacts.includes(factName)) {
        continue;
      }
      let isFunction = false;
      for (let symbol of this.symbolTable.getSymbols()) {
        if (symbol.declaration === "functions" /* Functions */ && symbol.name === factName) {
          isFunction = true;
          if (vars[k].child(2) !== null) {
            const args2 = (_a = vars[k].child(2)) == null ? void 0 : _a.children;
            if (args2) {
              let arity2 = get_arity(args2);
              const factNameNode = vars[k].child(0);
              if (factNameNode) {
                this.registerfucntion(vars[k], "nary_app" /* NARY */, factName, arity2, root, get_range(factNameNode));
              }
            }
          }
          break;
        }
      }
      if (isFunction) {
        continue;
      }
      if (vars[k].child(2) !== null) {
        const args2 = (_b = vars[k].child(2)) == null ? void 0 : _b.children;
        if (args2) {
          let arity2 = get_arity(args2);
          const factNameNode = vars[k].child(0);
          if (factNameNode) {
            if (type) {
              this.registerfucntion(vars[k], type, factName, arity2, root, get_range(factNameNode));
            } else {
              this.registerfucntion(vars[k], convert(vars[k].grammarType), factName, arity2, root, get_range(factNameNode));
            }
          }
        }
      }
    }
  }
  /* Same as above but for functions */
  register_narry(node, document2, root) {
    var _a;
    let vars = find_narry(node);
    for (let k = 0; k < vars.length; k++) {
      if (ReservedFacts.includes(getName(vars[k].child(0), document2))) {
        continue;
      }
      const nodeName = vars[k].child(0);
      if (nodeName) {
        if (node.child(2) !== null) {
          const args2 = (_a = vars[k].child(2)) == null ? void 0 : _a.children;
          if (args2) {
            let arity2 = get_arity(args2);
            this.registerfucntion(vars[k], convert(vars[k].grammarType), getName(vars[k].child(0), document2), arity2, root, get_range(nodeName));
          }
        } else {
          this.registerfucntion(vars[k], convert(vars[k].grammarType), getName(vars[k].child(0), document2), 0, root, get_range(nodeName));
        }
      }
    }
  }
  /* Same as above but for identifiers */
  registerident(ident, declaration, name2, context, range, type) {
    if (!ident) {
      return;
    }
    this.symbolTable.addSymbol({
      node: ident,
      declaration,
      name: name2,
      context,
      type,
      name_range: range
    });
  }
  registerfucntion(ident, declaration, name2, arity2, context, range) {
    if (!ident) {
      return;
    }
    this.symbolTable.addSymbol({
      node: ident,
      declaration,
      name: name2,
      arity: arity2,
      context,
      name_range: range
    });
  }
};
function set_associated_qf(symbol, node) {
  if (node) {
    symbol.associated_qf = node;
  }
}
var TamarinSymbolTable = class {
  constructor() {
    this.symbols = [];
  }
  addSymbol(symbol) {
    this.symbols.push(symbol);
  }
  getSymbols() {
    return this.symbols;
  }
  setSymbols(symbols) {
    this.symbols = symbols;
  }
  getSymbol(int) {
    return this.symbols[int];
  }
  setRootNodedocumentDiags(root, document2, diags) {
    this.root_node = root;
  }
  unshift(symbol) {
    this.symbols.unshift(symbol);
  }
  findSymbolByName(name2) {
    const primaryDeclarations = [
      "functions" /* Functions */,
      "rule" /* Rule */,
      "lemma" /* Lemma */,
      "restriction" /* Restriction */,
      "macro" /* Macro */
    ];
    let symbol = this.symbols.find(
      (s) => s.name === name2 && primaryDeclarations.includes(s.declaration)
    );
    if (symbol) {
      return symbol;
    }
    return this.symbols.find((s) => s.name === name2);
  }
};

// server/src/features/checks/checkVariableTypes.ts
function check_variables_type_is_consistent_inside_a_rule(symbol_table, editor) {
  const diags = [];
  for (let i2 = 0; i2 < symbol_table.getSymbols().length; i2++) {
    let current_symbol = symbol_table.getSymbol(i2);
    if (current_symbol.declaration === "premise_variable" /* PRVariable */ || current_symbol.declaration === "conclusion_variable" /* CCLVariable */ || current_symbol.declaration === "action_fact_variable" /* ActionFVariable */) {
      for (let j = 0; j < symbol_table.getSymbols().length; j++) {
        if ((current_symbol.declaration === "premise_variable" /* PRVariable */ || current_symbol.declaration === "conclusion_variable" /* CCLVariable */ || current_symbol.declaration === "action_fact_variable" /* ActionFVariable */) && i2 !== j) {
          if (current_symbol.context === symbol_table.getSymbol(j).context && current_symbol.name === symbol_table.getSymbol(j).name) {
            if (current_symbol.type === symbol_table.getSymbol(j).type) {
              continue;
            } else {
              const newDiag = build_error_display(current_symbol.node, editor, "Error: inconsistent variables, variables with the same name in the same rule must have same types ");
              diags.push(newDiag);
              break;
            }
          } else {
            continue;
          }
        } else {
          continue;
        }
      }
    } else if (current_symbol.declaration === "right_equation_variable" /* REquationVariable */) {
      let isbreak = false;
      for (let symbol of symbol_table.getSymbols()) {
        if (symbol.declaration === "left_equation_variable" /* LEquationVariable */ && symbol.name === current_symbol.name && symbol.context === current_symbol.context) {
          isbreak = true;
          break;
        }
      }
      if (!isbreak) {
        const newDiag = build_error_display(current_symbol.node, editor, "Error : this variable doesn't exist on the left side of the equation");
        diags.push(newDiag);
      }
    } else if (current_symbol.declaration === "right_macro_variable" /* RMacroVariable */) {
      let isbreak = false;
      if (current_symbol.type === "$") {
        continue;
      }
      for (let symbol of symbol_table.getSymbols()) {
        if (symbol.declaration === "left_macro_variable" /* LMacroVariable */ && symbol.name === current_symbol.name && symbol.context === current_symbol.context) {
          isbreak = true;
          break;
        }
      }
      if (!isbreak) {
        const newDiag = build_error_display(current_symbol.node, editor, "Error : this variable doesn't exist on the left side of the equation");
        diags.push(newDiag);
      }
    } else {
      continue;
    }
  }
  return diags;
}

// server/src/features/checks/checkVariableScope.ts
function check_variable_is_defined_in_premise(symbol_table, editor) {
  var _a, _b;
  const diags = [];
  for (let i2 = 0; i2 < symbol_table.getSymbols().length; i2++) {
    let current_symbol = symbol_table.getSymbol(i2);
    if (current_symbol.type === "$") {
      continue;
    }
    ;
    if (current_symbol.declaration === "conclusion_variable" /* CCLVariable */ || current_symbol.declaration === "action_fact_variable" /* ActionFVariable */) {
      let current_context = current_symbol.context;
      let is_break = false;
      for (let j = 0; j < symbol_table.getSymbols().length; j++) {
        let searched_symbol = symbol_table.getSymbol(j);
        if (j > i2) {
          break;
        }
        ;
        if (searched_symbol.context !== current_context || j == i2) {
          continue;
        } else {
          if (searched_symbol.name === current_symbol.name) {
            is_break = true;
            break;
          }
        }
      }
      if (!is_break) {
        diags.push(build_error_display(current_symbol.node, editor, "Error: this variable is used in the second part of the rule but doesn't appear in premise"));
      }
    } else if ((current_symbol.declaration === "linear_fact" /* LinearF */ || current_symbol.declaration === "persistent_fact" /* PersistentF */) && ((_a = current_symbol.node.parent) == null ? void 0 : _a.grammarType) === "premise" /* Premise */) {
      let isbreak = false;
      for (let symbol of symbol_table.getSymbols()) {
        if ((symbol.declaration === "linear_fact" /* LinearF */ || symbol.declaration === "persistent_fact" /* PersistentF */) && symbol.node.id !== current_symbol.node.id) {
          if (((_b = symbol.node.parent) == null ? void 0 : _b.grammarType) === "conclusion" /* Conclusion */ && symbol.name === current_symbol.name) {
            isbreak = true;
            break;
          }
        }
      }
      if (!isbreak) {
        diags.push(build_error_display(current_symbol.node, editor, "Error : fact occur in premise but never in any conclusion "));
      }
    }
  }
  return diags;
}

// server/src/features/checks/checkActionFacts.ts
function check_action_fact(symbol_table, editor) {
  var _a, _b;
  const diags = [];
  let actionFacts = [];
  let errors = [];
  for (let i2 = 0; i2 < symbol_table.getSymbols().length; i2++) {
    let current_symbol = symbol_table.getSymbol(i2);
    if (current_symbol.declaration === "action_fact" /* ActionF */ && ((_a = current_symbol.context) == null ? void 0 : _a.grammarType) !== "simple_rule") {
      let found_one = false;
      for (let j = 0; j < actionFacts.length; j++) {
        if (actionFacts[j].name === current_symbol.name) {
          found_one = true;
          if (!(actionFacts[j].arity === current_symbol.arity)) {
            if (current_symbol.name)
              errors.push(current_symbol.name);
          }
        } else {
          continue;
        }
      }
      if (!found_one) {
        diags.push(build_error_display(current_symbol.node, editor, "Error: this action fact is never declared"));
      }
    } else if (current_symbol.declaration === "action_fact" /* ActionF */ && ((_b = current_symbol.context) == null ? void 0 : _b.grammarType) === "simple_rule") {
      actionFacts.push(current_symbol);
    } else {
      continue;
    }
  }
  for (let symbol of symbol_table.getSymbols()) {
    if (symbol.name) {
      if (errors.includes(symbol.name)) {
        diags.push(build_error_display(symbol.node, editor, " Error : incoherent arity"));
      }
    }
  }
  return diags;
}

// server/src/features/checks/checkArity.ts
var import_vscode_languageserver3 = require("vscode-languageserver");
function check_function_macros_and_facts_arity(symbol_table, editor) {
  const diags = [];
  let known_functions = [];
  let errors = [];
  function getNames(list) {
    let str_list = [];
    for (let symbol of list) {
      if (symbol.name) {
        str_list.push(symbol.name);
      }
    }
    return str_list;
  }
  for (let i2 = 0; i2 < symbol_table.getSymbols().length; i2++) {
    let current_symbol = symbol_table.getSymbol(i2);
    if (symbol_table.getSymbol(i2).declaration === "linear_fact" /* LinearF */ || symbol_table.getSymbol(i2).declaration === "persistent_fact" /* PersistentF */ || symbol_table.getSymbol(i2).declaration === "functions" /* Functions */ || symbol_table.getSymbol(i2).declaration === "nary_app" /* NARY */ || symbol_table.getSymbol(i2).declaration === "macro" /* Macro */) {
      if (current_symbol.name) {
        if (getNames(known_functions).includes(current_symbol.name)) {
          for (let k = 0; k < known_functions.length; k++) {
            if (current_symbol.name === known_functions[k].name) {
              if (current_symbol.arity === known_functions[k].arity || current_symbol.arity === 0) {
                break;
              } else {
                if (current_symbol.declaration === "nary_app" /* NARY */) {
                  diags.push(build_error_display(current_symbol.node, editor, "Error : incorrect arity for this function, " + known_functions[k].arity + " arguments required"));
                } else if (current_symbol.declaration === "linear_fact" /* LinearF */ || current_symbol.declaration === "persistent_fact" /* PersistentF */) {
                  errors.push(current_symbol.name);
                } else if (current_symbol.declaration === "macro" /* Macro */) {
                  errors.push(current_symbol.name);
                }
              }
            } else {
              continue;
            }
          }
        } else {
          known_functions.push(current_symbol);
        }
      }
    }
  }
  for (let symbol of symbol_table.getSymbols()) {
    if (symbol.name) {
      if (errors.includes(symbol.name)) {
        diags.push(build_error_display(symbol.node, editor, " Error : incoherent arity"));
      }
    }
  }
  for (let symbol of known_functions) {
    let isbreak = false;
    if (symbol.declaration === "nary_app" /* NARY */) {
      for (let functionSymbol of known_functions) {
        if (functionSymbol.name === symbol.name && functionSymbol !== symbol) {
          isbreak = true;
          break;
        }
      }
      if (!isbreak) {
        diags.push(build_error_display(symbol.node, editor, "Error : unknown function or macro"));
        for (let functionSymbol of known_functions) {
          if (typeof symbol.name === "string" && typeof functionSymbol.name === "string" && symbol.name !== functionSymbol.name && symbol.arity === functionSymbol.arity) {
            const distance = levenshteinDistance(symbol.name, functionSymbol.name);
            if (distance < 3) {
              const diagnostic = {
                range: symbol.name_range,
                message: "Warning: did you mean " + functionSymbol.name + " ? (" + distance + " characters away)",
                severity: import_vscode_languageserver3.DiagnosticSeverity.Warning,
                source: "tamarin",
                code: "wrongFunctionName"
              };
              diags.push(diagnostic);
            }
          }
        }
      }
    }
  }
  return diags;
}

// server/src/features/checks/checkFreeTerms.ts
var Parser8 = require_tree_sitter();
function check_free_term_in_lemma(symbol_table, editor) {
  var _a, _b, _c, _d, _e;
  const diags = [];
  let lemma_vars = [];
  for (let symbol of symbol_table.getSymbols()) {
    if (symbol.declaration === "lemma_variable" /* LemmaVariable */ || symbol.declaration === "restriction_variable" /* RestrictionVariable */) {
      lemma_vars.push(symbol);
    }
  }
  for (let i2 = 0; i2 < lemma_vars.length; i2++) {
    if (((_a = lemma_vars[i2].node.parent) == null ? void 0 : _a.grammarType) === "quantified_formula" /* QF */) {
      set_associated_qf(lemma_vars[i2], lemma_vars[i2].node.parent);
      continue;
    }
    let context = lemma_vars[i2].context;
    let globalisbreak = false;
    while ((context == null ? void 0 : context.grammarType) !== "theory") {
      let context_child_id = [];
      if (context == null ? void 0 : context.children) {
        let search_context = context;
        let gt_list = get_child_grammar_type(search_context);
        while (((_b = search_context.child(0)) == null ? void 0 : _b.grammarType) === "conjunction" || ((_c = search_context.child(0)) == null ? void 0 : _c.grammarType) === "disjunction" || gt_list.includes("imp")) {
          if (gt_list.includes("imp")) {
            context_child_id.push(search_context.child(gt_list.indexOf("imp")).id);
            search_context = search_context.child(gt_list.indexOf("imp"));
            gt_list = get_child_grammar_type(search_context);
          } else if (search_context.child(0)) {
            context_child_id.push(search_context.child(0).id);
            search_context = search_context.child(0);
            gt_list = get_child_grammar_type(search_context);
          }
        }
        if (search_context.grammarType === "lemma" /* Lemma */ || search_context.grammarType === "restriction" /* Restriction */ || search_context.grammarType === "diff_lemma") {
          set_associated_qf(lemma_vars[i2], search_context.child(4));
        } else if (search_context.grammarType === "nested_formula" /* NF */) {
          set_associated_qf(lemma_vars[i2], search_context.child(1));
        } else {
          set_associated_qf(lemma_vars[i2], search_context.child(0));
        }
      }
      let isbreak = false;
      for (let j = 0; j < lemma_vars.length; j++) {
        if ((((_d = lemma_vars[j].context) == null ? void 0 : _d.id) === (context == null ? void 0 : context.id) || context_child_id.includes(lemma_vars[j].context.id)) && ((_e = lemma_vars[j].node.parent) == null ? void 0 : _e.grammarType) === "quantified_formula" /* QF */ && lemma_vars[j].name === lemma_vars[i2].name) {
          isbreak = true;
          break;
        }
      }
      if (isbreak) {
        globalisbreak = true;
        break;
      } else {
        if (context == null ? void 0 : context.parent) {
          context = context == null ? void 0 : context.parent;
        }
      }
    }
    if (!globalisbreak) {
      diags.push(build_warning_display(lemma_vars[i2].node, editor, "Warning : free term in lemma or restriction formula"));
    }
  }
  return diags;
}

// server/src/features/checks/checkMacrosInEquations.ts
function check_macro_not_in_equation(symbol_table, editor) {
  const diags = [];
  for (let symbol of symbol_table.getSymbols()) {
    if (symbol.declaration === "nary_app" /* NARY */) {
      for (let macros of symbol_table.getSymbols()) {
        if (macros.declaration === "macro" /* Macro */ && macros.name === symbol.name && symbol.context.grammarType === "equation" /* Equation */) {
          diags.push(build_error_display(symbol.node, editor, "Error : a macro shoud not be used in an equation "));
        }
      }
    }
  }
  return diags;
}

// server/src/features/checks/checkInfixOperators.ts
var import_vscode_languageserver4 = require("vscode-languageserver");
var Parser9 = require_tree_sitter();
function return_builtins(symbol_table) {
  let builtins = [];
  for (let symbol of symbol_table.getSymbols()) {
    if (symbol.declaration === "built_in" /* Builtin */) {
      builtins.push(symbol);
    }
  }
  return builtins;
}
function get_builtins_name(builtins) {
  let Sbuiltins = [];
  for (let builtin of builtins) {
    if (builtin.name)
      Sbuiltins.push(builtin.name);
  }
  return Sbuiltins;
}
function return_functions(symbol_table) {
  let builtins = [];
  for (let symbol of symbol_table.getSymbols()) {
    if (symbol.declaration === "functions" /* Functions */ && symbol.name) {
      builtins.push(symbol.name);
    }
  }
  return builtins;
}
function check_infix_operators(symbol_table, editor, root) {
  const diags = [];
  function display_infix_error(builtin, symbol, child) {
    let current_builtins = return_builtins(symbol_table);
    let current_functions = return_functions(symbol_table);
    if (!get_builtins_name(current_builtins).includes(builtin) && !current_functions.includes(getName(child.child(0), editor))) {
      if (current_builtins.length > 0) {
        const diagnostic = {
          range: current_builtins[current_builtins.length - 1].name_range,
          message: "Error : symbol " + symbol + " cannot be used without " + builtin + " builtin",
          severity: import_vscode_languageserver4.DiagnosticSeverity.Warning,
          source: "tamarin",
          code: "missingBuiltin"
        };
        diags.push(diagnostic);
      } else {
        let theory = root;
        while (theory.grammarType !== "theory") {
          if (theory.parent)
            theory = theory.parent;
        }
        theory = theory.child(3);
        const range = import_vscode_languageserver4.Range.create(
          editor.positionAt(theory.startIndex),
          editor.positionAt(theory.endIndex)
        );
      }
    }
  }
  for (let child of root.children) {
    if (child.grammarType === "^" || child.grammarType === "*") {
      let current_builtins = return_builtins(symbol_table);
      if (!get_builtins_name(current_builtins).includes("diffie-hellman")) {
        display_infix_error("diffie-hellman", "^ or *", child);
      }
    } else if (child.grammarType === "\u2295") {
      display_infix_error("xor", "\u2295", child);
      ;
    } else if (child.grammarType === "++") {
      display_infix_error("multiset", "++", child);
      ;
    } else if (child.grammarType === "%+") {
      display_infix_error("natural-numbers", "%+", child);
    } else if (child.grammarType === "nary_app" /* NARY */) {
      if (getName(child.child(0), editor) === "inv") {
        display_infix_error("diffie-hellman", "inv", child);
      } else if (getName(child.child(0), editor) === "h") {
        display_infix_error("hashing", "h", child);
      } else if (getName(child.child(0), editor) === "sdec" || getName(child.child(0), editor) === "senc") {
        display_infix_error("symmetric-encryption", "sdec or senc", child);
      } else if (getName(child.child(0), editor) === "adec" || getName(child.child(0), editor) === "aenc") {
        display_infix_error("asymmetric-encryption", "adec or aenc", child);
      } else if (getName(child.child(0), editor) === "sign" || getName(child.child(0), editor) === "verify") {
        display_infix_error("signing", "sign or verify", child);
      } else if (getName(child.child(0), editor) === "revealSign" || getName(child.child(0), editor) === "revealVerify" || getName(child.child(0), editor) === "getMessage") {
        display_infix_error("revealing-signing", "revealSign or revealVerify or getMessage", child);
      } else if (getName(child.child(0), editor) === "pmult" || getName(child.child(0), editor) === "em") {
        display_infix_error("bilinear-pairing", "pmult or em", child);
      } else if (getName(child.child(0), editor) === "XOR") {
        display_infix_error("xor", "XOR", child);
      }
    } else check_infix_operators(symbol_table, editor, child);
  }
  return diags;
}

// server/src/features/checks/checkSpelling.ts
var import_vscode_languageserver5 = require("vscode-languageserver");
function check_case_sensitivity(symbol_table, editor) {
  var _a, _b;
  const diags = [];
  const facts = [];
  let count = 0;
  for (let i2 = 0; i2 < symbol_table.getSymbols().length; i2++) {
    let current_symbol = symbol_table.getSymbol(i2);
    if (current_symbol.declaration === "linear_fact" /* LinearF */ || current_symbol.declaration === "persistent_fact" /* PersistentF */ || current_symbol.declaration === "action_fact" /* ActionF */) {
      const name2 = current_symbol.name;
      if (name2) {
        if (!(name2.charCodeAt(0) >= 65 && name2.charCodeAt(0) <= 90)) {
          const newDiag = build_error_display(current_symbol.node, editor, "Error: facts must start with an uppercase");
          diags.push(newDiag);
        }
        if (current_symbol.declaration === "action_fact" /* ActionF */ && ((_a = current_symbol.context) == null ? void 0 : _a.grammarType) === "simple_rule") {
          facts.push(current_symbol.name);
          continue;
        }
        if ((current_symbol.declaration === "linear_fact" /* LinearF */ || current_symbol.declaration === "persistent_fact" /* PersistentF */) && ((_b = current_symbol.node.parent) == null ? void 0 : _b.grammarType) === "conclusion" /* Conclusion */) {
          facts.push(current_symbol.name);
          continue;
        }
        for (let j = 0; j < facts.length; j++) {
          const name22 = facts[j];
          if (name22) {
            if (name22 === name2 && i2 !== j) {
              continue;
            }
            const distance = levenshteinDistance(name2, name22);
            if (distance < 3 && !facts.includes(current_symbol.name)) {
              const start2 = editor.positionAt(current_symbol.node.startIndex);
              const end = editor.positionAt(current_symbol.node.endIndex > current_symbol.node.startIndex ? current_symbol.node.endIndex : current_symbol.node.startIndex + 1);
              const diagnostic = {
                range: import_vscode_languageserver5.Range.create(start2, end),
                message: "Warning: did you mean " + name22 + " ? (" + distance + " characters away)",
                severity: import_vscode_languageserver5.DiagnosticSeverity.Warning,
                source: "tamarin",
                code: "wrongFactName"
              };
              diags.push(diagnostic);
              count++;
            }
          }
        }
      }
    }
    if (count > 0) {
      break;
    }
  }
  ;
  return diags;
}

// server/src/features/checks/index.ts
var Parser10 = require_tree_sitter();
function checks_with_table(symbol_table, document2, root) {
  const typeErrors = check_variables_type_is_consistent_inside_a_rule(symbol_table, document2);
  const premiseErrors = check_variable_is_defined_in_premise(symbol_table, document2);
  const actionFactErrors = check_action_fact(symbol_table, document2);
  const arityErrors = check_function_macros_and_facts_arity(symbol_table, document2);
  const freeTermWarnings = check_free_term_in_lemma(symbol_table, document2);
  const macroInEquationErrors = check_macro_not_in_equation(symbol_table, document2);
  const infixOperatorErrors = check_infix_operators(symbol_table, document2, root);
  const spellingWarnings = check_case_sensitivity(symbol_table, document2);
  const allDiagnostics = [
    ...typeErrors,
    ...premiseErrors,
    ...actionFactErrors,
    ...arityErrors,
    ...freeTermWarnings,
    ...macroInEquationErrors,
    ...infixOperatorErrors,
    ...spellingWarnings
  ];
  return allDiagnostics;
}

// server/src/AnalysisManager.ts
var Parser11 = require_tree_sitter();
var path = require("path");
var AnalysisManager = class {
  constructor() {
    this.symbolTable = /* @__PURE__ */ new Map();
  }
  async initParser() {
    await Parser11.init();
    this.parser = new Parser11();
    const parserPath = path.join(__dirname, "tree-sitter-spthy.wasm");
    const Tamarin = await Parser11.Language.load(parserPath);
    this.parser.setLanguage(Tamarin);
    console.log("Parser initialized with Tamarin language.");
  }
  //error and warning display
  async AnalyseDocument(document2) {
    if (!this.parser) {
      throw new Error("Parser not initialized");
    }
    const tree = this.parser.parse(document2.getText());
    const { diagnostics: syntaxDiagnostics } = await detect_errors(tree.rootNode, document2);
    const { symbolTable, diags: symbolTableChecks } = await createSymbolTable(tree.rootNode, document2);
    this.symbolTable.set(document2.uri, symbolTable);
    const wellformednessDiagnostics = await checks_with_table(symbolTable, document2, tree.rootNode);
    console.log("Symbol table created for:", document2.uri);
    console.log("Number of symbols found:", symbolTable.getSymbols().length);
    console.log("Wellformedness diagnostics:", wellformednessDiagnostics.length);
    const allDiagnostics = [
      ...syntaxDiagnostics,
      ...wellformednessDiagnostics,
      ...symbolTableChecks
    ];
    return allDiagnostics;
  }
  //goto
  getDefinition(document2, position) {
    if (!this.parser) {
      throw new Error("Parser not initialized");
      return null;
    }
    const table = this.symbolTable.get(document2.uri);
    if (!table) {
      console.error(`No symbol table found for document: ${document2.uri}`);
      return null;
    }
    const tree = this.parser.parse(document2.getText());
    const point = { row: position.line, column: position.character };
    const nodeAtcursor = tree.rootNode.descendantForPosition(point);
    if (!nodeAtcursor) {
      console.error(`No node found at position: ${point.row}, ${point.column}`);
      return null;
    }
    const symbolName = nodeAtcursor.text;
    console.error('[Server] Looking for symbol "${symbolName}" in symbol table.');
    const symbol = table.getSymbols().find((sym) => sym.name === symbolName);
    if (symbol && symbol.name_range) {
      console.error(`[Server] getDefinition: Found symbol definition for "${symbol.name}".`);
      const location = {
        uri: document2.uri,
        range: symbol.name_range
      };
      return location;
    }
    console.error(`[Server] getDefinition: Symbol "${symbolName}" not found in symbol table.`);
    return null;
  }
  handleDocumentClose(uri) {
    console.log(`Document closed: ${uri}. Cleaning up symbol table.`);
    this.symbolTable.delete(uri);
  }
  //rename
  handleRenameRequest(document2, position, newName) {
    var _a, _b;
    const table = this.symbolTable.get(document2.uri);
    if (!table) return null;
    if (!this.parser) {
      throw new Error("Parser not initialized");
    }
    const tree = this.parser.parse(document2.getText());
    const point = { row: position.line, column: position.character };
    const nodeAtCursor = tree.rootNode.descendantForPosition(point);
    if (!nodeAtCursor) {
      console.error(`No node found at position: ${point.row}, ${point.column}`);
      return null;
    }
    const oldname = tree.rootNode.namedDescendantForPosition(point).text;
    console.error(oldname);
    const originalSymbol = table.getSymbols().find(
      (symbol) => symbol.name === oldname && symbol.name_range && symbol.name_range.start.line === position.line && symbol.name_range.start.character === position.character
    );
    console.error(`[Server] handleRenameRequest: Looking for symbol at position ${position.line}:${position.character}.`);
    console.error(`[Server] handleRenameRequest: Original symbol found: ${originalSymbol ? originalSymbol.name : "none"}.`);
    if (!originalSymbol) return null;
    const edits = [];
    const chosenSymbolName = originalSymbol.name;
    for (const symbol of table.getSymbols()) {
      console.error(symbol.name);
      let shouldRename = false;
      if (symbol.declaration === "premise_variable" /* PRVariable */ || symbol.declaration === "action_fact_variable" /* ActionFVariable */ || symbol.declaration === "conclusion_variable" /* CCLVariable */) {
        if (originalSymbol.context === symbol.context && chosenSymbolName === symbol.name) {
          shouldRename = true;
        }
      } else if (symbol.declaration === "lemma_variable" /* LemmaVariable */) {
        if (((_a = symbol.associated_qf) == null ? void 0 : _a.id) === ((_b = originalSymbol.associated_qf) == null ? void 0 : _b.id) && symbol.name === chosenSymbolName) {
          shouldRename = true;
        }
      } else if (symbol.declaration === "left_equation_variable" /* LEquationVariable */ || symbol.declaration === "right_equation_variable" /* REquationVariable */ || symbol.declaration === "left_macro_variable" /* LMacroVariable */ || symbol.declaration === "right_macro_variable" /* RMacroVariable */) {
        if (originalSymbol.context.id === symbol.context.id && chosenSymbolName === symbol.name) {
          shouldRename = true;
        }
      } else if (symbol.name === chosenSymbolName && symbol.declaration === originalSymbol.declaration) {
        shouldRename = true;
      }
      console.error(shouldRename);
      if (shouldRename) {
        if (symbol.name_range) {
          edits.push(TextEdit.replace(symbol.name_range, newName));
        }
      }
    }
    console.error(edits);
    if (edits.length === 0) {
      return null;
    }
    const workspaceEdit = {
      changes: {
        [document2.uri]: edits
      }
    };
    return workspaceEdit;
  }
};

// server/src/server.ts
console.error("[Server] Tamarin Language Server starting...");
var connection = (0, import_node.createConnection)(import_node.ProposedFeatures.all);
var documents = new import_node.TextDocuments(import_vscode_languageserver_textdocument.TextDocument);
var analysisManager;
connection.onInitialize(async (params) => {
  analysisManager = new AnalysisManager();
  console.error('[Server] Received "initialize" request from client.');
  const capabilities = {
    textDocumentSync: import_node.TextDocumentSyncKind.Full,
    definitionProvider: true,
    renameProvider: true
  };
  console.error("[Server] Sending server capabilities back.");
  return { capabilities };
});
connection.onInitialized(() => {
  console.error('[Server] Received "initialized" notification. Handshake complete!');
});
documents.onDidChangeContent(async (change) => {
  console.error(`[Server] File changed: ${change.document.uri}. Triggering validation.`);
  const diagnostics = await analysisManager.AnalyseDocument(change.document);
  connection.sendDiagnostics({ uri: change.document.uri, diagnostics });
  console.error(`[Server] Diagnostics sent for ${change.document.uri}.`);
});
connection.onDefinition(
  (params) => {
    if (!analysisManager) return null;
    console.error(`[Server] Received 'onDefinition' request for ${params.textDocument.uri}.`);
    const document2 = documents.get(params.textDocument.uri);
    if (!document2) {
      console.error(`[Server] Document not found: ${params.textDocument.uri}`);
      return null;
    }
    return analysisManager.getDefinition(document2, params.position);
  }
);
connection.onRenameRequest(async (params) => {
  if (!analysisManager) {
    return null;
  }
  console.error(`[Server] Received 'onRenameRequest' for ${params.textDocument.uri} at position ${params.position.line}:${params.position.character}.`);
  const document2 = documents.get(params.textDocument.uri);
  if (!document2) {
    console.error(`[Server] Document not found: ${params.textDocument.uri}`);
    return null;
  }
  return analysisManager.handleRenameRequest(document2, params.position, params.newName);
});
documents.onDidClose((event) => {
  console.error(`[Server] Document closed: ${event.document.uri}. Cleaning up state.`);
  if (analysisManager) {
    analysisManager.handleDocumentClose(event.document.uri);
  }
});
documents.listen(connection);
connection.listen();
//# sourceMappingURL=server.js.map
