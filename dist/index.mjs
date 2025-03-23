var Y = class {
  static get isWebAudioModuleConstructor() {
    return !0;
  }
  static createInstance(l, t, i) {
    return new this(l, t).initialize(i);
  }
  constructor(l, t) {
    this._groupId = l, this._audioContext = t, this._initialized = !1, this._audioNode = void 0, this._timestamp = performance.now(), this._guiModuleUrl = void 0, this._descriptorUrl = "./descriptor.json", this._descriptor = {
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
  set audioNode(l) {
    this._audioNode = l;
  }
  get initialized() {
    return this._initialized;
  }
  set initialized(l) {
    this._initialized = l;
  }
  async createAudioNode(l) {
    throw new TypeError("createAudioNode() not provided");
  }
  async initialize(l) {
    return this._audioNode || (this.audioNode = await this.createAudioNode()), this.initialized = !0, this;
  }
  async _loadGui() {
    const l = this._guiModuleUrl;
    if (!l)
      throw new TypeError("Gui module not found");
    return import(
      /* webpackIgnore: true */
      l
    );
  }
  async _loadDescriptor() {
    const l = this._descriptorUrl;
    if (!l)
      throw new TypeError("Descriptor not found");
    const i = await (await fetch(l)).json();
    return Object.assign(this._descriptor, i), this._descriptor;
  }
  async createGui() {
    if (this.initialized || console.warn("Plugin should be initialized before getting the gui"), !this._guiModuleUrl)
      return;
    const { createElement: l } = await this._loadGui();
    return l(this);
  }
  destroyGui() {
  }
}, J = Y, X = (l) => {
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
      const a = Math.min(this._availableWrite(s, n), e.length), r = Math.min(this._storageCapacity() - n, a), c = a - r;
      return this._copy(e, 0, this.storage, n, r), this._copy(e, r, this.storage, 0, c), Atomics.store(this.write_ptr, 0, (n + a) % this._storageCapacity()), a;
    }
    pop(e) {
      const s = Atomics.load(this.read_ptr, 0), n = Atomics.load(this.write_ptr, 0);
      if (n === s)
        return 0;
      const a = !Number.isInteger(e), r = Math.min(this._availableRead(s, n), a ? e.length : e);
      if (a) {
        const c = Math.min(this._storageCapacity() - s, r), m = r - c;
        this._copy(this.storage, s, e, 0, c), this._copy(this.storage, 0, e, c, m);
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
      for (let c = 0; c < r; c++)
        n[a + c] = e[s + c];
    }
  }
  if (t.AudioWorkletProcessor) {
    const h = t.webAudioModules.getModuleScope(l);
    h.RingBuffer || (h.RingBuffer = i);
  }
  return i;
}, j = X, Z = (l) => {
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
    const h = t.webAudioModules.getModuleScope(l);
    h.WamArrayRingBuffer || (h.WamArrayRingBuffer = i);
  }
  return i;
}, ee = Z, te = (l) => {
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
      this._eventSizeBytes = {}, this._encodeEventType = {}, this._decodeEventType = {}, ["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc", "wam-info"].forEach((c, m) => {
        let o = 0;
        switch (c) {
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
        this._eventSizeBytes[c] = o, this._encodeEventType[c] = m, this._decodeEventType[m] = c;
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
            const { data: c } = e, m = this._encodeParameterId[c.id], { value: o, normalized: p } = c;
            this._eventBytesView.setUint16(s, m), s += 2, this._eventBytesView.setFloat64(s, o), s += 8, this._eventBytesView.setUint8(s, p ? 1 : 0), s += 1;
          }
          break;
        case "wam-transport":
          {
            const r = this._eventSizeBytes[n];
            s = this._writeHeader(r, n, a);
            const { data: c } = e, {
              currentBar: m,
              currentBarStarted: o,
              tempo: p,
              timeSigNumerator: _,
              timeSigDenominator: u,
              playing: d
            } = c;
            this._eventBytesView.setUint32(s, m), s += 4, this._eventBytesView.setFloat64(s, o), s += 8, this._eventBytesView.setFloat64(s, p), s += 8, this._eventBytesView.setUint8(s, _), s += 1, this._eventBytesView.setUint8(s, u), s += 1, this._eventBytesView.setUint8(s, d ? 1 : 0), s += 1;
          }
          break;
        case "wam-mpe":
        case "wam-midi":
          {
            const r = this._eventSizeBytes[n];
            s = this._writeHeader(r, n, a);
            const { data: c } = e, { bytes: m } = c;
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
              const { data: _ } = e;
              r = new TextEncoder().encode(_.instanceId);
            } else {
              const { data: _ } = e;
              r = _.bytes;
            }
            const c = r.length, m = this._eventSizeBytes[n];
            s = this._writeHeader(m + c, n, a), this._eventBytesView.setUint32(s, c), s += 4;
            const o = s + c;
            o > this._eventBytesAvailable && console.error(`Event requires ${o} bytes but only ${this._eventBytesAvailable} have been allocated!`), new Uint8Array(this._eventBytes, s, c).set(r), s += c;
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
          const c = !!this._eventBytesView.getUint8(e);
          if (e += 1, !(a in this._decodeParameterId))
            break;
          const m = this._decodeParameterId[a];
          return {
            type: s,
            time: n,
            data: {
              id: m,
              value: r,
              normalized: c
            }
          };
        }
        case "wam-transport": {
          const a = this._eventBytesView.getUint32(e);
          e += 4;
          const r = this._eventBytesView.getFloat64(e);
          e += 8;
          const c = this._eventBytesView.getFloat64(e);
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
              tempo: c,
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
        const c = e[r], m = this._encode(c), o = m.byteLength;
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
        const c = this._decode();
        c && e.push(c);
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
    const h = t.webAudioModules.getModuleScope(l);
    h.WamEventRingBuffer || (h.WamEventRingBuffer = i);
  }
  return i;
}, F = te, se = (l, t, ...i) => {
  const h = `(${t.toString()})(${i.map((s) => JSON.stringify(s)).join(", ")});`, e = URL.createObjectURL(new Blob([h], { type: "text/javascript" }));
  return l.addModule(e);
}, I = se, ie = (l) => {
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
    const h = t.webAudioModules.getModuleScope(l);
    h.WamParameter || (h.WamParameter = i);
  }
  return i;
}, ae = ie, ne = (l) => {
  const t = globalThis, i = (r, c) => c === 0 ? r : r ** 1.5 ** -c, h = (r, c) => c === 0 ? r : r ** 1.5 ** c, e = (r, c, m, o = 0) => i(c === 0 && m === 1 ? r : (r - c) / (m - c) || 0, o), s = (r, c, m, o = 0) => c === 0 && m === 1 ? h(r, o) : h(r, o) * (m - c) + c, n = (r, c, m) => r >= c && r <= m;
  class a {
    constructor(c, m = {}) {
      let {
        type: o,
        label: p,
        defaultValue: _,
        minValue: u,
        maxValue: d,
        discreteStep: g,
        exponent: y,
        choices: v,
        units: f
      } = m;
      o === void 0 && (o = "float"), p === void 0 && (p = ""), _ === void 0 && (_ = 0), v === void 0 && (v = []), o === "boolean" || o === "choice" ? (g = 1, u = 0, v.length ? d = v.length - 1 : d = 1) : (u === void 0 && (u = 0), d === void 0 && (d = 1), g === void 0 && (g = 0), y === void 0 && (y = 0), f === void 0 && (f = ""));
      const b = `Param config error | ${c}: `;
      if (u >= d)
        throw Error(b.concat("minValue must be less than maxValue"));
      if (!n(_, u, d))
        throw Error(b.concat("defaultValue out of range"));
      if (g % 1 || g < 0)
        throw Error(b.concat("discreteStep must be a non-negative integer"));
      if (g > 0 && (u % 1 || d % 1 || _ % 1))
        throw Error(b.concat("non-zero discreteStep requires integer minValue, maxValue, and defaultValue"));
      if (o === "choice" && !v.length)
        throw Error(b.concat("choice type parameter requires list of strings in choices"));
      this.id = c, this.label = p, this.type = o, this.defaultValue = _, this.minValue = u, this.maxValue = d, this.discreteStep = g, this.exponent = y, this.choices = v, this.units = f;
    }
    normalize(c) {
      return e(c, this.minValue, this.maxValue, this.exponent);
    }
    denormalize(c) {
      return s(c, this.minValue, this.maxValue, this.exponent);
    }
    valueString(c) {
      return this.choices ? this.choices[c] : this.units !== "" ? `${c} ${this.units}` : `${c}`;
    }
  }
  if (t.AudioWorkletProcessor) {
    const r = t.webAudioModules.getModuleScope(l);
    r.WamParameterInfo || (r.WamParameterInfo = a);
  }
  return a;
}, re = ne, oe = (l) => {
  const t = globalThis, i = 128, h = "0_0";
  class e {
    static _tables;
    static _tableReferences;
    constructor(n, a, r = 0) {
      e._tables || (e._tables = { nullTableKey: new Float32Array(0) }, e._tableReferences = { nullTableKey: [] }), this.info = n, this.values = new Float32Array(i), this._tableKey = h, this._table = e._tables[this._tableKey], this._skew = 2;
      const { discreteStep: c } = n;
      this._discrete = !!c, this._N = this._discrete ? 0 : a, this._n = 0, this._startValue = n.defaultValue, this._endValue = n.defaultValue, this._currentValue = n.defaultValue, this._deltaValue = 0, this._inverted = !1, this._changed = !0, this._filled = 0, this._discrete ? this._skew = 0 : this.setSkew(r), this.setStartValue(this._startValue);
    }
    _removeTableReference(n) {
      if (n === h)
        return;
      const { id: a } = this.info, r = e._tableReferences[n];
      if (r) {
        const c = r.indexOf(a);
        c !== -1 && r.splice(c, 1), r.length === 0 && (delete e._tables[n], delete e._tableReferences[n]);
      }
    }
    setSkew(n) {
      if (this._skew === n || this._discrete)
        return;
      if (n < -1 || n > 1)
        throw Error("skew must be in range [-1.0, 1.0]");
      const a = [this._N, n].join("_"), r = this._tableKey, { id: c } = this.info;
      if (a !== r) {
        if (e._tables[a]) {
          const m = e._tableReferences[a];
          m ? m.push(c) : e._tableReferences[a] = [c];
        } else {
          let m = Math.abs(n);
          m = Math.pow(3 - m, m * (m + 2));
          const o = m === 1, p = this._N, _ = new Float32Array(p + 1);
          if (o)
            for (let u = 0; u <= p; ++u)
              _[u] = u / p;
          else
            for (let u = 0; u <= p; ++u)
              _[u] = (u / p) ** m;
          e._tables[a] = _, e._tableReferences[a] = [c];
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
      let c = 0;
      const m = this._N - this._n;
      if (this._discrete || !m)
        c = r;
      else {
        if (m < r && (c = Math.min(r - m, i), a -= c), a > n)
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
        c > 0 && (n = a, a += c);
      }
      c > 0 && (this.values.fill(this._endValue, n, a), this._filled += c), this._currentValue = this.values[a - 1], this._n === this._N && (this._changed ? this._filled >= this.values.length && (this.setStartValue(this._endValue, !1), this._changed = !0, this._filled = this.values.length) : this._changed = !0);
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
    const s = t.webAudioModules.getModuleScope(l);
    s.WamParameterInterpolator || (s.WamParameterInterpolator = e);
  }
  return e;
}, Q = oe, le = (l) => {
  const t = globalThis, {
    AudioWorkletProcessor: i,
    webAudioModules: h
  } = t, e = t.webAudioModules.getModuleScope(l), {
    RingBuffer: s,
    WamEventRingBuffer: n,
    WamParameter: a,
    WamParameterInterpolator: r
  } = e;
  class c extends i {
    constructor(o) {
      super();
      const {
        groupId: p,
        moduleId: _,
        instanceId: u,
        useSab: d
      } = o.processorOptions;
      if (!_)
        throw Error("must provide moduleId argument in processorOptions!");
      if (!u)
        throw Error("must provide instanceId argument in processorOptions!");
      this.groupId = p, this.moduleId = _, this.instanceId = u, this._samplesPerQuantum = 128, this._compensationDelay = 0, this._parameterInfo = {}, this._parameterState = {}, this._parameterInterpolators = {}, this._eventQueue = [], this._pendingResponses = {}, this._useSab = !!d && !!globalThis.SharedArrayBuffer, this._eventSabReady = !1, this._audioToMainEventSab = null, this._mainToAudioEventSab = null, this._eventWriter = null, this._eventReader = null, this._initialized = !1, this._destroyed = !1, this._eventQueueRequiresSort = !1, h.addWam(this), this.port.onmessage = this._onMessage.bind(this), this._useSab && this._configureSab();
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
      h.emitEvents(this, ...o);
    }
    clearEvents() {
      this._eventQueue = [];
    }
    process(o, p, _) {
      if (!this._initialized)
        return !0;
      if (this._destroyed)
        return !1;
      this._eventSabReady && this.scheduleEvents(...this._eventReader.read());
      const u = this._getProcessingSlices();
      let d = 0;
      for (; d < u.length; ) {
        const { range: g, events: y } = u[d], [v, f] = g;
        let b = 0;
        for (; b < y.length; )
          this._processEvent(y[b]), b++;
        this._interpolateParameterValues(v, f), this._process(v, f, o, p, _), d++;
      }
      return !0;
    }
    destroy() {
      this._destroyed = !0, this.port.close(), h.removeWam(this);
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
          request: _,
          content: u
        } = o.data, d = { id: p, response: _ }, g = _.split("/"), y = g[0], v = g[1];
        if (d.content = "error", y === "get")
          if (v === "parameterInfo") {
            let { parameterIds: f } = u;
            f.length || (f = Object.keys(this._parameterInfo));
            const b = {};
            let S = 0;
            for (; S < f.length; ) {
              const V = f[S];
              b[V] = this._parameterInfo[V], S++;
            }
            d.content = b;
          } else if (v === "parameterValues") {
            let { normalized: f, parameterIds: b } = u;
            d.content = this._getParameterValues(f, b);
          } else v === "state" ? d.content = this._getState() : v === "compensationDelay" && (d.content = this.getCompensationDelay());
        else if (y === "set") {
          if (v === "parameterValues") {
            const { parameterValues: f } = u;
            this._setParameterValues(f, !0), delete d.content;
          } else if (v === "state") {
            const { state: f } = u;
            this._setState(f), delete d.content;
          }
        } else if (y === "add") {
          if (v === "event") {
            const { event: f } = u;
            this._eventQueue.push({ id: p, event: f }), this._eventQueueRequiresSort = this._eventQueue.length > 1;
            return;
          }
        } else if (y === "remove") {
          if (v === "events") {
            const f = this._eventQueue.map((b) => b.id);
            this.clearEvents(), d.content = f;
          }
        } else if (y === "connect") {
          if (v === "events") {
            const { wamInstanceId: f, output: b } = u;
            this._connectEvents(f, b), delete d.content;
          }
        } else if (y === "disconnect") {
          if (v === "events") {
            const { wamInstanceId: f, output: b } = u;
            this._disconnectEvents(f, b), delete d.content;
          }
        } else if (y === "initialize") {
          if (v === "processor")
            this._initialize(), this._initialized = !0, delete d.content;
          else if (v === "eventSab") {
            const { mainToAudioEventSab: f, audioToMainEventSab: b } = u;
            this._audioToMainEventSab = b, this._mainToAudioEventSab = f;
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
      const _ = {};
      (!p || !p.length) && (p = Object.keys(this._parameterState));
      let u = 0;
      for (; u < p.length; ) {
        const d = p[u], g = this._parameterState[d];
        _[d] = {
          id: d,
          value: o ? g.normalizedValue : g.value,
          normalized: o
        }, u++;
      }
      return _;
    }
    _setParameterValues(o, p) {
      const _ = Object.keys(o);
      let u = 0;
      for (; u < _.length; )
        this._setParameterValue(o[_[u]], p), u++;
    }
    _setParameterValue(o, p) {
      const { id: _, value: u, normalized: d } = o, g = this._parameterState[_];
      if (!g)
        return;
      d ? g.normalizedValue = u : g.value = u;
      const y = this._parameterInterpolators[_];
      p ? y.setEndValue(g.value) : y.setStartValue(g.value);
    }
    _interpolateParameterValues(o, p) {
      const _ = Object.keys(this._parameterInterpolators);
      let u = 0;
      for (; u < _.length; )
        this._parameterInterpolators[_[u]].process(o, p), u++;
    }
    _connectEvents(o, p) {
      h.connectEvents(this.groupId, this.instanceId, o, p);
    }
    _disconnectEvents(o, p) {
      if (typeof o > "u") {
        h.disconnectEvents(this.groupId, this.instanceId);
        return;
      }
      h.disconnectEvents(this.groupId, this.instanceId, o, p);
    }
    _getProcessingSlices() {
      const o = "add/event", { currentTime: p, sampleRate: _ } = t, u = {};
      this._eventQueueRequiresSort && (this._eventQueue.sort((f, b) => f.event.time - b.event.time), this._eventQueueRequiresSort = !1);
      let d = 0;
      for (; d < this._eventQueue.length; ) {
        const { id: f, event: b } = this._eventQueue[d], S = b.time - p, V = S > 0 ? Math.round(S * _) : 0;
        if (V < this._samplesPerQuantum)
          u[V] ? u[V].push(b) : u[V] = [b], f ? this.port.postMessage({ id: f, response: o }) : this._eventSabReady ? this._eventWriter.write(b) : this.port.postMessage({ event: b }), this._eventQueue.shift(), d = -1;
        else
          break;
        d++;
      }
      const g = [], y = Object.keys(u);
      y[0] !== "0" && (y.unshift("0"), u[0] = []);
      const v = y.length - 1;
      for (d = 0; d < y.length; ) {
        const f = y[d], b = parseInt(f), S = d < v ? parseInt(y[d + 1]) : this._samplesPerQuantum;
        g.push({ range: [b, S], events: u[f] }), d++;
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
    _process(o, p, _, u, d) {
      console.error("_process not implemented!");
    }
  }
  return t.AudioWorkletProcessor && (e.WamProcessor || (e.WamProcessor = c)), c;
}, ce = le, x = j(), z = F(), ue = class extends AudioWorkletNode {
  static async addModules(l, t) {
    const { audioWorklet: i } = l;
    await I(i, j, t), await I(i, F, t), await I(i, ee, t), await I(i, ae, t), await I(i, re, t), await I(i, Q, t), await I(i, ce, t);
  }
  constructor(l, t) {
    const { audioContext: i, groupId: h, moduleId: e, instanceId: s } = l;
    t.processorOptions = {
      groupId: h,
      moduleId: e,
      instanceId: s,
      ...t.processorOptions
    }, super(i, e, t), this.module = l, this._supportedEventTypes = /* @__PURE__ */ new Set(["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc"]), this._messageId = 1, this._pendingResponses = {}, this._pendingEvents = {}, this._useSab = !1, this._eventSabReady = !1, this._destroyed = !1, this.port.onmessage = this._onMessage.bind(this);
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
  async getParameterInfo(...l) {
    const t = "get/parameterInfo", i = this._generateMessageId();
    return new Promise((h) => {
      this._pendingResponses[i] = h, this.port.postMessage({
        id: i,
        request: t,
        content: { parameterIds: l }
      });
    });
  }
  async getParameterValues(l, ...t) {
    const i = "get/parameterValues", h = this._generateMessageId();
    return new Promise((e) => {
      this._pendingResponses[h] = e, this.port.postMessage({
        id: h,
        request: i,
        content: { normalized: l, parameterIds: t }
      });
    });
  }
  async setParameterValues(l) {
    const t = "set/parameterValues", i = this._generateMessageId();
    return new Promise((h) => {
      this._pendingResponses[i] = h, this.port.postMessage({
        id: i,
        request: t,
        content: { parameterValues: l }
      });
    });
  }
  async getState() {
    const l = "get/state", t = this._generateMessageId();
    return new Promise((i) => {
      this._pendingResponses[t] = i, this.port.postMessage({ id: t, request: l });
    });
  }
  async setState(l) {
    const t = "set/state", i = this._generateMessageId();
    return new Promise((h) => {
      this._pendingResponses[i] = h, this.port.postMessage({
        id: i,
        request: t,
        content: { state: l }
      });
    });
  }
  async getCompensationDelay() {
    const l = "get/compensationDelay", t = this._generateMessageId();
    return new Promise((i) => {
      this._pendingResponses[t] = i, this.port.postMessage({ id: t, request: l });
    });
  }
  addEventListener(l, t, i) {
    this._supportedEventTypes.has(l) && super.addEventListener(l, t, i);
  }
  removeEventListener(l, t, i) {
    this._supportedEventTypes.has(l) && super.removeEventListener(l, t, i);
  }
  scheduleEvents(...l) {
    let t = 0;
    const i = l.length;
    for (this._eventSabReady && (t = this._eventWriter.write(...l)); t < i; ) {
      const h = l[t], e = "add/event", s = this._generateMessageId();
      let n = !1;
      new Promise((a, r) => {
        this._pendingResponses[s] = a, this._pendingEvents[s] = () => {
          n || r();
        }, this.port.postMessage({
          id: s,
          request: e,
          content: { event: h }
        });
      }).then((a) => {
        n = !0, delete this._pendingEvents[s], this._onEvent(h);
      }).catch((a) => {
        delete this._pendingResponses[s];
      }), t++;
    }
  }
  async clearEvents() {
    const l = "remove/events", t = this._generateMessageId();
    if (Object.keys(this._pendingEvents).length)
      return new Promise((h) => {
        this._pendingResponses[t] = h, this.port.postMessage({ id: t, request: l });
      }).then((h) => {
        h.forEach((e) => {
          this._pendingEvents[e](), delete this._pendingEvents[e];
        });
      });
  }
  connectEvents(l, t) {
    const i = "connect/events", h = this._generateMessageId();
    new Promise((e, s) => {
      this._pendingResponses[h] = e, this.port.postMessage({
        id: h,
        request: i,
        content: { wamInstanceId: l, output: t }
      });
    });
  }
  disconnectEvents(l, t) {
    const i = "disconnect/events", h = this._generateMessageId();
    new Promise((e, s) => {
      this._pendingResponses[h] = e, this.port.postMessage({
        id: h,
        request: i,
        content: { wamInstanceId: l, output: t }
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
    const l = "initialize/processor", t = this._generateMessageId();
    return new Promise((i) => {
      this._pendingResponses[t] = i, this.port.postMessage({ id: t, request: l });
    });
  }
  _onMessage(l) {
    const { data: t } = l, { response: i, event: h, eventSab: e } = t;
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
      new Promise((c, m) => {
        this._pendingResponses[r] = c, this.port.postMessage({
          id: r,
          request: a,
          content: {
            mainToAudioEventSab: this._mainToAudioEventSab,
            audioToMainEventSab: this._audioToMainEventSab
          }
        });
      }).then((c) => {
        this._eventSabReady = !0, this._audioToMainInterval = setInterval(() => {
          this._eventReader.read().forEach((o) => {
            this._onEvent(o);
          });
        }, 100);
      });
    } else h && this._onEvent(h);
  }
  _onEvent(l) {
    const { type: t } = l;
    this.dispatchEvent(new CustomEvent(t, {
      bubbles: !0,
      detail: l
    }));
  }
};
class N extends ue {
  constructor(t) {
    super(t, {
      channelCount: 2,
      numberOfOutputs: 1
    });
  }
  static async addModules(t, i) {
    await super.addModules(t, i), await I(t.audioWorklet, Q, i), await I(t.audioWorklet, he, i);
  }
}
function he(l) {
  const t = globalThis, i = t.webAudioModules.getModuleScope(l), h = i.WamProcessor, e = i.WamParameterInfo, s = 30, n = Array.from({ length: 256 }, (p, _) => 1 / (Math.pow(2, (_ - 69) / 12) * 440)), a = 1, r = 2, c = 3;
  function m(p, _, u, d, g) {
    let y, v;
    if (d)
      y = (Math.floor(u * p.length) + p.length) % p.length, v = (y + 1) % p.length;
    else {
      const f = Math.floor(u * p.length);
      y = Math.min(f, p.length - 1), v = Math.min(y + 1, p.length - 1);
    }
    if (g) {
      const f = u * p.length - Math.floor(u * p.length);
      return p[y][_] * (1 - f) + p[v][_] * f;
    } else return p[y][_];
  }
  class o extends h {
    constructor() {
      super(...arguments), this.notes = {};
    }
    _process(_, u, d, g, y) {
      const v = Array.from({ length: s }, (R, w) => this._parameterInterpolators[`curve${w}`].values), f = Array.from({ length: s }, (R, w) => this._parameterInterpolators[`attack${w}`].values), b = this._parameterInterpolators.attack_duration.values, S = Array.from({ length: s }, (R, w) => this._parameterInterpolators[`sustain${w}`].values), V = this._parameterInterpolators.sustain_duration.values, A = this._parameterInterpolators.sustain_loop.values, W = Array.from({ length: s }, (R, w) => this._parameterInterpolators[`release${w}`].values), C = this._parameterInterpolators.release_duration.values, G = this._parameterInterpolators.interpolate.values;
      for (const R in this.notes) {
        const w = this.notes[R];
        for (let M = _; M < u; M++) {
          const $ = w.advancement + (M - _) / t.sampleRate, K = w.period;
          let H = m(v, M, $ / K, !0, G[M] > 0.5), k = 0;
          const T = $ - w.last_start;
          let O = !1;
          switch (w.step) {
            case a: {
              k = m(f, M, T / b[M], !1, !0), T > b[M] && (w.step = r, w.last_start = $, w.multiplier *= k);
              break;
            }
            case r: {
              const L = A[M] > 0.5;
              k = m(S, M, T / V[M], L, !0), !L && T > V[M] && (w.step = c, w.last_start = $, w.multiplier *= k), w.doStop && (w.step = c, w.last_start = $, w.multiplier *= k);
              break;
            }
            case c: {
              k = m(W, M, T / C[M], !1, !0), T > C[M] && (O = !0);
              break;
            }
          }
          if (O) {
            delete this.notes[R];
            break;
          }
          g[0][0][M] += H * k * w.multiplier;
        }
        w.advancement += (u - _) / t.sampleRate;
      }
    }
    _processEvent(_) {
      super._processEvent(_);
    }
    _onMidi(_) {
      const u = _.bytes[0] & 240, d = _.bytes[1], g = _.bytes[2];
      u == 128 || u == 144 && g == 0 ? this.notes[d] && (this.notes[d].doStop = !0) : u == 144 && g > 0 && (this.notes[d] = { advancement: 0, last_start: 0, period: n[d], multiplier: 1, step: a });
    }
    _generateWamParameterInfo() {
      const _ = {};
      for (let u = 0; u < s; u++) {
        const d = Math.sin(u / s * Math.PI * 2);
        _[`curve${u}`] = new e(`curve${u}`, {
          type: "float",
          label: `Curve Point ${u + 1}`,
          minValue: -1,
          maxValue: 1,
          defaultValue: d
        });
      }
      for (let u = 0; u < s; u++) {
        const d = Math.max(0, Math.sin(u / s * Math.PI * 0.5));
        _[`attack${u}`] = new e(`attack${u}`, {
          type: "float",
          label: `Attack Curve Point ${u + 1}`,
          minValue: 0,
          maxValue: 1,
          defaultValue: d
        });
      }
      _.attack_duration = new e("attack_duration", {
        type: "float",
        label: "Attack Curve Duration",
        minValue: 0,
        maxValue: 5,
        defaultValue: 1,
        units: "s"
      });
      for (let u = 0; u < s; u++)
        _[`sustain${u}`] = new e(`sustain${u}`, {
          type: "float",
          label: `Sustain Curve Point ${u + 1}`,
          minValue: 0,
          maxValue: 1,
          defaultValue: 1
        });
      _.sustain_duration = new e("sustain_duration", {
        type: "float",
        label: "Sustain Curve Duration",
        minValue: 0,
        maxValue: 5,
        defaultValue: 1,
        units: "s"
      }), _.sustain_loop = new e("sustain_loop", {
        type: "boolean",
        label: "Do Sustain Curve loop?",
        defaultValue: 1
      });
      for (let u = 0; u < s; u++) {
        const d = Math.max(0, Math.sin((u / s + 1) * Math.PI * 0.5));
        _[`release${u}`] = new e(`release${u}`, {
          type: "float",
          label: `Release Curve Point ${u + 1}`,
          minValue: 0,
          maxValue: 1,
          defaultValue: d
        });
      }
      return _.release_duration = new e("release_duration", {
        type: "float",
        label: "Release Curve Duration",
        minValue: 0,
        maxValue: 5,
        defaultValue: 1,
        units: "s"
      }), _.interpolate = new e("interpolate", {
        type: "boolean",
        label: "Interpolate",
        defaultValue: 1
      }), _;
    }
  }
  try {
    t.registerProcessor(l, o);
  } catch {
  }
}
var de = Object.defineProperty, pe = (l, t, i) => t in l ? de(l, t, { enumerable: !0, configurable: !0, writable: !0, value: i }) : l[t] = i, U = (l, t, i) => pe(l, typeof t != "symbol" ? t + "" : t, i);
function D(l) {
  return l.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function E(l, ...t) {
  let i = "", h = [], e = [];
  function s(a) {
    if (a != null) if (a instanceof Node)
      i += `<span id="_sam_frament_target_${h.length}"></span>`, h.push(a);
    else if (typeof a == "string") i += D(a);
    else if (typeof a[Symbol.iterator] == "function")
      for (const r of a) s(r);
    else typeof a == "function" ? s(a()) : i += D("" + a);
  }
  for (let a = 0; a < t.length; a++)
    l[a].endsWith("@") && (typeof t[a] == "function" || typeof t[a] == "object") ? (i += l[a].slice(0, -1), i += `_sam_fragment_to_call_${e.length}=sam`, e.push(t[a])) : (i += l[a], s(t[a]));
  i += l[l.length - 1];
  const n = document.createRange().createContextualFragment(i);
  for (let a = 0; a < h.length; a++) {
    const r = n.getElementById(`_sam_frament_target_${a}`);
    r?.replaceWith(h[a]);
  }
  for (let a = 0; a < e.length; a++) {
    const r = n.querySelector(`[_sam_fragment_to_call_${a}]`);
    r?.removeAttribute(`_sam_fragment_to_call_${a}`);
    const c = e[a];
    if (typeof c == "function") c();
    else for (const [m, o] of Object.entries(e[a]))
      m == "init" ? o(r) : r?.addEventListener(m, o);
  }
  return n;
}
E.opt = function(l, ...t) {
  if (!(t.includes(null) || t.includes(void 0)))
    return E(l, ...t);
};
E.not_empty = function(l, ...t) {
  if (!t.every((i) => i == null || i.length && i.length === 0))
    return E(l, ...t);
};
E.a = function(l, ...t) {
  return E(l, ...t).firstElementChild;
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
    const i = this, { value_map: h } = this;
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
    const i = new ve(0), h = i.set, { node: e } = this;
    return i.set = function(s) {
      h.call(this, s), e.setParameterValues({ [t]: { id: t, normalized: !1, value: s } });
    }, this.value_map[t] = i, i;
  }
  dispose() {
    this.disposed = !0;
  }
}
class q {
  constructor(t, i, h) {
    this.element = E.a`
            <div>
                <label for="${i}">${h}</label>
                <input type="checkbox" id="${i}" />
            </div>
        `;
    const e = this.element.children[1];
    this.dispose = t.link(({ to: s }) => e.checked = s > 0.5), e.addEventListener("input", () => t.set(e.checked ? 1 : 0));
  }
}
const ye = "" + new URL("cardboard.css", import.meta.url).href, be = "aa";
class P extends HTMLElement {
  constructor(t) {
    super(), this.wam = t, this.#t = [], this.selectedMenu = "wave", this.#s = this.attachShadow({ mode: "closed" }), this.#e = new ge(t.audioNode), this.wave = Array.from({ length: P.RESOLUTION }, (i, h) => this.#e.addParameter(`curve${h}`)), this.attack = Array.from({ length: P.RESOLUTION }, (i, h) => this.#e.addParameter(`attack${h}`)), this.release = Array.from({ length: P.RESOLUTION }, (i, h) => this.#e.addParameter(`release${h}`)), this.sustain = Array.from({ length: P.RESOLUTION }, (i, h) => this.#e.addParameter(`sustain${h}`)), this.interpolate = this.#e.addParameter("interpolate"), this.attack_duration = this.#e.addParameter("attack_duration"), this.release_duration = this.#e.addParameter("release_duration"), this.sustain_duration = this.#e.addParameter("sustain_duration"), this.sustain_loop = this.#e.addParameter("sustain_loop");
  }
  static {
    this.NAME = `card-cardboard${be}`;
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
        [],
        this.wave
      ), s = new q(this.interpolate, "Interpolate curve points", "interpolate");
      i = E`
                ${e.element}
                <div id="options">
                    ${s.element}
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
      i = E`
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
      i = E`
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
      i = E`
                ${e.element}
            `, this.#t.push(() => e.dispose());
    }
    function h(e) {
      t.selectedMenu = e.target.id.replace("_menu", ""), t.connectedCallback();
    }
    this.#s.replaceChildren(E`
            <link rel="stylesheet" crossorigin href="${ye}" />
            <h1>Cardboardizer</h1>
            <ul class="menu">
                <li id=wave_menu @${{ click: h }}>Wave</li>
                <li id=attack_menu @${{ click: h }}>Attack</li>
                <li id=sustain_menu @${{ click: h }}>Sustain</li>
                <li id=release_menu @${{ click: h }}>Release</li>
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
  constructor(t, i, h, e, s, n, a) {
    this.diposables = [];
    const r = a.length, { diposables: c } = this, m = i - t, o = [], p = Math.round(100 - (h - t) / m * 100);
    this.element = E.a`
            <div class=curve>
                <svg viewBox="0 0 200 100">
                    <text x=0 y=7 fill=white style="font-size: .5rem">${i}</text>
                    <text x=0 y=97 fill=white style="font-size: .5rem">${t}</text>
                    <line x1=0 y1=${p} x2=200 y2=${p} stroke=white stroke-width=1 />
                    ${function* () {
      let d = 0;
      for (const { name: g, index: y } of n) {
        const v = y / r * 200, f = B.COLORS[d % B.COLORS.length];
        yield E`<svg><text x=${v + 2} y=80 fill=${f} style="font-size: .5rem">${g}</text></svg>`, yield E`<svg><line x1=${v} y1=0 x2=${v} y2=100 stroke=${f} stroke-width=1 /></svg>`, d++;
      }
    }}
                    ${function* () {
      const d = 200 / r, g = e ? -1 : 0, y = e ? r : r - 1;
      for (let v = g; v < y; v++) {
        const f = (v + r) % r, b = (f + 1) % r, S = a[f], V = a[b], A = E.a`<svg><line stroke=black stroke-width=1 /></svg>`.children[0];
        A.x1.baseVal.value = (v + 0.5) * d, A.x2.baseVal.value = (v + 1.5) * d;
        const W = () => {
          A.y1.baseVal.value = 100 - (S.value - t) / m * 100, A.y2.baseVal.value = 100 - (V.value - t) / m * 100;
        };
        c.push(S.observable.add(W)), c.push(V.observable.add(W)), W(), yield A;
      }
      for (let v = 0; v < r; v++) {
        const f = a[v], b = E.a`<svg><circle r=1.5 stroke=white stroke-width=1 fill=black /></svg>`.children[0];
        b.cx.baseVal.value = (v + 0.5) * d, c.push(f.link(({ to: S }) => {
          b.cy.baseVal.value = 100 - (f.value - t) / m * 100;
        })), o.push(b), yield b;
      }
    }}
                </svg>
                ${() => {
      if (s) {
        const d = E.a`
                            <div>
                                <input type="range" min=${s.min} max=${s.max} step=${s.step} />
                                <label for="curve_length">${s.name}</label>
                            </div>
                        `, g = d.children[1], y = d.children[0];
        return s.value.link(({ to: v }) => {
          y.value = v.toString(), g.textContent = `${s.name} (${v}${s.unit ? ` ${s.unit}` : ""})`;
        }), y.addEventListener("input", () => s.value.set(parseFloat(y.value))), d;
      } else
        return;
    }}
                
            </div>
        `;
    const _ = this.element.children[0], u = (d) => {
      const g = Math.round(d.offsetX / _.clientWidth * r), y = Math.max(t, Math.min(i, (_.clientHeight - d.offsetY) / _.clientHeight * m + t));
      if (g < 0 || g >= r) return;
      o.forEach((f) => f.r.baseVal.value = 1.5), o[g].r.baseVal.value = 3;
      const v = a[g];
      d.buttons == 1 && v.set(y);
    };
    _.addEventListener("mousemove", u), _.addEventListener("mousedown", u), _.addEventListener("mouseleave", () => {
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
class we extends J {
  async initialize(t) {
    return this._descriptorUrl = import.meta.resolve("./descriptor.json"), await this._loadDescriptor(), await super.initialize(t), this;
  }
  async createAudioNode(t) {
    await N.addModules(this.audioContext, this.moduleId);
    const i = new N(this);
    return await i._initialize(), t && i.setState(t), i;
  }
  async createGui() {
    return new P(this);
  }
}
export {
  we as CardboardWAM,
  we as default
};
