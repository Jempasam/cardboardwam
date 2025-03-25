var Y = class {
  static get isWebAudioModuleConstructor() {
    return !0;
  }
  static createInstance(c, t, i) {
    return new this(c, t).initialize(i);
  }
  constructor(c, t) {
    this._groupId = c, this._audioContext = t, this._initialized = !1, this._audioNode = void 0, this._timestamp = performance.now(), this._guiModuleUrl = void 0, this._descriptorUrl = "./descriptor.json", this._descriptor = {
      identifier: "com.webaudiomodule.default",
      name: `WebAudioModule_${this.constructor.name}`,
      vendor: "WebAudioModuleVendor",
      description: "",
      version: "0.0.0",
      apiVersion: "2.0.0",
      thumbnail: "",
      keywords: [],
      isInstrument: !1,
      website: "",
      hasAudioInput: !0,
      hasAudioOutput: !0,
      hasAutomationInput: !0,
      hasAutomationOutput: !0,
      hasMidiInput: !0,
      hasMidiOutput: !0,
      hasMpeInput: !0,
      hasMpeOutput: !0,
      hasOscInput: !0,
      hasOscOutput: !0,
      hasSysexInput: !0,
      hasSysexOutput: !0
    };
  }
  get isWebAudioModule() {
    return !0;
  }
  get groupId() {
    return this._groupId;
  }
  get moduleId() {
    return this.descriptor.identifier;
  }
  get instanceId() {
    return this.moduleId + this._timestamp;
  }
  get descriptor() {
    return this._descriptor;
  }
  get identifier() {
    return this.descriptor.identifier;
  }
  get name() {
    return this.descriptor.name;
  }
  get vendor() {
    return this.descriptor.vendor;
  }
  get audioContext() {
    return this._audioContext;
  }
  get audioNode() {
    return this.initialized || console.warn("WAM should be initialized before getting the audioNode"), this._audioNode;
  }
  set audioNode(c) {
    this._audioNode = c;
  }
  get initialized() {
    return this._initialized;
  }
  set initialized(c) {
    this._initialized = c;
  }
  async createAudioNode(c) {
    throw new TypeError("createAudioNode() not provided");
  }
  async initialize(c) {
    return this._audioNode || (this.audioNode = await this.createAudioNode()), this.initialized = !0, this;
  }
  async _loadGui() {
    const c = this._guiModuleUrl;
    if (!c)
      throw new TypeError("Gui module not found");
    return import(
      /* webpackIgnore: true */
      c
    );
  }
  async _loadDescriptor() {
    const c = this._descriptorUrl;
    if (!c)
      throw new TypeError("Descriptor not found");
    const i = await (await fetch(c)).json();
    return Object.assign(this._descriptor, i), this._descriptor;
  }
  async createGui() {
    if (this.initialized || console.warn("Plugin should be initialized before getting the gui"), !this._guiModuleUrl)
      return;
    const { createElement: c } = await this._loadGui();
    return c(this);
  }
  destroyGui() {
  }
}, J = Y, X = (c) => {
  const t = globalThis;
  class i {
    static getStorageForCapacity(e, s) {
      if (!s.BYTES_PER_ELEMENT)
        throw new Error("Pass in a ArrayBuffer subclass");
      const n = 8 + (e + 1) * s.BYTES_PER_ELEMENT;
      return new SharedArrayBuffer(n);
    }
    constructor(e, s) {
      if (!s.BYTES_PER_ELEMENT)
        throw new Error("Pass a concrete typed array class as second argument");
      this._Type = s, this._capacity = (e.byteLength - 8) / s.BYTES_PER_ELEMENT, this.buf = e, this.write_ptr = new Uint32Array(this.buf, 0, 1), this.read_ptr = new Uint32Array(this.buf, 4, 1), this.storage = new s(this.buf, 8, this._capacity);
    }
    get type() {
      return this._Type.name;
    }
    push(e) {
      const s = Atomics.load(this.read_ptr, 0), n = Atomics.load(this.write_ptr, 0);
      if ((n + 1) % this._storageCapacity() === s)
        return 0;
      const a = Math.min(this._availableWrite(s, n), e.length), r = Math.min(this._storageCapacity() - n, a), u = a - r;
      return this._copy(e, 0, this.storage, n, r), this._copy(e, r, this.storage, 0, u), Atomics.store(this.write_ptr, 0, (n + a) % this._storageCapacity()), a;
    }
    pop(e) {
      const s = Atomics.load(this.read_ptr, 0), n = Atomics.load(this.write_ptr, 0);
      if (n === s)
        return 0;
      const a = !Number.isInteger(e), r = Math.min(this._availableRead(s, n), a ? e.length : e);
      if (a) {
        const u = Math.min(this._storageCapacity() - s, r), m = r - u;
        this._copy(this.storage, s, e, 0, u), this._copy(this.storage, 0, e, u, m);
      }
      return Atomics.store(this.read_ptr, 0, (s + r) % this._storageCapacity()), r;
    }
    get empty() {
      const e = Atomics.load(this.read_ptr, 0);
      return Atomics.load(this.write_ptr, 0) === e;
    }
    get full() {
      const e = Atomics.load(this.read_ptr, 0);
      return (Atomics.load(this.write_ptr, 0) + 1) % this._capacity !== e;
    }
    get capacity() {
      return this._capacity - 1;
    }
    get availableRead() {
      const e = Atomics.load(this.read_ptr, 0), s = Atomics.load(this.write_ptr, 0);
      return this._availableRead(e, s);
    }
    get availableWrite() {
      const e = Atomics.load(this.read_ptr, 0), s = Atomics.load(this.write_ptr, 0);
      return this._availableWrite(e, s);
    }
    _availableRead(e, s) {
      return s > e ? s - e : s + this._storageCapacity() - e;
    }
    _availableWrite(e, s) {
      let n = e - s - 1;
      return s >= e && (n += this._storageCapacity()), n;
    }
    _storageCapacity() {
      return this._capacity;
    }
    _copy(e, s, n, a, r) {
      for (let u = 0; u < r; u++)
        n[a + u] = e[s + u];
    }
  }
  if (t.AudioWorkletProcessor) {
    const _ = t.webAudioModules.getModuleScope(c);
    _.RingBuffer || (_.RingBuffer = i);
  }
  return i;
}, j = X, Z = (c) => {
  const t = globalThis;
  class i {
    static DefaultArrayCapacity = 2;
    static getStorageForEventCapacity(e, s, n, a = void 0) {
      if (a === void 0 ? a = i.DefaultArrayCapacity : a = Math.max(a, i.DefaultArrayCapacity), !n.BYTES_PER_ELEMENT)
        throw new Error("Pass in a ArrayBuffer subclass");
      const r = s * a;
      return e.getStorageForCapacity(r, n);
    }
    constructor(e, s, n, a, r = void 0) {
      if (!a.BYTES_PER_ELEMENT)
        throw new Error("Pass in a ArrayBuffer subclass");
      this._arrayLength = n, this._arrayType = a, this._arrayElementSizeBytes = a.BYTES_PER_ELEMENT, this._arraySizeBytes = this._arrayLength * this._arrayElementSizeBytes, this._sab = s, r === void 0 ? r = i.DefaultArrayCapacity : r = Math.max(r, i.DefaultArrayCapacity), this._arrayArray = new a(this._arrayLength), this._rb = new e(this._sab, a);
    }
    write(e) {
      if (e.length !== this._arrayLength || this._rb.availableWrite < this._arrayLength)
        return !1;
      let n = !0;
      return this._rb.push(e) != this._arrayLength && (n = !1), n;
    }
    read(e, s) {
      if (e.length !== this._arrayLength)
        return !1;
      const n = this._rb.availableRead;
      if (n < this._arrayLength)
        return !1;
      s && n > this._arrayLength && this._rb.pop(n - this._arrayLength);
      let a = !1;
      return this._rb.pop(e) === this._arrayLength && (a = !0), a;
    }
  }
  if (t.AudioWorkletProcessor) {
    const _ = t.webAudioModules.getModuleScope(c);
    _.WamArrayRingBuffer || (_.WamArrayRingBuffer = i);
  }
  return i;
}, ee = Z, te = (c) => {
  const t = globalThis;
  class i {
    static DefaultExtraBytesPerEvent = 64;
    static WamEventBaseBytes = 13;
    static WamAutomationEventBytes = i.WamEventBaseBytes + 2 + 8 + 1;
    static WamTransportEventBytes = i.WamEventBaseBytes + 4 + 8 + 8 + 1 + 1 + 1;
    static WamMidiEventBytes = i.WamEventBaseBytes + 1 + 1 + 1;
    static WamBinaryEventBytes = i.WamEventBaseBytes + 4;
    static getStorageForEventCapacity(e, s, n = void 0) {
      n === void 0 ? n = i.DefaultExtraBytesPerEvent : n = Math.max(n, i.DefaultExtraBytesPerEvent);
      const a = (Math.max(i.WamAutomationEventBytes, i.WamTransportEventBytes, i.WamMidiEventBytes, i.WamBinaryEventBytes) + n) * s;
      return e.getStorageForCapacity(a, Uint8Array);
    }
    constructor(e, s, n, a = void 0) {
      this._eventSizeBytes = {}, this._encodeEventType = {}, this._decodeEventType = {}, ["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc", "wam-info"].forEach((u, m) => {
        let o = 0;
        switch (u) {
          case "wam-automation":
            o = i.WamAutomationEventBytes;
            break;
          case "wam-transport":
            o = i.WamTransportEventBytes;
            break;
          case "wam-mpe":
          case "wam-midi":
            o = i.WamMidiEventBytes;
            break;
          case "wam-osc":
          case "wam-sysex":
          case "wam-info":
            o = i.WamBinaryEventBytes;
            break;
        }
        this._eventSizeBytes[u] = o, this._encodeEventType[u] = m, this._decodeEventType[m] = u;
      }), this._parameterCode = 0, this._parameterCodes = {}, this._encodeParameterId = {}, this._decodeParameterId = {}, this.setParameterIds(n), this._sab = s, a === void 0 ? a = i.DefaultExtraBytesPerEvent : a = Math.max(a, i.DefaultExtraBytesPerEvent), this._eventBytesAvailable = Math.max(i.WamAutomationEventBytes, i.WamTransportEventBytes, i.WamMidiEventBytes, i.WamBinaryEventBytes) + a, this._eventBytes = new ArrayBuffer(this._eventBytesAvailable), this._eventBytesView = new DataView(this._eventBytes), this._rb = new e(this._sab, Uint8Array), this._eventSizeArray = new Uint8Array(this._eventBytes, 0, 4), this._eventSizeView = new DataView(this._eventBytes, 0, 4);
    }
    _writeHeader(e, s, n) {
      let a = 0;
      return this._eventBytesView.setUint32(a, e), a += 4, this._eventBytesView.setUint8(a, this._encodeEventType[s]), a += 1, this._eventBytesView.setFloat64(a, Number.isFinite(n) ? n : -1), a += 8, a;
    }
    _encode(e) {
      let s = 0;
      const { type: n, time: a } = e;
      switch (e.type) {
        case "wam-automation":
          {
            if (!(e.data.id in this._encodeParameterId))
              break;
            const r = this._eventSizeBytes[n];
            s = this._writeHeader(r, n, a);
            const { data: u } = e, m = this._encodeParameterId[u.id], { value: o, normalized: p } = u;
            this._eventBytesView.setUint16(s, m), s += 2, this._eventBytesView.setFloat64(s, o), s += 8, this._eventBytesView.setUint8(s, p ? 1 : 0), s += 1;
          }
          break;
        case "wam-transport":
          {
            const r = this._eventSizeBytes[n];
            s = this._writeHeader(r, n, a);
            const { data: u } = e, {
              currentBar: m,
              currentBarStarted: o,
              tempo: p,
              timeSigNumerator: l,
              timeSigDenominator: h,
              playing: d
            } = u;
            this._eventBytesView.setUint32(s, m), s += 4, this._eventBytesView.setFloat64(s, o), s += 8, this._eventBytesView.setFloat64(s, p), s += 8, this._eventBytesView.setUint8(s, l), s += 1, this._eventBytesView.setUint8(s, h), s += 1, this._eventBytesView.setUint8(s, d ? 1 : 0), s += 1;
          }
          break;
        case "wam-mpe":
        case "wam-midi":
          {
            const r = this._eventSizeBytes[n];
            s = this._writeHeader(r, n, a);
            const { data: u } = e, { bytes: m } = u;
            let o = 0;
            for (; o < 3; )
              this._eventBytesView.setUint8(s, m[o]), s += 1, o++;
          }
          break;
        case "wam-osc":
        case "wam-sysex":
        case "wam-info":
          {
            let r = null;
            if (e.type === "wam-info") {
              const { data: l } = e;
              r = new TextEncoder().encode(l.instanceId);
            } else {
              const { data: l } = e;
              r = l.bytes;
            }
            const u = r.length, m = this._eventSizeBytes[n];
            s = this._writeHeader(m + u, n, a), this._eventBytesView.setUint32(s, u), s += 4;
            const o = s + u;
            o > this._eventBytesAvailable && console.error(`Event requires ${o} bytes but only ${this._eventBytesAvailable} have been allocated!`), new Uint8Array(this._eventBytes, s, u).set(r), s += u;
          }
          break;
      }
      return new Uint8Array(this._eventBytes, 0, s);
    }
    _decode() {
      let e = 0;
      const s = this._decodeEventType[this._eventBytesView.getUint8(e)];
      e += 1;
      let n = this._eventBytesView.getFloat64(e);
      switch (n === -1 && (n = void 0), e += 8, s) {
        case "wam-automation": {
          const a = this._eventBytesView.getUint16(e);
          e += 2;
          const r = this._eventBytesView.getFloat64(e);
          e += 8;
          const u = !!this._eventBytesView.getUint8(e);
          if (e += 1, !(a in this._decodeParameterId))
            break;
          const m = this._decodeParameterId[a];
          return {
            type: s,
            time: n,
            data: {
              id: m,
              value: r,
              normalized: u
            }
          };
        }
        case "wam-transport": {
          const a = this._eventBytesView.getUint32(e);
          e += 4;
          const r = this._eventBytesView.getFloat64(e);
          e += 8;
          const u = this._eventBytesView.getFloat64(e);
          e += 8;
          const m = this._eventBytesView.getUint8(e);
          e += 1;
          const o = this._eventBytesView.getUint8(e);
          e += 1;
          const p = this._eventBytesView.getUint8(e) == 1;
          return e += 1, {
            type: s,
            time: n,
            data: {
              currentBar: a,
              currentBarStarted: r,
              tempo: u,
              timeSigNumerator: m,
              timeSigDenominator: o,
              playing: p
            }
          };
        }
        case "wam-mpe":
        case "wam-midi": {
          const a = [0, 0, 0];
          let r = 0;
          for (; r < 3; )
            a[r] = this._eventBytesView.getUint8(e), e += 1, r++;
          return {
            type: s,
            time: n,
            data: { bytes: a }
          };
        }
        case "wam-osc":
        case "wam-sysex":
        case "wam-info": {
          const a = this._eventBytesView.getUint32(e);
          e += 4;
          const r = new Uint8Array(a);
          if (r.set(new Uint8Array(this._eventBytes, e, a)), e += a, s === "wam-info") {
            const m = { instanceId: new TextDecoder().decode(r) };
            return { type: s, time: n, data: m };
          } else
            return { type: s, time: n, data: { bytes: r } };
        }
      }
      return !1;
    }
    write(...e) {
      const s = e.length;
      let n = this._rb.availableWrite, a = 0, r = 0;
      for (; r < s; ) {
        const u = e[r], m = this._encode(u), o = m.byteLength;
        let p = 0;
        if (n >= o)
          o === 0 ? a++ : p = this._rb.push(m);
        else
          break;
        n -= p, r++;
      }
      return r - a;
    }
    read() {
      if (this._rb.empty)
        return [];
      const e = [];
      let s = this._rb.availableRead, n = 0;
      for (; s > 0; ) {
        n = this._rb.pop(this._eventSizeArray), s -= n;
        const a = this._eventSizeView.getUint32(0), r = new Uint8Array(this._eventBytes, 0, a - 4);
        n = this._rb.pop(r), s -= n;
        const u = this._decode();
        u && e.push(u);
      }
      return e;
    }
    setParameterIds(e) {
      this._encodeParameterId = {}, this._decodeParameterId = {}, e.forEach((s) => {
        let n = -1;
        s in this._parameterCodes ? n = this._parameterCodes[s] : (n = this._generateParameterCode(), this._parameterCodes[s] = n), this._encodeParameterId[s] = n, this._decodeParameterId[n] = s;
      });
    }
    _generateParameterCode() {
      if (this._parameterCode > 65535)
        throw Error("Too many parameters have been registered!");
      return this._parameterCode++;
    }
  }
  if (t.AudioWorkletProcessor) {
    const _ = t.webAudioModules.getModuleScope(c);
    _.WamEventRingBuffer || (_.WamEventRingBuffer = i);
  }
  return i;
}, F = te, se = (c, t, ...i) => {
  const _ = `(${t.toString()})(${i.map((s) => JSON.stringify(s)).join(", ")});`, e = URL.createObjectURL(new Blob([_], { type: "text/javascript" }));
  return c.addModule(e);
}, I = se, ie = (c) => {
  const t = globalThis;
  class i {
    constructor(e) {
      this.info = e, this._value = e.defaultValue;
    }
    set value(e) {
      this._value = e;
    }
    get value() {
      return this._value;
    }
    set normalizedValue(e) {
      this.value = this.info.denormalize(e);
    }
    get normalizedValue() {
      return this.info.normalize(this.value);
    }
  }
  if (t.AudioWorkletProcessor) {
    const _ = t.webAudioModules.getModuleScope(c);
    _.WamParameter || (_.WamParameter = i);
  }
  return i;
}, ae = ie, ne = (c) => {
  const t = globalThis, i = (r, u) => u === 0 ? r : r ** 1.5 ** -u, _ = (r, u) => u === 0 ? r : r ** 1.5 ** u, e = (r, u, m, o = 0) => i(u === 0 && m === 1 ? r : (r - u) / (m - u) || 0, o), s = (r, u, m, o = 0) => u === 0 && m === 1 ? _(r, o) : _(r, o) * (m - u) + u, n = (r, u, m) => r >= u && r <= m;
  class a {
    constructor(u, m = {}) {
      let {
        type: o,
        label: p,
        defaultValue: l,
        minValue: h,
        maxValue: d,
        discreteStep: g,
        exponent: w,
        choices: v,
        units: f
      } = m;
      o === void 0 && (o = "float"), p === void 0 && (p = ""), l === void 0 && (l = 0), v === void 0 && (v = []), o === "boolean" || o === "choice" ? (g = 1, h = 0, v.length ? d = v.length - 1 : d = 1) : (h === void 0 && (h = 0), d === void 0 && (d = 1), g === void 0 && (g = 0), w === void 0 && (w = 0), f === void 0 && (f = ""));
      const y = `Param config error | ${u}: `;
      if (h >= d)
        throw Error(y.concat("minValue must be less than maxValue"));
      if (!n(l, h, d))
        throw Error(y.concat("defaultValue out of range"));
      if (g % 1 || g < 0)
        throw Error(y.concat("discreteStep must be a non-negative integer"));
      if (g > 0 && (h % 1 || d % 1 || l % 1))
        throw Error(y.concat("non-zero discreteStep requires integer minValue, maxValue, and defaultValue"));
      if (o === "choice" && !v.length)
        throw Error(y.concat("choice type parameter requires list of strings in choices"));
      this.id = u, this.label = p, this.type = o, this.defaultValue = l, this.minValue = h, this.maxValue = d, this.discreteStep = g, this.exponent = w, this.choices = v, this.units = f;
    }
    normalize(u) {
      return e(u, this.minValue, this.maxValue, this.exponent);
    }
    denormalize(u) {
      return s(u, this.minValue, this.maxValue, this.exponent);
    }
    valueString(u) {
      return this.choices ? this.choices[u] : this.units !== "" ? `${u} ${this.units}` : `${u}`;
    }
  }
  if (t.AudioWorkletProcessor) {
    const r = t.webAudioModules.getModuleScope(c);
    r.WamParameterInfo || (r.WamParameterInfo = a);
  }
  return a;
}, re = ne, oe = (c) => {
  const t = globalThis, i = 128, _ = "0_0";
  class e {
    static _tables;
    static _tableReferences;
    constructor(n, a, r = 0) {
      e._tables || (e._tables = { nullTableKey: new Float32Array(0) }, e._tableReferences = { nullTableKey: [] }), this.info = n, this.values = new Float32Array(i), this._tableKey = _, this._table = e._tables[this._tableKey], this._skew = 2;
      const { discreteStep: u } = n;
      this._discrete = !!u, this._N = this._discrete ? 0 : a, this._n = 0, this._startValue = n.defaultValue, this._endValue = n.defaultValue, this._currentValue = n.defaultValue, this._deltaValue = 0, this._inverted = !1, this._changed = !0, this._filled = 0, this._discrete ? this._skew = 0 : this.setSkew(r), this.setStartValue(this._startValue);
    }
    _removeTableReference(n) {
      if (n === _)
        return;
      const { id: a } = this.info, r = e._tableReferences[n];
      if (r) {
        const u = r.indexOf(a);
        u !== -1 && r.splice(u, 1), r.length === 0 && (delete e._tables[n], delete e._tableReferences[n]);
      }
    }
    setSkew(n) {
      if (this._skew === n || this._discrete)
        return;
      if (n < -1 || n > 1)
        throw Error("skew must be in range [-1.0, 1.0]");
      const a = [this._N, n].join("_"), r = this._tableKey, { id: u } = this.info;
      if (a !== r) {
        if (e._tables[a]) {
          const m = e._tableReferences[a];
          m ? m.push(u) : e._tableReferences[a] = [u];
        } else {
          let m = Math.abs(n);
          m = Math.pow(3 - m, m * (m + 2));
          const o = m === 1, p = this._N, l = new Float32Array(p + 1);
          if (o)
            for (let h = 0; h <= p; ++h)
              l[h] = h / p;
          else
            for (let h = 0; h <= p; ++h)
              l[h] = (h / p) ** m;
          e._tables[a] = l, e._tableReferences[a] = [u];
        }
        this._removeTableReference(r), this._skew = n, this._tableKey = a, this._table = e._tables[this._tableKey];
      }
    }
    setStartValue(n, a = !0) {
      this._n = this._N, this._startValue = n, this._endValue = n, this._currentValue = n, this._deltaValue = 0, this._inverted = !1, a ? (this.values.fill(n), this._changed = !0, this._filled = this.values.length) : (this._changed = !1, this._filled = 0);
    }
    setEndValue(n) {
      n !== this._endValue && (this._n = 0, this._startValue = this._currentValue, this._endValue = n, this._deltaValue = this._endValue - this._startValue, this._inverted = this._deltaValue > 0 && this._skew >= 0 || this._deltaValue <= 0 && this._skew < 0, this._changed = !1, this._filled = 0);
    }
    process(n, a) {
      if (this.done)
        return;
      const r = a - n;
      let u = 0;
      const m = this._N - this._n;
      if (this._discrete || !m)
        u = r;
      else {
        if (m < r && (u = Math.min(r - m, i), a -= u), a > n)
          if (this._inverted)
            for (let o = n; o < a; ++o) {
              const p = 1 - this._table[this._N - ++this._n];
              this.values[o] = this._startValue + p * this._deltaValue;
            }
          else
            for (let o = n; o < a; ++o) {
              const p = this._table[++this._n];
              this.values[o] = this._startValue + p * this._deltaValue;
            }
        u > 0 && (n = a, a += u);
      }
      u > 0 && (this.values.fill(this._endValue, n, a), this._filled += u), this._currentValue = this.values[a - 1], this._n === this._N && (this._changed ? this._filled >= this.values.length && (this.setStartValue(this._endValue, !1), this._changed = !0, this._filled = this.values.length) : this._changed = !0);
    }
    get done() {
      return this._changed && this._filled === this.values.length;
    }
    is(n) {
      return this._endValue === n && this.done;
    }
    destroy() {
      this._removeTableReference(this._tableKey);
    }
  }
  if (t.AudioWorkletProcessor) {
    const s = t.webAudioModules.getModuleScope(c);
    s.WamParameterInterpolator || (s.WamParameterInterpolator = e);
  }
  return e;
}, Q = oe, le = (c) => {
  const t = globalThis, {
    AudioWorkletProcessor: i,
    webAudioModules: _
  } = t, e = t.webAudioModules.getModuleScope(c), {
    RingBuffer: s,
    WamEventRingBuffer: n,
    WamParameter: a,
    WamParameterInterpolator: r
  } = e;
  class u extends i {
    constructor(o) {
      super();
      const {
        groupId: p,
        moduleId: l,
        instanceId: h,
        useSab: d
      } = o.processorOptions;
      if (!l)
        throw Error("must provide moduleId argument in processorOptions!");
      if (!h)
        throw Error("must provide instanceId argument in processorOptions!");
      this.groupId = p, this.moduleId = l, this.instanceId = h, this._samplesPerQuantum = 128, this._compensationDelay = 0, this._parameterInfo = {}, this._parameterState = {}, this._parameterInterpolators = {}, this._eventQueue = [], this._pendingResponses = {}, this._useSab = !!d && !!globalThis.SharedArrayBuffer, this._eventSabReady = !1, this._audioToMainEventSab = null, this._mainToAudioEventSab = null, this._eventWriter = null, this._eventReader = null, this._initialized = !1, this._destroyed = !1, this._eventQueueRequiresSort = !1, _.addWam(this), this.port.onmessage = this._onMessage.bind(this), this._useSab && this._configureSab();
    }
    getCompensationDelay() {
      return this._compensationDelay;
    }
    scheduleEvents(...o) {
      let p = 0;
      for (; p < o.length; )
        this._eventQueue.push({ id: 0, event: o[p] }), p++;
      this._eventQueueRequiresSort = this._eventQueue.length > 1;
    }
    emitEvents(...o) {
      _.emitEvents(this, ...o);
    }
    clearEvents() {
      this._eventQueue = [];
    }
    process(o, p, l) {
      if (!this._initialized)
        return !0;
      if (this._destroyed)
        return !1;
      this._eventSabReady && this.scheduleEvents(...this._eventReader.read());
      const h = this._getProcessingSlices();
      let d = 0;
      for (; d < h.length; ) {
        const { range: g, events: w } = h[d], [v, f] = g;
        let y = 0;
        for (; y < w.length; )
          this._processEvent(w[y]), y++;
        this._interpolateParameterValues(v, f), this._process(v, f, o, p, l), d++;
      }
      return !0;
    }
    destroy() {
      this._destroyed = !0, this.port.close(), _.removeWam(this);
    }
    _generateWamParameterInfo() {
      return {};
    }
    _initialize() {
      this._parameterState = {}, this._parameterInterpolators = {}, this._parameterInfo = this._generateWamParameterInfo(), Object.keys(this._parameterInfo).forEach((o) => {
        const p = this._parameterInfo[o];
        this._parameterState[o] = new a(this._parameterInfo[o]), this._parameterInterpolators[o] = new r(p, 256);
      });
    }
    _configureSab() {
      const p = Object.keys(this._parameterInfo);
      this._eventSabReady && (this._eventWriter.setParameterIds(p), this._eventReader.setParameterIds(p)), this.port.postMessage({ eventSab: { eventCapacity: 1024, parameterIds: p } });
    }
    async _onMessage(o) {
      if (o.data.request) {
        const {
          id: p,
          request: l,
          content: h
        } = o.data, d = { id: p, response: l }, g = l.split("/"), w = g[0], v = g[1];
        if (d.content = "error", w === "get")
          if (v === "parameterInfo") {
            let { parameterIds: f } = h;
            f.length || (f = Object.keys(this._parameterInfo));
            const y = {};
            let S = 0;
            for (; S < f.length; ) {
              const V = f[S];
              y[V] = this._parameterInfo[V], S++;
            }
            d.content = y;
          } else if (v === "parameterValues") {
            let { normalized: f, parameterIds: y } = h;
            d.content = this._getParameterValues(f, y);
          } else v === "state" ? d.content = this._getState() : v === "compensationDelay" && (d.content = this.getCompensationDelay());
        else if (w === "set") {
          if (v === "parameterValues") {
            const { parameterValues: f } = h;
            this._setParameterValues(f, !0), delete d.content;
          } else if (v === "state") {
            const { state: f } = h;
            this._setState(f), delete d.content;
          }
        } else if (w === "add") {
          if (v === "event") {
            const { event: f } = h;
            this._eventQueue.push({ id: p, event: f }), this._eventQueueRequiresSort = this._eventQueue.length > 1;
            return;
          }
        } else if (w === "remove") {
          if (v === "events") {
            const f = this._eventQueue.map((y) => y.id);
            this.clearEvents(), d.content = f;
          }
        } else if (w === "connect") {
          if (v === "events") {
            const { wamInstanceId: f, output: y } = h;
            this._connectEvents(f, y), delete d.content;
          }
        } else if (w === "disconnect") {
          if (v === "events") {
            const { wamInstanceId: f, output: y } = h;
            this._disconnectEvents(f, y), delete d.content;
          }
        } else if (w === "initialize") {
          if (v === "processor")
            this._initialize(), this._initialized = !0, delete d.content;
          else if (v === "eventSab") {
            const { mainToAudioEventSab: f, audioToMainEventSab: y } = h;
            this._audioToMainEventSab = y, this._mainToAudioEventSab = f;
            const S = Object.keys(this._parameterInfo);
            this._eventWriter = new n(s, this._audioToMainEventSab, S), this._eventReader = new n(s, this._mainToAudioEventSab, S), this._eventSabReady = !0, delete d.content;
          }
        }
        this.port.postMessage(d);
      } else o.data.destroy && this.destroy();
    }
    _onTransport(o) {
      console.error("_onTransport not implemented!");
    }
    _onMidi(o) {
      console.error("_onMidi not implemented!");
    }
    _onSysex(o) {
      console.error("_onMidi not implemented!");
    }
    _onMpe(o) {
      console.error("_onMpe not implemented!");
    }
    _onOsc(o) {
      console.error("_onOsc not implemented!");
    }
    _setState(o) {
      o.parameterValues && this._setParameterValues(o.parameterValues, !1);
    }
    _getState() {
      return { parameterValues: this._getParameterValues(!1) };
    }
    _getParameterValues(o, p) {
      const l = {};
      (!p || !p.length) && (p = Object.keys(this._parameterState));
      let h = 0;
      for (; h < p.length; ) {
        const d = p[h], g = this._parameterState[d];
        l[d] = {
          id: d,
          value: o ? g.normalizedValue : g.value,
          normalized: o
        }, h++;
      }
      return l;
    }
    _setParameterValues(o, p) {
      const l = Object.keys(o);
      let h = 0;
      for (; h < l.length; )
        this._setParameterValue(o[l[h]], p), h++;
    }
    _setParameterValue(o, p) {
      const { id: l, value: h, normalized: d } = o, g = this._parameterState[l];
      if (!g)
        return;
      d ? g.normalizedValue = h : g.value = h;
      const w = this._parameterInterpolators[l];
      p ? w.setEndValue(g.value) : w.setStartValue(g.value);
    }
    _interpolateParameterValues(o, p) {
      const l = Object.keys(this._parameterInterpolators);
      let h = 0;
      for (; h < l.length; )
        this._parameterInterpolators[l[h]].process(o, p), h++;
    }
    _connectEvents(o, p) {
      _.connectEvents(this.groupId, this.instanceId, o, p);
    }
    _disconnectEvents(o, p) {
      if (typeof o > "u") {
        _.disconnectEvents(this.groupId, this.instanceId);
        return;
      }
      _.disconnectEvents(this.groupId, this.instanceId, o, p);
    }
    _getProcessingSlices() {
      const o = "add/event", { currentTime: p, sampleRate: l } = t, h = {};
      this._eventQueueRequiresSort && (this._eventQueue.sort((f, y) => f.event.time - y.event.time), this._eventQueueRequiresSort = !1);
      let d = 0;
      for (; d < this._eventQueue.length; ) {
        const { id: f, event: y } = this._eventQueue[d], S = y.time - p, V = S > 0 ? Math.round(S * l) : 0;
        if (V < this._samplesPerQuantum)
          h[V] ? h[V].push(y) : h[V] = [y], f ? this.port.postMessage({ id: f, response: o }) : this._eventSabReady ? this._eventWriter.write(y) : this.port.postMessage({ event: y }), this._eventQueue.shift(), d = -1;
        else
          break;
        d++;
      }
      const g = [], w = Object.keys(h);
      w[0] !== "0" && (w.unshift("0"), h[0] = []);
      const v = w.length - 1;
      for (d = 0; d < w.length; ) {
        const f = w[d], y = parseInt(f), S = d < v ? parseInt(w[d + 1]) : this._samplesPerQuantum;
        g.push({ range: [y, S], events: h[f] }), d++;
      }
      return g;
    }
    _processEvent(o) {
      switch (o.type) {
        case "wam-automation":
          this._setParameterValue(o.data, !0);
          break;
        case "wam-transport":
          this._onTransport(o.data);
          break;
        case "wam-midi":
          this._onMidi(o.data);
          break;
        case "wam-sysex":
          this._onSysex(o.data);
          break;
        case "wam-mpe":
          this._onMpe(o.data);
          break;
        case "wam-osc":
          this._onOsc(o.data);
          break;
      }
    }
    _process(o, p, l, h, d) {
      console.error("_process not implemented!");
    }
  }
  return t.AudioWorkletProcessor && (e.WamProcessor || (e.WamProcessor = u)), u;
}, he = le, x = j(), z = F(), ce = class extends AudioWorkletNode {
  static async addModules(c, t) {
    const { audioWorklet: i } = c;
    await I(i, j, t), await I(i, F, t), await I(i, ee, t), await I(i, ae, t), await I(i, re, t), await I(i, Q, t), await I(i, he, t);
  }
  constructor(c, t) {
    const { audioContext: i, groupId: _, moduleId: e, instanceId: s } = c;
    t.processorOptions = {
      groupId: _,
      moduleId: e,
      instanceId: s,
      ...t.processorOptions
    }, super(i, e, t), this.module = c, this._supportedEventTypes = /* @__PURE__ */ new Set(["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc"]), this._messageId = 1, this._pendingResponses = {}, this._pendingEvents = {}, this._useSab = !1, this._eventSabReady = !1, this._destroyed = !1, this.port.onmessage = this._onMessage.bind(this);
  }
  get groupId() {
    return this.module.groupId;
  }
  get moduleId() {
    return this.module.moduleId;
  }
  get instanceId() {
    return this.module.instanceId;
  }
  async getParameterInfo(...c) {
    const t = "get/parameterInfo", i = this._generateMessageId();
    return new Promise((_) => {
      this._pendingResponses[i] = _, this.port.postMessage({
        id: i,
        request: t,
        content: { parameterIds: c }
      });
    });
  }
  async getParameterValues(c, ...t) {
    const i = "get/parameterValues", _ = this._generateMessageId();
    return new Promise((e) => {
      this._pendingResponses[_] = e, this.port.postMessage({
        id: _,
        request: i,
        content: { normalized: c, parameterIds: t }
      });
    });
  }
  async setParameterValues(c) {
    const t = "set/parameterValues", i = this._generateMessageId();
    return new Promise((_) => {
      this._pendingResponses[i] = _, this.port.postMessage({
        id: i,
        request: t,
        content: { parameterValues: c }
      });
    });
  }
  async getState() {
    const c = "get/state", t = this._generateMessageId();
    return new Promise((i) => {
      this._pendingResponses[t] = i, this.port.postMessage({ id: t, request: c });
    });
  }
  async setState(c) {
    const t = "set/state", i = this._generateMessageId();
    return new Promise((_) => {
      this._pendingResponses[i] = _, this.port.postMessage({
        id: i,
        request: t,
        content: { state: c }
      });
    });
  }
  async getCompensationDelay() {
    const c = "get/compensationDelay", t = this._generateMessageId();
    return new Promise((i) => {
      this._pendingResponses[t] = i, this.port.postMessage({ id: t, request: c });
    });
  }
  addEventListener(c, t, i) {
    this._supportedEventTypes.has(c) && super.addEventListener(c, t, i);
  }
  removeEventListener(c, t, i) {
    this._supportedEventTypes.has(c) && super.removeEventListener(c, t, i);
  }
  scheduleEvents(...c) {
    let t = 0;
    const i = c.length;
    for (this._eventSabReady && (t = this._eventWriter.write(...c)); t < i; ) {
      const _ = c[t], e = "add/event", s = this._generateMessageId();
      let n = !1;
      new Promise((a, r) => {
        this._pendingResponses[s] = a, this._pendingEvents[s] = () => {
          n || r();
        }, this.port.postMessage({
          id: s,
          request: e,
          content: { event: _ }
        });
      }).then((a) => {
        n = !0, delete this._pendingEvents[s], this._onEvent(_);
      }).catch((a) => {
        delete this._pendingResponses[s];
      }), t++;
    }
  }
  async clearEvents() {
    const c = "remove/events", t = this._generateMessageId();
    if (Object.keys(this._pendingEvents).length)
      return new Promise((_) => {
        this._pendingResponses[t] = _, this.port.postMessage({ id: t, request: c });
      }).then((_) => {
        _.forEach((e) => {
          this._pendingEvents[e](), delete this._pendingEvents[e];
        });
      });
  }
  connectEvents(c, t) {
    const i = "connect/events", _ = this._generateMessageId();
    new Promise((e, s) => {
      this._pendingResponses[_] = e, this.port.postMessage({
        id: _,
        request: i,
        content: { wamInstanceId: c, output: t }
      });
    });
  }
  disconnectEvents(c, t) {
    const i = "disconnect/events", _ = this._generateMessageId();
    new Promise((e, s) => {
      this._pendingResponses[_] = e, this.port.postMessage({
        id: _,
        request: i,
        content: { wamInstanceId: c, output: t }
      });
    });
  }
  destroy() {
    this._audioToMainInterval && clearInterval(this._audioToMainInterval), this.port.postMessage({ destroy: !0 }), this.port.close(), this.disconnect(), this._destroyed = !0;
  }
  _generateMessageId() {
    return this._messageId++;
  }
  async _initialize() {
    const c = "initialize/processor", t = this._generateMessageId();
    return new Promise((i) => {
      this._pendingResponses[t] = i, this.port.postMessage({ id: t, request: c });
    });
  }
  _onMessage(c) {
    const { data: t } = c, { response: i, event: _, eventSab: e } = t;
    if (i) {
      const { id: s, content: n } = t, a = this._pendingResponses[s];
      a && (delete this._pendingResponses[s], a(n));
    } else if (e) {
      this._useSab = !0;
      const { eventCapacity: s, parameterIds: n } = e;
      if (this._eventSabReady) {
        this._eventWriter.setParameterIds(n), this._eventReader.setParameterIds(n);
        return;
      }
      this._mainToAudioEventSab = z.getStorageForEventCapacity(x, s), this._audioToMainEventSab = z.getStorageForEventCapacity(x, s), this._eventWriter = new z(x, this._mainToAudioEventSab, n), this._eventReader = new z(x, this._audioToMainEventSab, n);
      const a = "initialize/eventSab", r = this._generateMessageId();
      new Promise((u, m) => {
        this._pendingResponses[r] = u, this.port.postMessage({
          id: r,
          request: a,
          content: {
            mainToAudioEventSab: this._mainToAudioEventSab,
            audioToMainEventSab: this._audioToMainEventSab
          }
        });
      }).then((u) => {
        this._eventSabReady = !0, this._audioToMainInterval = setInterval(() => {
          this._eventReader.read().forEach((o) => {
            this._onEvent(o);
          });
        }, 100);
      });
    } else _ && this._onEvent(_);
  }
  _onEvent(c) {
    const { type: t } = c;
    this.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      detail: c
    }));
  }
};
class L extends ce {
  constructor(t) {
    super(t, {
      channelCount: 2,
      numberOfOutputs: 1
    });
  }
  static async addModules(t, i) {
    await super.addModules(t, i), await I(t.audioWorklet, Q, i), await I(t.audioWorklet, ue, i);
  }
}
function ue(c) {
  const t = globalThis, i = t.webAudioModules.getModuleScope(c), _ = i.WamProcessor, e = i.WamParameterInfo, s = 30, n = Array.from({ length: 256 }, (p, l) => 1 / (Math.pow(2, (l - 69) / 12) * 440)), a = 1, r = 2, u = 3;
  function m(p, l, h, d, g) {
    let w, v;
    if (d) {
      const f = Math.floor(h * p.length);
      (f + p.length - 1) % p.length, w = (f + p.length) % p.length, v = (w + 1) % p.length;
    } else {
      const f = Math.floor(h * p.length);
      Math.min(Math.max(0, f - 1), p.length - 1), w = Math.min(f, p.length - 1), v = Math.min(f + 1, p.length - 1);
    }
    if (g) {
      let f = h * p.length - Math.floor(h * p.length);
      return p[w][l] * (1 - f) + p[v][l] * f;
    } else return p[w][l];
  }
  class o extends _ {
    constructor() {
      super(...arguments), this.notes = {};
    }
    _process(l, h, d, g, w) {
      const v = Array.from({ length: s }, (R, E) => this._parameterInterpolators[`curve${E}`].values), f = Array.from({ length: s }, (R, E) => this._parameterInterpolators[`attack${E}`].values), y = this._parameterInterpolators.attack_duration.values, S = Array.from({ length: s }, (R, E) => this._parameterInterpolators[`sustain${E}`].values), V = this._parameterInterpolators.sustain_duration.values, A = this._parameterInterpolators.sustain_loop.values, $ = Array.from({ length: s }, (R, E) => this._parameterInterpolators[`release${E}`].values), C = this._parameterInterpolators.release_duration.values, G = this._parameterInterpolators.interpolate.values;
      for (const R in this.notes) {
        const E = this.notes[R];
        for (let M = l; M < h; M++) {
          const W = E.advancement + (M - l) / t.sampleRate, K = E.period;
          let H = m(v, M, W / K, !0, G[M] > 0.5), k = 0;
          const T = W - E.last_start;
          let O = !1;
          switch (E.step) {
            case a: {
              k = m(f, M, T / (y[M] || 1e-5), !1, !0), T > y[M] && (E.step = r, E.last_start = W, E.multiplier *= k);
              break;
            }
            case r: {
              const N = A[M] > 0.5;
              k = m(S, M, T / (V[M] || 1e-5), N, !0), !N && T > V[M] && (E.step = u, E.last_start = W, E.multiplier *= k), E.doStop && (E.step = u, E.last_start = W, E.multiplier *= k);
              break;
            }
            case u: {
              k = m($, M, T / (C[M] || 1e-5), !1, !0), T > C[M] && (O = !0);
              break;
            }
          }
          if (O) {
            delete this.notes[R];
            break;
          }
          g[0][0][M] += H * k * E.multiplier;
        }
        E.advancement += (h - l) / t.sampleRate;
      }
    }
    _processEvent(l) {
      super._processEvent(l);
    }
    _onMidi(l) {
      const h = l.bytes[0] & 240, d = l.bytes[1], g = l.bytes[2];
      h == 128 || h == 144 && g == 0 ? this.notes[d] && (this.notes[d].doStop = !0) : h == 144 && g > 0 && (this.notes[d] = { advancement: 0, last_start: 0, period: n[d], multiplier: 1, step: a });
    }
    _generateWamParameterInfo() {
      const l = {};
      for (let h = 0; h < s; h++) {
        const d = Math.sin(h / s * Math.PI * 2);
        l[`curve${h}`] = new e(`curve${h}`, {
          type: "float",
          label: `Curve Point ${h + 1}`,
          minValue: -1,
          maxValue: 1,
          defaultValue: d
        });
      }
      for (let h = 0; h < s; h++) {
        const d = Math.max(0, Math.sin(h / s * Math.PI * 0.5));
        l[`attack${h}`] = new e(`attack${h}`, {
          type: "float",
          label: `Attack Curve Point ${h + 1}`,
          minValue: 0,
          maxValue: 1,
          defaultValue: d
        });
      }
      l.attack_duration = new e("attack_duration", {
        type: "float",
        label: "Attack Curve Duration",
        minValue: 0,
        maxValue: 5,
        defaultValue: 1,
        units: "s"
      });
      for (let h = 0; h < s; h++)
        l[`sustain${h}`] = new e(`sustain${h}`, {
          type: "float",
          label: `Sustain Curve Point ${h + 1}`,
          minValue: 0,
          maxValue: 1,
          defaultValue: 1
        });
      l.sustain_duration = new e("sustain_duration", {
        type: "float",
        label: "Sustain Curve Duration",
        minValue: 0,
        maxValue: 5,
        defaultValue: 1,
        units: "s"
      }), l.sustain_loop = new e("sustain_loop", {
        type: "boolean",
        label: "Do Sustain Curve loop?",
        defaultValue: 1
      });
      for (let h = 0; h < s; h++) {
        const d = Math.max(0, Math.sin((h / s + 1) * Math.PI * 0.5));
        l[`release${h}`] = new e(`release${h}`, {
          type: "float",
          label: `Release Curve Point ${h + 1}`,
          minValue: 0,
          maxValue: 1,
          defaultValue: d
        });
      }
      return l.release_duration = new e("release_duration", {
        type: "float",
        label: "Release Curve Duration",
        minValue: 0,
        maxValue: 5,
        defaultValue: 1,
        units: "s"
      }), l.interpolate = new e("interpolate", {
        type: "boolean",
        label: "Interpolate",
        defaultValue: 1
      }), l;
    }
  }
  try {
    t.registerProcessor(c, o);
  } catch {
  }
}
var de = Object.defineProperty, pe = (c, t, i) => t in c ? de(c, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : c[t] = i, U = (c, t, i) => pe(c, typeof t != "symbol" ? t + "" : t, i);
function D(c) {
  return c.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function b(c, ...t) {
  let i = "", _ = [], e = [];
  function s(a) {
    if (a != null) if (a instanceof Node)
      i += `<span id="_sam_frament_target_${_.length}"></span>`, _.push(a);
    else if (typeof a == "string") i += D(a);
    else if (typeof a[Symbol.iterator] == "function")
      for (const r of a) s(r);
    else typeof a == "function" ? s(a()) : i += D("" + a);
  }
  for (let a = 0; a < t.length; a++)
    c[a].endsWith("@") && (typeof t[a] == "function" || typeof t[a] == "object") ? (i += c[a].slice(0, -1), i += `_sam_fragment_to_call_${e.length}=sam`, e.push(t[a])) : (i += c[a], s(t[a]));
  i += c[c.length - 1];
  const n = document.createRange().createContextualFragment(i);
  for (let a = 0; a < _.length; a++) {
    const r = n.getElementById(`_sam_frament_target_${a}`);
    r?.replaceWith(_[a]);
  }
  for (let a = 0; a < e.length; a++) {
    const r = n.querySelector(`[_sam_fragment_to_call_${a}]`);
    r?.removeAttribute(`_sam_fragment_to_call_${a}`);
    const u = e[a];
    if (typeof u == "function") u();
    else for (const [m, o] of Object.entries(e[a]))
      m == "init" ? o(r) : r?.addEventListener(m, o);
  }
  return n;
}
b.opt = function(c, ...t) {
  if (!(t.includes(null) || t.includes(void 0)))
    return b(c, ...t);
};
b.not_empty = function(c, ...t) {
  if (!t.every((i) => i == null || i.length && i.length === 0))
    return b(c, ...t);
};
b.a = function(c, ...t) {
  return b(c, ...t).firstElementChild;
};
class _e {
  /**
   * Register an observer and return a function to unregister it.
   * @param observer The function to call on notification.
   * @returns A function to call to unregister the observer.
   */
  add(t) {
    return this.register(t), () => this.unregister(t);
  }
}
class me extends _e {
  constructor(t = void 0) {
    super(), U(this, "observers", /* @__PURE__ */ new Set()), U(this, "depth", 0), this.parent = t;
  }
  /** Register an observer */
  register(t) {
    return this.observers.add(t), () => this.observers.delete(t);
  }
  /** Unregister an observer */
  unregister(t) {
    this.observers.delete(t);
  }
  /** Send a notification to the observers */
  notify(t) {
    if (this.depth++, this.depth == 1) {
      for (let i of this.observers) i(t);
      this.parent && this.parent.notify(t);
    }
    this.depth = 0;
  }
}
class fe {
  /** Get the value */
  get() {
    return this._value;
  }
  /** Get the value */
  get value() {
    return this.get();
  }
}
class ve extends fe {
  constructor(t, i) {
    super(), this.observable = new me(i), this._value = t;
  }
  /** Set the value */
  set(t) {
    let i = this._value;
    this._value = t, this.observable.notify({ from: i, to: t });
  }
  /** Set the value */
  set value(t) {
    this.set(t);
  }
  /** Get the value */
  get value() {
    return this.get();
  }
  /** Register a listener and call it immediately with the current value. */
  link(t) {
    return t({ from: this._value, to: this._value }), this.observable.add(t);
  }
}
class ge {
  constructor(t) {
    this.node = t, this.disposed = !1, this.value_map = {};
    const i = this, { value_map: _ } = this;
    setTimeout(async function e() {
      const s = await t.getParameterValues();
      for (const [n, a] of Object.entries(i.value_map)) {
        const r = s[n];
        a.value != r.value && (a.value = r.value);
      }
      i.disposed || setTimeout(e, 100);
    }, 100);
  }
  addParameter(t) {
    const i = new ve(0), _ = i.set, { node: e } = this;
    return i.set = function(s) {
      _.call(this, s), e.setParameterValues({ [t]: { id: t, normalized: !1, value: s } });
    }, this.value_map[t] = i, i;
  }
  dispose() {
    this.disposed = !0;
  }
}
class q {
  constructor(t, i, _) {
    this.element = b.a`
            <div>
                <label for="${i}">${_}</label>
                <input type="checkbox" id="${i}" />
            </div>
        `;
    const e = this.element.children[1];
    this.dispose = t.link(({ to: s }) => e.checked = s > 0.5), e.addEventListener("input", () => t.set(e.checked ? 1 : 0));
  }
}
const ye = "" + new URL("cardboard.css", import.meta.url).href, we = "aa";
class P extends HTMLElement {
  constructor(t) {
    super(), this.wam = t, this.#t = [], this.selectedMenu = "wave", this.#s = this.attachShadow({ mode: "closed" }), this.#e = new ge(t.audioNode), this.wave = Array.from({ length: P.RESOLUTION }, (i, _) => this.#e.addParameter(`curve${_}`)), this.attack = Array.from({ length: P.RESOLUTION }, (i, _) => this.#e.addParameter(`attack${_}`)), this.release = Array.from({ length: P.RESOLUTION }, (i, _) => this.#e.addParameter(`release${_}`)), this.sustain = Array.from({ length: P.RESOLUTION }, (i, _) => this.#e.addParameter(`sustain${_}`)), this.interpolate = this.#e.addParameter("interpolate"), this.attack_duration = this.#e.addParameter("attack_duration"), this.release_duration = this.#e.addParameter("release_duration"), this.sustain_duration = this.#e.addParameter("sustain_duration"), this.sustain_loop = this.#e.addParameter("sustain_loop");
  }
  static {
    this.NAME = `card-cardboard${we}`;
  }
  static {
    this.RESOLUTION = 30;
  }
  #e;
  #t;
  #s;
  connectedCallback() {
    this.#t.forEach((e) => e()), this.#t = [];
    const t = this;
    let i;
    if (this.selectedMenu == "wave") {
      const e = new B(
        -1,
        1,
        0,
        !0,
        null,
        [{ index: this.wave.length / 2, name: "" }],
        this.wave
      ), s = new q(this.interpolate, "Interpolate curve points", "interpolate"), n = b.a`<button title="Symmetrize the wave">Symmetrize</button>`;
      n.onclick = () => {
        for (let l = 0; l < this.wave.length / 2; l++)
          this.wave[this.wave.length - 1 - l].set(-this.wave[l].value);
      };
      const a = b.a`<button title="Smooth the wave shape">Smooth</button>`;
      a.onclick = () => {
        const l = this.wave.map((h) => h.value);
        for (let h = 0; h < this.wave.length; h++) {
          let d = 0;
          d += l[(h - 1 + this.wave.length) % this.wave.length], d += l[h], d += l[(h + 1) % this.wave.length], this.wave[h].set(d / 3);
        }
      };
      const r = b.a`<button title="Noisify the wave">Noise</button>`;
      r.onclick = () => {
        for (let l = 0; l < this.wave.length; l++)
          this.wave[l].set(Math.max(-1, Math.min(1, this.wave[l].value + (Math.random() - 0.5) / 2)));
      };
      const u = b.a`<button title="Set the wave to a sine wave">Sine</button>`;
      u.onclick = () => {
        for (let l = 0; l < this.wave.length; l++) this.wave[l].set(Math.sin(l / this.wave.length * Math.PI * 2));
      };
      const m = b.a`<button title="Set the wave to a square wave">Square</button>`;
      m.onclick = () => {
        for (let l = 0; l < this.wave.length; l++) this.wave[l].set(l < this.wave.length / 2 ? 1 : -1);
      };
      const o = b.a`<button title="Set the wave to a sawtooth">Sawtooth</button>`;
      o.onclick = () => {
        for (let l = 0; l < this.wave.length; l++) this.wave[l].set(l < this.wave.length / 2 ? l / this.wave.length * 2 : -2 + l / this.wave.length * 2);
      };
      const p = b.a`<button title="Set the wave to a triangle">Triangle</button>`;
      p.onclick = () => {
        for (let l = 0; l < this.wave.length; l++) this.wave[l].set(l < this.wave.length / 2 ? l / this.wave.length * 4 - 1 : 3 - l / this.wave.length * 4);
      }, i = b`
                ${e.element}
                <div id="options">
                    ${s.element}
                    <div class=category>${n} ${a} ${r}</div>
                    <div class=category>${u} ${m} ${o} ${p}</div>
                </div>
            `, this.#t.push(() => e.dispose(), () => s.dispose());
    } else if (this.selectedMenu == "attack") {
      const e = new B(
        0,
        1,
        0,
        !1,
        { name: "Attack Duration", unit: "seconds", min: 0, max: 5, step: 0.1, value: t.attack_duration },
        [],
        this.attack
      );
      i = b`
                ${e.element}
            `, this.#t.push(() => e.dispose());
    } else if (this.selectedMenu == "sustain") {
      const e = new B(
        0,
        1,
        0,
        !1,
        { name: "Sustain Duration", unit: "seconds", min: 0, max: 10, step: 0.1, value: t.sustain_duration },
        [],
        this.sustain
      ), s = new q(this.sustain_loop, "Loop Sustain Curve", "sustain_loop");
      i = b`
                ${e.element}
                <div id="options">
                    ${s.element}
                </div>
            `, this.#t.push(() => e.dispose(), () => s.dispose());
    } else if (this.selectedMenu == "release") {
      const e = new B(
        0,
        1,
        0,
        !1,
        { name: "Release Duration", unit: "seconds", min: 0, max: 5, step: 0.1, value: t.release_duration },
        [],
        this.release
      );
      i = b`
                ${e.element}
            `, this.#t.push(() => e.dispose());
    }
    function _(e) {
      t.selectedMenu = e.target.id.replace("_menu", ""), t.connectedCallback();
    }
    this.#s.replaceChildren(b`
            <link rel="stylesheet" crossorigin href="${ye}" />
            <h1>Cardboardizer</h1>
            <ul class="menu">
                <li id=wave_menu @${{ click: _ }}>Wave</li>
                <li id=attack_menu @${{ click: _ }}>Attack</li>
                <li id=sustain_menu @${{ click: _ }}>Sustain</li>
                <li id=release_menu @${{ click: _ }}>Release</li>
            </ul>
            ${i}
            <div class=crayon></div>
        `), this.#s.querySelector(`#${this.selectedMenu}_menu`).classList.add("selected");
  }
  disconnectedCallback() {
  }
  dispose() {
    this.#e.dispose(), this.#t.forEach((t) => t());
  }
}
try {
  customElements.define(P.NAME, P);
} catch {
}
class B {
  constructor(t, i, _, e, s, n, a) {
    this.diposables = [];
    const r = a.length, { diposables: u } = this, m = i - t, o = [], p = Math.round(100 - (_ - t) / m * 100);
    this.element = b.a`
            <div class=curve>
                <svg viewBox="0 0 200 100">
                    <text x=0 y=7 fill=white style="font-size: .5rem">${i}</text>
                    <text x=0 y=97 fill=white style="font-size: .5rem">${t}</text>
                    <line x1=0 y1=${p} x2=200 y2=${p} stroke=white stroke-width=1 />
                    ${function* () {
      let d = 0;
      for (const { name: g, index: w } of n) {
        const v = w / r * 200, f = B.COLORS[d % B.COLORS.length];
        yield b`<svg><text x=${v + 2} y=80 fill=${f} style="font-size: .5rem">${g}</text></svg>`, yield b`<svg><line x1=${v} y1=0 x2=${v} y2=100 stroke=${f} stroke-width=1 /></svg>`, d++;
      }
    }}
                    ${function* () {
      const d = 200 / r, g = e ? -1 : 0, w = e ? r : r - 1;
      for (let v = g; v < w; v++) {
        const f = (v + r) % r, y = (f + 1) % r, S = a[f], V = a[y], A = b.a`<svg><line stroke=black stroke-width=1 /></svg>`.children[0];
        A.x1.baseVal.value = (v + 0.5) * d, A.x2.baseVal.value = (v + 1.5) * d;
        const $ = () => {
          A.y1.baseVal.value = 100 - (S.value - t) / m * 100, A.y2.baseVal.value = 100 - (V.value - t) / m * 100;
        };
        u.push(S.observable.add($)), u.push(V.observable.add($)), $(), yield A;
      }
      for (let v = 0; v < r; v++) {
        const f = a[v], y = b.a`<svg><circle r=1.5 stroke=white stroke-width=1 fill=black /></svg>`.children[0];
        y.cx.baseVal.value = (v + 0.5) * d, u.push(f.link(({ to: S }) => {
          y.cy.baseVal.value = 100 - (f.value - t) / m * 100;
        })), o.push(y), yield y;
      }
    }}
                </svg>
                ${() => {
      if (s) {
        const d = b.a`
                            <div>
                                <input type="range" min=${s.min} max=${s.max} step=${s.step} />
                                <label for="curve_length">${s.name}</label>
                            </div>
                        `, g = d.children[1], w = d.children[0];
        return s.value.link(({ to: v }) => {
          w.value = v.toString(), g.textContent = `${s.name} (${v}${s.unit ? ` ${s.unit}` : ""})`;
        }), w.addEventListener("input", () => s.value.set(parseFloat(w.value))), d;
      } else
        return;
    }}
                
            </div>
        `;
    const l = this.element.children[0], h = (d) => {
      const g = Math.round(d.offsetX / l.clientWidth * r), w = Math.max(t, Math.min(i, (l.clientHeight - d.offsetY) / l.clientHeight * m + t));
      if (g < 0 || g >= r) return;
      o.forEach((f) => f.r.baseVal.value = 1.5), o[g].r.baseVal.value = 3;
      const v = a[g];
      d.buttons == 1 && v.set(w);
    };
    l.addEventListener("mousemove", h), l.addEventListener("mousedown", h), l.addEventListener("mouseleave", () => {
      o.forEach((d) => d.r.baseVal.value = 1.5);
    });
  }
  static {
    this.COLORS = ["red", "blue", "green", "yellow", "purple", "magenta", "cyan", "orange", "pink", "brown"];
  }
  dispose() {
    this.diposables.forEach((t) => t());
  }
}
class be extends J {
  async initialize(t) {
    return this._descriptorUrl = import.meta.resolve("./descriptor.json"), await this._loadDescriptor(), await super.initialize(t), this;
  }
  async createAudioNode(t) {
    await L.addModules(this.audioContext, this.moduleId);
    const i = new L(this);
    return await i._initialize(), t && i.setState(t), i;
  }
  async createGui() {
    return new P(this);
  }
}
export {
  be as CardboardWAM,
  be as default
};
