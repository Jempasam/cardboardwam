var Y = class {
  static get isWebAudioModuleConstructor() {
    return !0;
  }
  static createInstance(d, a, s) {
    return new this(d, a).initialize(s);
  }
  constructor(d, a) {
    this._groupId = d, this._audioContext = a, this._initialized = !1, this._audioNode = void 0, this._timestamp = performance.now(), this._guiModuleUrl = void 0, this._descriptorUrl = "./descriptor.json", this._descriptor = {
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
  set audioNode(d) {
    this._audioNode = d;
  }
  get initialized() {
    return this._initialized;
  }
  set initialized(d) {
    this._initialized = d;
  }
  async createAudioNode(d) {
    throw new TypeError("createAudioNode() not provided");
  }
  async initialize(d) {
    return this._audioNode || (this.audioNode = await this.createAudioNode()), this.initialized = !0, this;
  }
  async _loadGui() {
    const d = this._guiModuleUrl;
    if (!d)
      throw new TypeError("Gui module not found");
    return import(
      /* webpackIgnore: true */
      d
    );
  }
  async _loadDescriptor() {
    const d = this._descriptorUrl;
    if (!d)
      throw new TypeError("Descriptor not found");
    const s = await (await fetch(d)).json();
    return Object.assign(this._descriptor, s), this._descriptor;
  }
  async createGui() {
    if (this.initialized || console.warn("Plugin should be initialized before getting the gui"), !this._guiModuleUrl)
      return;
    const { createElement: d } = await this._loadGui();
    return d(this);
  }
  destroyGui() {
  }
}, X = Y, J = (d) => {
  const a = globalThis;
  class s {
    static getStorageForCapacity(e, t) {
      if (!t.BYTES_PER_ELEMENT)
        throw new Error("Pass in a ArrayBuffer subclass");
      const l = 8 + (e + 1) * t.BYTES_PER_ELEMENT;
      return new SharedArrayBuffer(l);
    }
    constructor(e, t) {
      if (!t.BYTES_PER_ELEMENT)
        throw new Error("Pass a concrete typed array class as second argument");
      this._Type = t, this._capacity = (e.byteLength - 8) / t.BYTES_PER_ELEMENT, this.buf = e, this.write_ptr = new Uint32Array(this.buf, 0, 1), this.read_ptr = new Uint32Array(this.buf, 4, 1), this.storage = new t(this.buf, 8, this._capacity);
    }
    get type() {
      return this._Type.name;
    }
    push(e) {
      const t = Atomics.load(this.read_ptr, 0), l = Atomics.load(this.write_ptr, 0);
      if ((l + 1) % this._storageCapacity() === t)
        return 0;
      const i = Math.min(this._availableWrite(t, l), e.length), r = Math.min(this._storageCapacity() - l, i), c = i - r;
      return this._copy(e, 0, this.storage, l, r), this._copy(e, r, this.storage, 0, c), Atomics.store(this.write_ptr, 0, (l + i) % this._storageCapacity()), i;
    }
    pop(e) {
      const t = Atomics.load(this.read_ptr, 0), l = Atomics.load(this.write_ptr, 0);
      if (l === t)
        return 0;
      const i = !Number.isInteger(e), r = Math.min(this._availableRead(t, l), i ? e.length : e);
      if (i) {
        const c = Math.min(this._storageCapacity() - t, r), h = r - c;
        this._copy(this.storage, t, e, 0, c), this._copy(this.storage, 0, e, c, h);
      }
      return Atomics.store(this.read_ptr, 0, (t + r) % this._storageCapacity()), r;
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
      const e = Atomics.load(this.read_ptr, 0), t = Atomics.load(this.write_ptr, 0);
      return this._availableRead(e, t);
    }
    get availableWrite() {
      const e = Atomics.load(this.read_ptr, 0), t = Atomics.load(this.write_ptr, 0);
      return this._availableWrite(e, t);
    }
    _availableRead(e, t) {
      return t > e ? t - e : t + this._storageCapacity() - e;
    }
    _availableWrite(e, t) {
      let l = e - t - 1;
      return t >= e && (l += this._storageCapacity()), l;
    }
    _storageCapacity() {
      return this._capacity;
    }
    _copy(e, t, l, i, r) {
      for (let c = 0; c < r; c++)
        l[i + c] = e[t + c];
    }
  }
  if (a.AudioWorkletProcessor) {
    const f = a.webAudioModules.getModuleScope(d);
    f.RingBuffer || (f.RingBuffer = s);
  }
  return s;
}, j = J, Z = (d) => {
  const a = globalThis;
  class s {
    static DefaultArrayCapacity = 2;
    static getStorageForEventCapacity(e, t, l, i = void 0) {
      if (i === void 0 ? i = s.DefaultArrayCapacity : i = Math.max(i, s.DefaultArrayCapacity), !l.BYTES_PER_ELEMENT)
        throw new Error("Pass in a ArrayBuffer subclass");
      const r = t * i;
      return e.getStorageForCapacity(r, l);
    }
    constructor(e, t, l, i, r = void 0) {
      if (!i.BYTES_PER_ELEMENT)
        throw new Error("Pass in a ArrayBuffer subclass");
      this._arrayLength = l, this._arrayType = i, this._arrayElementSizeBytes = i.BYTES_PER_ELEMENT, this._arraySizeBytes = this._arrayLength * this._arrayElementSizeBytes, this._sab = t, r === void 0 ? r = s.DefaultArrayCapacity : r = Math.max(r, s.DefaultArrayCapacity), this._arrayArray = new i(this._arrayLength), this._rb = new e(this._sab, i);
    }
    write(e) {
      if (e.length !== this._arrayLength || this._rb.availableWrite < this._arrayLength)
        return !1;
      let l = !0;
      return this._rb.push(e) != this._arrayLength && (l = !1), l;
    }
    read(e, t) {
      if (e.length !== this._arrayLength)
        return !1;
      const l = this._rb.availableRead;
      if (l < this._arrayLength)
        return !1;
      t && l > this._arrayLength && this._rb.pop(l - this._arrayLength);
      let i = !1;
      return this._rb.pop(e) === this._arrayLength && (i = !0), i;
    }
  }
  if (a.AudioWorkletProcessor) {
    const f = a.webAudioModules.getModuleScope(d);
    f.WamArrayRingBuffer || (f.WamArrayRingBuffer = s);
  }
  return s;
}, ee = Z, ae = (d) => {
  const a = globalThis;
  class s {
    static DefaultExtraBytesPerEvent = 64;
    static WamEventBaseBytes = 13;
    static WamAutomationEventBytes = s.WamEventBaseBytes + 2 + 8 + 1;
    static WamTransportEventBytes = s.WamEventBaseBytes + 4 + 8 + 8 + 1 + 1 + 1;
    static WamMidiEventBytes = s.WamEventBaseBytes + 1 + 1 + 1;
    static WamBinaryEventBytes = s.WamEventBaseBytes + 4;
    static getStorageForEventCapacity(e, t, l = void 0) {
      l === void 0 ? l = s.DefaultExtraBytesPerEvent : l = Math.max(l, s.DefaultExtraBytesPerEvent);
      const i = (Math.max(s.WamAutomationEventBytes, s.WamTransportEventBytes, s.WamMidiEventBytes, s.WamBinaryEventBytes) + l) * t;
      return e.getStorageForCapacity(i, Uint8Array);
    }
    constructor(e, t, l, i = void 0) {
      this._eventSizeBytes = {}, this._encodeEventType = {}, this._decodeEventType = {}, ["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc", "wam-info"].forEach((c, h) => {
        let n = 0;
        switch (c) {
          case "wam-automation":
            n = s.WamAutomationEventBytes;
            break;
          case "wam-transport":
            n = s.WamTransportEventBytes;
            break;
          case "wam-mpe":
          case "wam-midi":
            n = s.WamMidiEventBytes;
            break;
          case "wam-osc":
          case "wam-sysex":
          case "wam-info":
            n = s.WamBinaryEventBytes;
            break;
        }
        this._eventSizeBytes[c] = n, this._encodeEventType[c] = h, this._decodeEventType[h] = c;
      }), this._parameterCode = 0, this._parameterCodes = {}, this._encodeParameterId = {}, this._decodeParameterId = {}, this.setParameterIds(l), this._sab = t, i === void 0 ? i = s.DefaultExtraBytesPerEvent : i = Math.max(i, s.DefaultExtraBytesPerEvent), this._eventBytesAvailable = Math.max(s.WamAutomationEventBytes, s.WamTransportEventBytes, s.WamMidiEventBytes, s.WamBinaryEventBytes) + i, this._eventBytes = new ArrayBuffer(this._eventBytesAvailable), this._eventBytesView = new DataView(this._eventBytes), this._rb = new e(this._sab, Uint8Array), this._eventSizeArray = new Uint8Array(this._eventBytes, 0, 4), this._eventSizeView = new DataView(this._eventBytes, 0, 4);
    }
    _writeHeader(e, t, l) {
      let i = 0;
      return this._eventBytesView.setUint32(i, e), i += 4, this._eventBytesView.setUint8(i, this._encodeEventType[t]), i += 1, this._eventBytesView.setFloat64(i, Number.isFinite(l) ? l : -1), i += 8, i;
    }
    _encode(e) {
      let t = 0;
      const { type: l, time: i } = e;
      switch (e.type) {
        case "wam-automation":
          {
            if (!(e.data.id in this._encodeParameterId))
              break;
            const r = this._eventSizeBytes[l];
            t = this._writeHeader(r, l, i);
            const { data: c } = e, h = this._encodeParameterId[c.id], { value: n, normalized: m } = c;
            this._eventBytesView.setUint16(t, h), t += 2, this._eventBytesView.setFloat64(t, n), t += 8, this._eventBytesView.setUint8(t, m ? 1 : 0), t += 1;
          }
          break;
        case "wam-transport":
          {
            const r = this._eventSizeBytes[l];
            t = this._writeHeader(r, l, i);
            const { data: c } = e, {
              currentBar: h,
              currentBarStarted: n,
              tempo: m,
              timeSigNumerator: o,
              timeSigDenominator: u,
              playing: v
            } = c;
            this._eventBytesView.setUint32(t, h), t += 4, this._eventBytesView.setFloat64(t, n), t += 8, this._eventBytesView.setFloat64(t, m), t += 8, this._eventBytesView.setUint8(t, o), t += 1, this._eventBytesView.setUint8(t, u), t += 1, this._eventBytesView.setUint8(t, v ? 1 : 0), t += 1;
          }
          break;
        case "wam-mpe":
        case "wam-midi":
          {
            const r = this._eventSizeBytes[l];
            t = this._writeHeader(r, l, i);
            const { data: c } = e, { bytes: h } = c;
            let n = 0;
            for (; n < 3; )
              this._eventBytesView.setUint8(t, h[n]), t += 1, n++;
          }
          break;
        case "wam-osc":
        case "wam-sysex":
        case "wam-info":
          {
            let r = null;
            if (e.type === "wam-info") {
              const { data: o } = e;
              r = new TextEncoder().encode(o.instanceId);
            } else {
              const { data: o } = e;
              r = o.bytes;
            }
            const c = r.length, h = this._eventSizeBytes[l];
            t = this._writeHeader(h + c, l, i), this._eventBytesView.setUint32(t, c), t += 4;
            const n = t + c;
            n > this._eventBytesAvailable && console.error(`Event requires ${n} bytes but only ${this._eventBytesAvailable} have been allocated!`), new Uint8Array(this._eventBytes, t, c).set(r), t += c;
          }
          break;
      }
      return new Uint8Array(this._eventBytes, 0, t);
    }
    _decode() {
      let e = 0;
      const t = this._decodeEventType[this._eventBytesView.getUint8(e)];
      e += 1;
      let l = this._eventBytesView.getFloat64(e);
      switch (l === -1 && (l = void 0), e += 8, t) {
        case "wam-automation": {
          const i = this._eventBytesView.getUint16(e);
          e += 2;
          const r = this._eventBytesView.getFloat64(e);
          e += 8;
          const c = !!this._eventBytesView.getUint8(e);
          if (e += 1, !(i in this._decodeParameterId))
            break;
          const h = this._decodeParameterId[i];
          return {
            type: t,
            time: l,
            data: {
              id: h,
              value: r,
              normalized: c
            }
          };
        }
        case "wam-transport": {
          const i = this._eventBytesView.getUint32(e);
          e += 4;
          const r = this._eventBytesView.getFloat64(e);
          e += 8;
          const c = this._eventBytesView.getFloat64(e);
          e += 8;
          const h = this._eventBytesView.getUint8(e);
          e += 1;
          const n = this._eventBytesView.getUint8(e);
          e += 1;
          const m = this._eventBytesView.getUint8(e) == 1;
          return e += 1, {
            type: t,
            time: l,
            data: {
              currentBar: i,
              currentBarStarted: r,
              tempo: c,
              timeSigNumerator: h,
              timeSigDenominator: n,
              playing: m
            }
          };
        }
        case "wam-mpe":
        case "wam-midi": {
          const i = [0, 0, 0];
          let r = 0;
          for (; r < 3; )
            i[r] = this._eventBytesView.getUint8(e), e += 1, r++;
          return {
            type: t,
            time: l,
            data: { bytes: i }
          };
        }
        case "wam-osc":
        case "wam-sysex":
        case "wam-info": {
          const i = this._eventBytesView.getUint32(e);
          e += 4;
          const r = new Uint8Array(i);
          if (r.set(new Uint8Array(this._eventBytes, e, i)), e += i, t === "wam-info") {
            const h = { instanceId: new TextDecoder().decode(r) };
            return { type: t, time: l, data: h };
          } else
            return { type: t, time: l, data: { bytes: r } };
        }
      }
      return !1;
    }
    write(...e) {
      const t = e.length;
      let l = this._rb.availableWrite, i = 0, r = 0;
      for (; r < t; ) {
        const c = e[r], h = this._encode(c), n = h.byteLength;
        let m = 0;
        if (l >= n)
          n === 0 ? i++ : m = this._rb.push(h);
        else
          break;
        l -= m, r++;
      }
      return r - i;
    }
    read() {
      if (this._rb.empty)
        return [];
      const e = [];
      let t = this._rb.availableRead, l = 0;
      for (; t > 0; ) {
        l = this._rb.pop(this._eventSizeArray), t -= l;
        const i = this._eventSizeView.getUint32(0), r = new Uint8Array(this._eventBytes, 0, i - 4);
        l = this._rb.pop(r), t -= l;
        const c = this._decode();
        c && e.push(c);
      }
      return e;
    }
    setParameterIds(e) {
      this._encodeParameterId = {}, this._decodeParameterId = {}, e.forEach((t) => {
        let l = -1;
        t in this._parameterCodes ? l = this._parameterCodes[t] : (l = this._generateParameterCode(), this._parameterCodes[t] = l), this._encodeParameterId[t] = l, this._decodeParameterId[l] = t;
      });
    }
    _generateParameterCode() {
      if (this._parameterCode > 65535)
        throw Error("Too many parameters have been registered!");
      return this._parameterCode++;
    }
  }
  if (a.AudioWorkletProcessor) {
    const f = a.webAudioModules.getModuleScope(d);
    f.WamEventRingBuffer || (f.WamEventRingBuffer = s);
  }
  return s;
}, F = ae, te = (d, a, ...s) => {
  const f = `(${a.toString()})(${s.map((t) => JSON.stringify(t)).join(", ")});`, e = URL.createObjectURL(new Blob([f], { type: "text/javascript" }));
  return d.addModule(e);
}, M = te, se = (d) => {
  const a = globalThis;
  class s {
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
  if (a.AudioWorkletProcessor) {
    const f = a.webAudioModules.getModuleScope(d);
    f.WamParameter || (f.WamParameter = s);
  }
  return s;
}, ie = se, le = (d) => {
  const a = globalThis, s = (r, c) => c === 0 ? r : r ** 1.5 ** -c, f = (r, c) => c === 0 ? r : r ** 1.5 ** c, e = (r, c, h, n = 0) => s(c === 0 && h === 1 ? r : (r - c) / (h - c) || 0, n), t = (r, c, h, n = 0) => c === 0 && h === 1 ? f(r, n) : f(r, n) * (h - c) + c, l = (r, c, h) => r >= c && r <= h;
  class i {
    constructor(c, h = {}) {
      let {
        type: n,
        label: m,
        defaultValue: o,
        minValue: u,
        maxValue: v,
        discreteStep: p,
        exponent: g,
        choices: _,
        units: z
      } = h;
      n === void 0 && (n = "float"), m === void 0 && (m = ""), o === void 0 && (o = 0), _ === void 0 && (_ = []), n === "boolean" || n === "choice" ? (p = 1, u = 0, _.length ? v = _.length - 1 : v = 1) : (u === void 0 && (u = 0), v === void 0 && (v = 1), p === void 0 && (p = 0), g === void 0 && (g = 0), z === void 0 && (z = ""));
      const k = `Param config error | ${c}: `;
      if (u >= v)
        throw Error(k.concat("minValue must be less than maxValue"));
      if (!l(o, u, v))
        throw Error(k.concat("defaultValue out of range"));
      if (p % 1 || p < 0)
        throw Error(k.concat("discreteStep must be a non-negative integer"));
      if (p > 0 && (u % 1 || v % 1 || o % 1))
        throw Error(k.concat("non-zero discreteStep requires integer minValue, maxValue, and defaultValue"));
      if (n === "choice" && !_.length)
        throw Error(k.concat("choice type parameter requires list of strings in choices"));
      this.id = c, this.label = m, this.type = n, this.defaultValue = o, this.minValue = u, this.maxValue = v, this.discreteStep = p, this.exponent = g, this.choices = _, this.units = z;
    }
    normalize(c) {
      return e(c, this.minValue, this.maxValue, this.exponent);
    }
    denormalize(c) {
      return t(c, this.minValue, this.maxValue, this.exponent);
    }
    valueString(c) {
      return this.choices ? this.choices[c] : this.units !== "" ? `${c} ${this.units}` : `${c}`;
    }
  }
  if (a.AudioWorkletProcessor) {
    const r = a.webAudioModules.getModuleScope(d);
    r.WamParameterInfo || (r.WamParameterInfo = i);
  }
  return i;
}, re = le, ne = (d) => {
  const a = globalThis, s = 128, f = "0_0";
  class e {
    static _tables;
    static _tableReferences;
    constructor(l, i, r = 0) {
      e._tables || (e._tables = { nullTableKey: new Float32Array(0) }, e._tableReferences = { nullTableKey: [] }), this.info = l, this.values = new Float32Array(s), this._tableKey = f, this._table = e._tables[this._tableKey], this._skew = 2;
      const { discreteStep: c } = l;
      this._discrete = !!c, this._N = this._discrete ? 0 : i, this._n = 0, this._startValue = l.defaultValue, this._endValue = l.defaultValue, this._currentValue = l.defaultValue, this._deltaValue = 0, this._inverted = !1, this._changed = !0, this._filled = 0, this._discrete ? this._skew = 0 : this.setSkew(r), this.setStartValue(this._startValue);
    }
    _removeTableReference(l) {
      if (l === f)
        return;
      const { id: i } = this.info, r = e._tableReferences[l];
      if (r) {
        const c = r.indexOf(i);
        c !== -1 && r.splice(c, 1), r.length === 0 && (delete e._tables[l], delete e._tableReferences[l]);
      }
    }
    setSkew(l) {
      if (this._skew === l || this._discrete)
        return;
      if (l < -1 || l > 1)
        throw Error("skew must be in range [-1.0, 1.0]");
      const i = [this._N, l].join("_"), r = this._tableKey, { id: c } = this.info;
      if (i !== r) {
        if (e._tables[i]) {
          const h = e._tableReferences[i];
          h ? h.push(c) : e._tableReferences[i] = [c];
        } else {
          let h = Math.abs(l);
          h = Math.pow(3 - h, h * (h + 2));
          const n = h === 1, m = this._N, o = new Float32Array(m + 1);
          if (n)
            for (let u = 0; u <= m; ++u)
              o[u] = u / m;
          else
            for (let u = 0; u <= m; ++u)
              o[u] = (u / m) ** h;
          e._tables[i] = o, e._tableReferences[i] = [c];
        }
        this._removeTableReference(r), this._skew = l, this._tableKey = i, this._table = e._tables[this._tableKey];
      }
    }
    setStartValue(l, i = !0) {
      this._n = this._N, this._startValue = l, this._endValue = l, this._currentValue = l, this._deltaValue = 0, this._inverted = !1, i ? (this.values.fill(l), this._changed = !0, this._filled = this.values.length) : (this._changed = !1, this._filled = 0);
    }
    setEndValue(l) {
      l !== this._endValue && (this._n = 0, this._startValue = this._currentValue, this._endValue = l, this._deltaValue = this._endValue - this._startValue, this._inverted = this._deltaValue > 0 && this._skew >= 0 || this._deltaValue <= 0 && this._skew < 0, this._changed = !1, this._filled = 0);
    }
    process(l, i) {
      if (this.done)
        return;
      const r = i - l;
      let c = 0;
      const h = this._N - this._n;
      if (this._discrete || !h)
        c = r;
      else {
        if (h < r && (c = Math.min(r - h, s), i -= c), i > l)
          if (this._inverted)
            for (let n = l; n < i; ++n) {
              const m = 1 - this._table[this._N - ++this._n];
              this.values[n] = this._startValue + m * this._deltaValue;
            }
          else
            for (let n = l; n < i; ++n) {
              const m = this._table[++this._n];
              this.values[n] = this._startValue + m * this._deltaValue;
            }
        c > 0 && (l = i, i += c);
      }
      c > 0 && (this.values.fill(this._endValue, l, i), this._filled += c), this._currentValue = this.values[i - 1], this._n === this._N && (this._changed ? this._filled >= this.values.length && (this.setStartValue(this._endValue, !1), this._changed = !0, this._filled = this.values.length) : this._changed = !0);
    }
    get done() {
      return this._changed && this._filled === this.values.length;
    }
    is(l) {
      return this._endValue === l && this.done;
    }
    destroy() {
      this._removeTableReference(this._tableKey);
    }
  }
  if (a.AudioWorkletProcessor) {
    const t = a.webAudioModules.getModuleScope(d);
    t.WamParameterInterpolator || (t.WamParameterInterpolator = e);
  }
  return e;
}, Q = ne, oe = (d) => {
  const a = globalThis, {
    AudioWorkletProcessor: s,
    webAudioModules: f
  } = a, e = a.webAudioModules.getModuleScope(d), {
    RingBuffer: t,
    WamEventRingBuffer: l,
    WamParameter: i,
    WamParameterInterpolator: r
  } = e;
  class c extends s {
    constructor(n) {
      super();
      const {
        groupId: m,
        moduleId: o,
        instanceId: u,
        useSab: v
      } = n.processorOptions;
      if (!o)
        throw Error("must provide moduleId argument in processorOptions!");
      if (!u)
        throw Error("must provide instanceId argument in processorOptions!");
      this.groupId = m, this.moduleId = o, this.instanceId = u, this._samplesPerQuantum = 128, this._compensationDelay = 0, this._parameterInfo = {}, this._parameterState = {}, this._parameterInterpolators = {}, this._eventQueue = [], this._pendingResponses = {}, this._useSab = !!v && !!globalThis.SharedArrayBuffer, this._eventSabReady = !1, this._audioToMainEventSab = null, this._mainToAudioEventSab = null, this._eventWriter = null, this._eventReader = null, this._initialized = !1, this._destroyed = !1, this._eventQueueRequiresSort = !1, f.addWam(this), this.port.onmessage = this._onMessage.bind(this), this._useSab && this._configureSab();
    }
    getCompensationDelay() {
      return this._compensationDelay;
    }
    scheduleEvents(...n) {
      let m = 0;
      for (; m < n.length; )
        this._eventQueue.push({ id: 0, event: n[m] }), m++;
      this._eventQueueRequiresSort = this._eventQueue.length > 1;
    }
    emitEvents(...n) {
      f.emitEvents(this, ...n);
    }
    clearEvents() {
      this._eventQueue = [];
    }
    process(n, m, o) {
      if (!this._initialized)
        return !0;
      if (this._destroyed)
        return !1;
      this._eventSabReady && this.scheduleEvents(...this._eventReader.read());
      const u = this._getProcessingSlices();
      let v = 0;
      for (; v < u.length; ) {
        const { range: p, events: g } = u[v], [_, z] = p;
        let k = 0;
        for (; k < g.length; )
          this._processEvent(g[k]), k++;
        this._interpolateParameterValues(_, z), this._process(_, z, n, m, o), v++;
      }
      return !0;
    }
    destroy() {
      this._destroyed = !0, this.port.close(), f.removeWam(this);
    }
    _generateWamParameterInfo() {
      return {};
    }
    _initialize() {
      this._parameterState = {}, this._parameterInterpolators = {}, this._parameterInfo = this._generateWamParameterInfo(), Object.keys(this._parameterInfo).forEach((n) => {
        const m = this._parameterInfo[n];
        this._parameterState[n] = new i(this._parameterInfo[n]), this._parameterInterpolators[n] = new r(m, 256);
      });
    }
    _configureSab() {
      const m = Object.keys(this._parameterInfo);
      this._eventSabReady && (this._eventWriter.setParameterIds(m), this._eventReader.setParameterIds(m)), this.port.postMessage({ eventSab: { eventCapacity: 1024, parameterIds: m } });
    }
    async _onMessage(n) {
      if (n.data.request) {
        const {
          id: m,
          request: o,
          content: u
        } = n.data, v = { id: m, response: o }, p = o.split("/"), g = p[0], _ = p[1];
        if (v.content = "error", g === "get")
          if (_ === "parameterInfo") {
            let { parameterIds: z } = u;
            z.length || (z = Object.keys(this._parameterInfo));
            const k = {};
            let b = 0;
            for (; b < z.length; ) {
              const S = z[b];
              k[S] = this._parameterInfo[S], b++;
            }
            v.content = k;
          } else if (_ === "parameterValues") {
            let { normalized: z, parameterIds: k } = u;
            v.content = this._getParameterValues(z, k);
          } else _ === "state" ? v.content = this._getState() : _ === "compensationDelay" && (v.content = this.getCompensationDelay());
        else if (g === "set") {
          if (_ === "parameterValues") {
            const { parameterValues: z } = u;
            this._setParameterValues(z, !0), delete v.content;
          } else if (_ === "state") {
            const { state: z } = u;
            this._setState(z), delete v.content;
          }
        } else if (g === "add") {
          if (_ === "event") {
            const { event: z } = u;
            this._eventQueue.push({ id: m, event: z }), this._eventQueueRequiresSort = this._eventQueue.length > 1;
            return;
          }
        } else if (g === "remove") {
          if (_ === "events") {
            const z = this._eventQueue.map((k) => k.id);
            this.clearEvents(), v.content = z;
          }
        } else if (g === "connect") {
          if (_ === "events") {
            const { wamInstanceId: z, output: k } = u;
            this._connectEvents(z, k), delete v.content;
          }
        } else if (g === "disconnect") {
          if (_ === "events") {
            const { wamInstanceId: z, output: k } = u;
            this._disconnectEvents(z, k), delete v.content;
          }
        } else if (g === "initialize") {
          if (_ === "processor")
            this._initialize(), this._initialized = !0, delete v.content;
          else if (_ === "eventSab") {
            const { mainToAudioEventSab: z, audioToMainEventSab: k } = u;
            this._audioToMainEventSab = k, this._mainToAudioEventSab = z;
            const b = Object.keys(this._parameterInfo);
            this._eventWriter = new l(t, this._audioToMainEventSab, b), this._eventReader = new l(t, this._mainToAudioEventSab, b), this._eventSabReady = !0, delete v.content;
          }
        }
        this.port.postMessage(v);
      } else n.data.destroy && this.destroy();
    }
    _onTransport(n) {
      console.error("_onTransport not implemented!");
    }
    _onMidi(n) {
      console.error("_onMidi not implemented!");
    }
    _onSysex(n) {
      console.error("_onMidi not implemented!");
    }
    _onMpe(n) {
      console.error("_onMpe not implemented!");
    }
    _onOsc(n) {
      console.error("_onOsc not implemented!");
    }
    _setState(n) {
      n.parameterValues && this._setParameterValues(n.parameterValues, !1);
    }
    _getState() {
      return { parameterValues: this._getParameterValues(!1) };
    }
    _getParameterValues(n, m) {
      const o = {};
      (!m || !m.length) && (m = Object.keys(this._parameterState));
      let u = 0;
      for (; u < m.length; ) {
        const v = m[u], p = this._parameterState[v];
        o[v] = {
          id: v,
          value: n ? p.normalizedValue : p.value,
          normalized: n
        }, u++;
      }
      return o;
    }
    _setParameterValues(n, m) {
      const o = Object.keys(n);
      let u = 0;
      for (; u < o.length; )
        this._setParameterValue(n[o[u]], m), u++;
    }
    _setParameterValue(n, m) {
      const { id: o, value: u, normalized: v } = n, p = this._parameterState[o];
      if (!p)
        return;
      v ? p.normalizedValue = u : p.value = u;
      const g = this._parameterInterpolators[o];
      m ? g.setEndValue(p.value) : g.setStartValue(p.value);
    }
    _interpolateParameterValues(n, m) {
      const o = Object.keys(this._parameterInterpolators);
      let u = 0;
      for (; u < o.length; )
        this._parameterInterpolators[o[u]].process(n, m), u++;
    }
    _connectEvents(n, m) {
      f.connectEvents(this.groupId, this.instanceId, n, m);
    }
    _disconnectEvents(n, m) {
      if (typeof n > "u") {
        f.disconnectEvents(this.groupId, this.instanceId);
        return;
      }
      f.disconnectEvents(this.groupId, this.instanceId, n, m);
    }
    _getProcessingSlices() {
      const n = "add/event", { currentTime: m, sampleRate: o } = a, u = {};
      this._eventQueueRequiresSort && (this._eventQueue.sort((z, k) => z.event.time - k.event.time), this._eventQueueRequiresSort = !1);
      let v = 0;
      for (; v < this._eventQueue.length; ) {
        const { id: z, event: k } = this._eventQueue[v], b = k.time - m, S = b > 0 ? Math.round(b * o) : 0;
        if (S < this._samplesPerQuantum)
          u[S] ? u[S].push(k) : u[S] = [k], z ? this.port.postMessage({ id: z, response: n }) : this._eventSabReady ? this._eventWriter.write(k) : this.port.postMessage({ event: k }), this._eventQueue.shift(), v = -1;
        else
          break;
        v++;
      }
      const p = [], g = Object.keys(u);
      g[0] !== "0" && (g.unshift("0"), u[0] = []);
      const _ = g.length - 1;
      for (v = 0; v < g.length; ) {
        const z = g[v], k = parseInt(z), b = v < _ ? parseInt(g[v + 1]) : this._samplesPerQuantum;
        p.push({ range: [k, b], events: u[z] }), v++;
      }
      return p;
    }
    _processEvent(n) {
      switch (n.type) {
        case "wam-automation":
          this._setParameterValue(n.data, !0);
          break;
        case "wam-transport":
          this._onTransport(n.data);
          break;
        case "wam-midi":
          this._onMidi(n.data);
          break;
        case "wam-sysex":
          this._onSysex(n.data);
          break;
        case "wam-mpe":
          this._onMpe(n.data);
          break;
        case "wam-osc":
          this._onOsc(n.data);
          break;
      }
    }
    _process(n, m, o, u, v) {
      console.error("_process not implemented!");
    }
  }
  return a.AudioWorkletProcessor && (e.WamProcessor || (e.WamProcessor = c)), c;
}, ue = oe, W = j(), x = F(), de = class extends AudioWorkletNode {
  static async addModules(d, a) {
    const { audioWorklet: s } = d;
    await M(s, j, a), await M(s, F, a), await M(s, ee, a), await M(s, ie, a), await M(s, re, a), await M(s, Q, a), await M(s, ue, a);
  }
  constructor(d, a) {
    const { audioContext: s, groupId: f, moduleId: e, instanceId: t } = d;
    a.processorOptions = {
      groupId: f,
      moduleId: e,
      instanceId: t,
      ...a.processorOptions
    }, super(s, e, a), this.module = d, this._supportedEventTypes = /* @__PURE__ */ new Set(["wam-automation", "wam-transport", "wam-midi", "wam-sysex", "wam-mpe", "wam-osc"]), this._messageId = 1, this._pendingResponses = {}, this._pendingEvents = {}, this._useSab = !1, this._eventSabReady = !1, this._destroyed = !1, this.port.onmessage = this._onMessage.bind(this);
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
  async getParameterInfo(...d) {
    const a = "get/parameterInfo", s = this._generateMessageId();
    return new Promise((f) => {
      this._pendingResponses[s] = f, this.port.postMessage({
        id: s,
        request: a,
        content: { parameterIds: d }
      });
    });
  }
  async getParameterValues(d, ...a) {
    const s = "get/parameterValues", f = this._generateMessageId();
    return new Promise((e) => {
      this._pendingResponses[f] = e, this.port.postMessage({
        id: f,
        request: s,
        content: { normalized: d, parameterIds: a }
      });
    });
  }
  async setParameterValues(d) {
    const a = "set/parameterValues", s = this._generateMessageId();
    return new Promise((f) => {
      this._pendingResponses[s] = f, this.port.postMessage({
        id: s,
        request: a,
        content: { parameterValues: d }
      });
    });
  }
  async getState() {
    const d = "get/state", a = this._generateMessageId();
    return new Promise((s) => {
      this._pendingResponses[a] = s, this.port.postMessage({ id: a, request: d });
    });
  }
  async setState(d) {
    const a = "set/state", s = this._generateMessageId();
    return new Promise((f) => {
      this._pendingResponses[s] = f, this.port.postMessage({
        id: s,
        request: a,
        content: { state: d }
      });
    });
  }
  async getCompensationDelay() {
    const d = "get/compensationDelay", a = this._generateMessageId();
    return new Promise((s) => {
      this._pendingResponses[a] = s, this.port.postMessage({ id: a, request: d });
    });
  }
  addEventListener(d, a, s) {
    this._supportedEventTypes.has(d) && super.addEventListener(d, a, s);
  }
  removeEventListener(d, a, s) {
    this._supportedEventTypes.has(d) && super.removeEventListener(d, a, s);
  }
  scheduleEvents(...d) {
    let a = 0;
    const s = d.length;
    for (this._eventSabReady && (a = this._eventWriter.write(...d)); a < s; ) {
      const f = d[a], e = "add/event", t = this._generateMessageId();
      let l = !1;
      new Promise((i, r) => {
        this._pendingResponses[t] = i, this._pendingEvents[t] = () => {
          l || r();
        }, this.port.postMessage({
          id: t,
          request: e,
          content: { event: f }
        });
      }).then((i) => {
        l = !0, delete this._pendingEvents[t], this._onEvent(f);
      }).catch((i) => {
        delete this._pendingResponses[t];
      }), a++;
    }
  }
  async clearEvents() {
    const d = "remove/events", a = this._generateMessageId();
    if (Object.keys(this._pendingEvents).length)
      return new Promise((f) => {
        this._pendingResponses[a] = f, this.port.postMessage({ id: a, request: d });
      }).then((f) => {
        f.forEach((e) => {
          this._pendingEvents[e](), delete this._pendingEvents[e];
        });
      });
  }
  connectEvents(d, a) {
    const s = "connect/events", f = this._generateMessageId();
    new Promise((e, t) => {
      this._pendingResponses[f] = e, this.port.postMessage({
        id: f,
        request: s,
        content: { wamInstanceId: d, output: a }
      });
    });
  }
  disconnectEvents(d, a) {
    const s = "disconnect/events", f = this._generateMessageId();
    new Promise((e, t) => {
      this._pendingResponses[f] = e, this.port.postMessage({
        id: f,
        request: s,
        content: { wamInstanceId: d, output: a }
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
    const d = "initialize/processor", a = this._generateMessageId();
    return new Promise((s) => {
      this._pendingResponses[a] = s, this.port.postMessage({ id: a, request: d });
    });
  }
  _onMessage(d) {
    const { data: a } = d, { response: s, event: f, eventSab: e } = a;
    if (s) {
      const { id: t, content: l } = a, i = this._pendingResponses[t];
      i && (delete this._pendingResponses[t], i(l));
    } else if (e) {
      this._useSab = !0;
      const { eventCapacity: t, parameterIds: l } = e;
      if (this._eventSabReady) {
        this._eventWriter.setParameterIds(l), this._eventReader.setParameterIds(l);
        return;
      }
      this._mainToAudioEventSab = x.getStorageForEventCapacity(W, t), this._audioToMainEventSab = x.getStorageForEventCapacity(W, t), this._eventWriter = new x(W, this._mainToAudioEventSab, l), this._eventReader = new x(W, this._audioToMainEventSab, l);
      const i = "initialize/eventSab", r = this._generateMessageId();
      new Promise((c, h) => {
        this._pendingResponses[r] = c, this.port.postMessage({
          id: r,
          request: i,
          content: {
            mainToAudioEventSab: this._mainToAudioEventSab,
            audioToMainEventSab: this._audioToMainEventSab
          }
        });
      }).then((c) => {
        this._eventSabReady = !0, this._audioToMainInterval = setInterval(() => {
          this._eventReader.read().forEach((n) => {
            this._onEvent(n);
          });
        }, 100);
      });
    } else f && this._onEvent(f);
  }
  _onEvent(d) {
    const { type: a } = d;
    this.dispatchEvent(new CustomEvent(a, {
      bubbles: !0,
      detail: d
    }));
  }
};
class L extends de {
  constructor(a) {
    super(a, {
      channelCount: 2,
      numberOfOutputs: 1
    });
  }
  static async addModules(a, s) {
    await super.addModules(a, s), await M(a.audioWorklet, Q, s), await M(a.audioWorklet, ce, s);
  }
}
function ce(d) {
  const a = globalThis, s = a.webAudioModules.getModuleScope(d), f = s.WamProcessor, e = s.WamParameterInfo, t = 30, l = Array.from({ length: 256 }, (m, o) => 1 / (Math.pow(2, (o - 69) / 12) * 440)), i = 1, r = 2, c = 3;
  function h(m, o, u, v, p) {
    let g, _;
    if (v) {
      const z = Math.floor(u * m.length);
      (z + m.length - 1) % m.length, g = (z + m.length) % m.length, _ = (g + 1) % m.length;
    } else {
      const z = Math.floor(u * m.length);
      Math.min(Math.max(0, z - 1), m.length - 1), g = Math.min(z, m.length - 1), _ = Math.min(z + 1, m.length - 1);
    }
    if (p) {
      let z = u * m.length - Math.floor(u * m.length);
      return m[g][o] * (1 - z) + m[_][o] * z;
    } else return m[g][o];
  }
  class n extends f {
    constructor() {
      super(...arguments), this.notes = {};
    }
    _process(o, u, v, p, g) {
      const _ = Array.from({ length: t }, (B, w) => this._parameterInterpolators[`curve${w}`].values), z = Array.from({ length: t }, (B, w) => this._parameterInterpolators[`attack${w}`].values), k = this._parameterInterpolators.attack_duration.values, b = Array.from({ length: t }, (B, w) => this._parameterInterpolators[`sustain${w}`].values), S = this._parameterInterpolators.sustain_duration.values, I = this._parameterInterpolators.sustain_loop.values, T = Array.from({ length: t }, (B, w) => this._parameterInterpolators[`release${w}`].values), C = this._parameterInterpolators.release_duration.values, G = this._parameterInterpolators.interpolate.values;
      for (const B in this.notes) {
        const w = this.notes[B];
        for (let E = o; E < u; E++) {
          const $ = w.advancement + (E - o) / a.sampleRate, K = w.period;
          let H = h(_, E, $ / K, !0, G[E] > 0.5), P = 0;
          const R = $ - w.last_start;
          let O = !1;
          switch (w.step) {
            case i: {
              P = h(z, E, R / (k[E] || 1e-5), !1, !0), R > k[E] && (w.step = r, w.last_start = $, w.multiplier *= P);
              break;
            }
            case r: {
              const N = I[E] > 0.5;
              P = h(b, E, R / (S[E] || 1e-5), N, !0), !N && R > S[E] && (w.step = c, w.last_start = $, w.multiplier *= P), w.doStop && (w.step = c, w.last_start = $, w.multiplier *= P);
              break;
            }
            case c: {
              P = h(T, E, R / (C[E] || 1e-5), !1, !0), R > C[E] && (O = !0);
              break;
            }
          }
          if (O) {
            delete this.notes[B];
            break;
          }
          p[0][0][E] += H * P * w.multiplier;
        }
        w.advancement += (u - o) / a.sampleRate;
      }
    }
    _processEvent(o) {
      super._processEvent(o);
    }
    _onMidi(o) {
      const u = o.bytes[0] & 240, v = o.bytes[1], p = o.bytes[2];
      u == 128 || u == 144 && p == 0 ? this.notes[v] && (this.notes[v].doStop = !0) : u == 144 && p > 0 && (this.notes[v] = { advancement: 0, last_start: 0, period: l[v], multiplier: 1, step: i });
    }
    _generateWamParameterInfo() {
      const o = {};
      for (let u = 0; u < t; u++) {
        const v = Math.sin(u / t * Math.PI * 2);
        o[`curve${u}`] = new e(`curve${u}`, {
          type: "float",
          label: `Curve Point ${u + 1}`,
          minValue: -1,
          maxValue: 1,
          defaultValue: v
        });
      }
      for (let u = 0; u < t; u++) {
        const v = Math.max(0, Math.sin(u / t * Math.PI * 0.5));
        o[`attack${u}`] = new e(`attack${u}`, {
          type: "float",
          label: `Attack Curve Point ${u + 1}`,
          minValue: 0,
          maxValue: 1,
          defaultValue: v
        });
      }
      o.attack_duration = new e("attack_duration", {
        type: "float",
        label: "Attack Curve Duration",
        minValue: 0,
        maxValue: 5,
        defaultValue: 1,
        units: "s"
      });
      for (let u = 0; u < t; u++)
        o[`sustain${u}`] = new e(`sustain${u}`, {
          type: "float",
          label: `Sustain Curve Point ${u + 1}`,
          minValue: 0,
          maxValue: 1,
          defaultValue: 1
        });
      o.sustain_duration = new e("sustain_duration", {
        type: "float",
        label: "Sustain Curve Duration",
        minValue: 0,
        maxValue: 5,
        defaultValue: 1,
        units: "s"
      }), o.sustain_loop = new e("sustain_loop", {
        type: "boolean",
        label: "Do Sustain Curve loop?",
        defaultValue: 1
      });
      for (let u = 0; u < t; u++) {
        const v = Math.max(0, Math.sin((u / t + 1) * Math.PI * 0.5));
        o[`release${u}`] = new e(`release${u}`, {
          type: "float",
          label: `Release Curve Point ${u + 1}`,
          minValue: 0,
          maxValue: 1,
          defaultValue: v
        });
      }
      return o.release_duration = new e("release_duration", {
        type: "float",
        label: "Release Curve Duration",
        minValue: 0,
        maxValue: 5,
        defaultValue: 1,
        units: "s"
      }), o.interpolate = new e("interpolate", {
        type: "boolean",
        label: "Interpolate",
        defaultValue: 1
      }), o;
    }
  }
  try {
    a.registerProcessor(d, n);
  } catch {
  }
}
var ve = Object.defineProperty, me = (d, a, s) => a in d ? ve(d, a, { enumerable: !0, configurable: !0, writable: !0, value: s }) : d[a] = s, U = (d, a, s) => me(d, typeof a != "symbol" ? a + "" : a, s);
function D(d) {
  return d.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}
function y(d, ...a) {
  let s = "", f = [], e = [];
  function t(i) {
    if (i != null) if (i instanceof Node)
      s += `<span id="_sam_frament_target_${f.length}"></span>`, f.push(i);
    else if (typeof i == "string") s += D(i);
    else if (typeof i[Symbol.iterator] == "function")
      for (const r of i) t(r);
    else typeof i == "function" ? t(i()) : s += D("" + i);
  }
  for (let i = 0; i < a.length; i++)
    d[i].endsWith("@") && (typeof a[i] == "function" || typeof a[i] == "object") ? (s += d[i].slice(0, -1), s += `_sam_fragment_to_call_${e.length}=sam`, e.push(a[i])) : (s += d[i], t(a[i]));
  s += d[d.length - 1];
  const l = document.createRange().createContextualFragment(s);
  for (let i = 0; i < f.length; i++) {
    const r = l.getElementById(`_sam_frament_target_${i}`);
    r?.replaceWith(f[i]);
  }
  for (let i = 0; i < e.length; i++) {
    const r = l.querySelector(`[_sam_fragment_to_call_${i}]`);
    r?.removeAttribute(`_sam_fragment_to_call_${i}`);
    const c = e[i];
    if (typeof c == "function") c();
    else for (const [h, n] of Object.entries(e[i]))
      h == "init" ? n(r) : r?.addEventListener(h, n);
  }
  return l;
}
y.opt = function(d, ...a) {
  if (!(a.includes(null) || a.includes(void 0)))
    return y(d, ...a);
};
y.not_empty = function(d, ...a) {
  if (!a.every((s) => s == null || s.length && s.length === 0))
    return y(d, ...a);
};
y.a = function(d, ...a) {
  return y(d, ...a).firstElementChild;
};
class fe {
  /**
   * Register an observer and return a function to unregister it.
   * @param observer The function to call on notification.
   * @returns A function to call to unregister the observer.
   */
  add(a) {
    return this.register(a), () => this.unregister(a);
  }
}
class he extends fe {
  constructor(a = void 0) {
    super(), U(this, "observers", /* @__PURE__ */ new Set()), U(this, "depth", 0), this.parent = a;
  }
  /** Register an observer */
  register(a) {
    return this.observers.add(a), () => this.observers.delete(a);
  }
  /** Unregister an observer */
  unregister(a) {
    this.observers.delete(a);
  }
  /** Send a notification to the observers */
  notify(a) {
    if (this.depth++, this.depth == 1) {
      for (let s of this.observers) s(a);
      this.parent && this.parent.notify(a);
    }
    this.depth = 0;
  }
}
class ze {
  /** Get the value */
  get() {
    return this._value;
  }
  /** Get the value */
  get value() {
    return this.get();
  }
}
class _e extends ze {
  constructor(a, s) {
    super(), this.observable = new he(s), this._value = a;
  }
  /** Set the value */
  set(a) {
    let s = this._value;
    this._value = a, this.observable.notify({ from: s, to: a });
  }
  /** Set the value */
  set value(a) {
    this.set(a);
  }
  /** Get the value */
  get value() {
    return this.get();
  }
  /** Register a listener and call it immediately with the current value. */
  link(a) {
    return a({ from: this._value, to: this._value }), this.observable.add(a);
  }
}
class pe {
  constructor(a) {
    this.node = a, this.disposed = !1, this.value_map = {};
    const s = this, { value_map: f } = this;
    setTimeout(async function e() {
      const t = await a.getParameterValues();
      for (const [l, i] of Object.entries(s.value_map)) {
        const r = t[l];
        i.value != r.value && (i.value = r.value);
      }
      s.disposed || setTimeout(e, 100);
    }, 100);
  }
  addParameter(a) {
    const s = new _e(0), f = s.set, { node: e } = this;
    return s.set = function(t) {
      f.call(this, t), e.setParameterValues({ [a]: { id: a, normalized: !1, value: t } });
    }, this.value_map[a] = s, s;
  }
  dispose() {
    this.disposed = !0;
  }
}
class q {
  constructor(a, s, f) {
    this.element = y.a`
            <div>
                <label for="${s}">${f}</label>
                <input type="checkbox" id="${s}" />
            </div>
        `;
    const e = this.element.children[1];
    this.dispose = a.link(({ to: t }) => e.checked = t > 0.5), e.addEventListener("input", () => a.set(e.checked ? 1 : 0));
  }
}
const ke = "" + new URL("cardboard.css", import.meta.url).href, ge = "aa", ye = {
  Guitar: { parameterValues: { curve0: { id: "curve0", value: 0.14992721979621546, normalized: !1 }, curve1: { id: "curve1", value: 0.39446870451237265, normalized: !1 }, curve2: { id: "curve2", value: 0.6157205240174672, normalized: !1 }, curve3: { id: "curve3", value: 0.4497816593886463, normalized: !1 }, curve4: { id: "curve4", value: 0.44104803493449785, normalized: !1 }, curve5: { id: "curve5", value: 0.2663755458515284, normalized: !1 }, curve6: { id: "curve6", value: 0.5109170305676856, normalized: !1 }, curve7: { id: "curve7", value: 0.38864628820960695, normalized: !1 }, curve8: { id: "curve8", value: 0.519650655021834, normalized: !1 }, curve9: { id: "curve9", value: 0.7729257641921397, normalized: !1 }, curve10: { id: "curve10", value: 0.8806404657933044, normalized: !1 }, curve11: { id: "curve11", value: 1, normalized: !1 }, curve12: { id: "curve12", value: 0.7729257641921397, normalized: !1 }, curve13: { id: "curve13", value: 0.7030567685589519, normalized: !1 }, curve14: { id: "curve14", value: 0.16739446870451236, normalized: !1 }, curve15: { id: "curve15", value: -0.16739446870451236, normalized: !1 }, curve16: { id: "curve16", value: -0.7030567685589519, normalized: !1 }, curve17: { id: "curve17", value: -0.7729257641921397, normalized: !1 }, curve18: { id: "curve18", value: -1, normalized: !1 }, curve19: { id: "curve19", value: -0.8806404657933044, normalized: !1 }, curve20: { id: "curve20", value: -0.7729257641921397, normalized: !1 }, curve21: { id: "curve21", value: -0.519650655021834, normalized: !1 }, curve22: { id: "curve22", value: -0.38864628820960695, normalized: !1 }, curve23: { id: "curve23", value: -0.5109170305676856, normalized: !1 }, curve24: { id: "curve24", value: -0.2663755458515284, normalized: !1 }, curve25: { id: "curve25", value: -0.44104803493449785, normalized: !1 }, curve26: { id: "curve26", value: -0.4497816593886463, normalized: !1 }, curve27: { id: "curve27", value: -0.6157205240174672, normalized: !1 }, curve28: { id: "curve28", value: -0.39446870451237265, normalized: !1 }, curve29: { id: "curve29", value: -0.14992721979621546, normalized: !1 }, attack0: { id: "attack0", value: 0, normalized: !1 }, attack1: { id: "attack1", value: 0.1091703056768559, normalized: !1 }, attack2: { id: "attack2", value: 0.32751091703056767, normalized: !1 }, attack3: { id: "attack3", value: 0.4585152838427948, normalized: !1 }, attack4: { id: "attack4", value: 0.5982532751091703, normalized: !1 }, attack5: { id: "attack5", value: 0.7248908296943232, normalized: !1 }, attack6: { id: "attack6", value: 0.8078602620087336, normalized: !1 }, attack7: { id: "attack7", value: 0.868995633187773, normalized: !1 }, attack8: { id: "attack8", value: 0.9126637554585153, normalized: !1 }, attack9: { id: "attack9", value: 0.9432314410480349, normalized: !1 }, attack10: { id: "attack10", value: 0.9432314410480349, normalized: !1 }, attack11: { id: "attack11", value: 0.9432314410480349, normalized: !1 }, attack12: { id: "attack12", value: 0.9432314410480349, normalized: !1 }, attack13: { id: "attack13", value: 0.9432314410480349, normalized: !1 }, attack14: { id: "attack14", value: 0.9432314410480349, normalized: !1 }, attack15: { id: "attack15", value: 0.9432314410480349, normalized: !1 }, attack16: { id: "attack16", value: 0.9432314410480349, normalized: !1 }, attack17: { id: "attack17", value: 0.9432314410480349, normalized: !1 }, attack18: { id: "attack18", value: 0.9432314410480349, normalized: !1 }, attack19: { id: "attack19", value: 0.9432314410480349, normalized: !1 }, attack20: { id: "attack20", value: 0.9432314410480349, normalized: !1 }, attack21: { id: "attack21", value: 0.9432314410480349, normalized: !1 }, attack22: { id: "attack22", value: 0.9432314410480349, normalized: !1 }, attack23: { id: "attack23", value: 0.9432314410480349, normalized: !1 }, attack24: { id: "attack24", value: 0.9432314410480349, normalized: !1 }, attack25: { id: "attack25", value: 0.9432314410480349, normalized: !1 }, attack26: { id: "attack26", value: 0.9432314410480349, normalized: !1 }, attack27: { id: "attack27", value: 0.9432314410480349, normalized: !1 }, attack28: { id: "attack28", value: 0.9432314410480349, normalized: !1 }, attack29: { id: "attack29", value: 0.9432314410480349, normalized: !1 }, attack_duration: { id: "attack_duration", value: 0.1, normalized: !1 }, sustain0: { id: "sustain0", value: 1, normalized: !1 }, sustain1: { id: "sustain1", value: 1, normalized: !1 }, sustain2: { id: "sustain2", value: 1, normalized: !1 }, sustain3: { id: "sustain3", value: 1, normalized: !1 }, sustain4: { id: "sustain4", value: 1, normalized: !1 }, sustain5: { id: "sustain5", value: 1, normalized: !1 }, sustain6: { id: "sustain6", value: 1, normalized: !1 }, sustain7: { id: "sustain7", value: 1, normalized: !1 }, sustain8: { id: "sustain8", value: 1, normalized: !1 }, sustain9: { id: "sustain9", value: 1, normalized: !1 }, sustain10: { id: "sustain10", value: 1, normalized: !1 }, sustain11: { id: "sustain11", value: 1, normalized: !1 }, sustain12: { id: "sustain12", value: 1, normalized: !1 }, sustain13: { id: "sustain13", value: 1, normalized: !1 }, sustain14: { id: "sustain14", value: 1, normalized: !1 }, sustain15: { id: "sustain15", value: 1, normalized: !1 }, sustain16: { id: "sustain16", value: 1, normalized: !1 }, sustain17: { id: "sustain17", value: 1, normalized: !1 }, sustain18: { id: "sustain18", value: 1, normalized: !1 }, sustain19: { id: "sustain19", value: 1, normalized: !1 }, sustain20: { id: "sustain20", value: 1, normalized: !1 }, sustain21: { id: "sustain21", value: 1, normalized: !1 }, sustain22: { id: "sustain22", value: 1, normalized: !1 }, sustain23: { id: "sustain23", value: 1, normalized: !1 }, sustain24: { id: "sustain24", value: 1, normalized: !1 }, sustain25: { id: "sustain25", value: 1, normalized: !1 }, sustain26: { id: "sustain26", value: 1, normalized: !1 }, sustain27: { id: "sustain27", value: 1, normalized: !1 }, sustain28: { id: "sustain28", value: 1, normalized: !1 }, sustain29: { id: "sustain29", value: 1, normalized: !1 }, sustain_duration: { id: "sustain_duration", value: 0, normalized: !1 }, sustain_loop: { id: "sustain_loop", value: 0, normalized: !1 }, release0: { id: "release0", value: 1, normalized: !1 }, release1: { id: "release1", value: 0.982532751091703, normalized: !1 }, release2: { id: "release2", value: 0.8864628820960698, normalized: !1 }, release3: { id: "release3", value: 0.7903930131004366, normalized: !1 }, release4: { id: "release4", value: 0.5502183406113537, normalized: !1 }, release5: { id: "release5", value: 0.6375545851528385, normalized: !1 }, release6: { id: "release6", value: 0.7510917030567685, normalized: !1 }, release7: { id: "release7", value: 0.8209606986899564, normalized: !1 }, release8: { id: "release8", value: 0.8253275109170306, normalized: !1 }, release9: { id: "release9", value: 0.8253275109170306, normalized: !1 }, release10: { id: "release10", value: 0.8078602620087336, normalized: !1 }, release11: { id: "release11", value: 0.759825327510917, normalized: !1 }, release12: { id: "release12", value: 0.6157205240174672, normalized: !1 }, release13: { id: "release13", value: 0.36681222707423583, normalized: !1 }, release14: { id: "release14", value: 0.40611353711790393, normalized: !1 }, release15: { id: "release15", value: 0.5109170305676856, normalized: !1 }, release16: { id: "release16", value: 0.5807860262008734, normalized: !1 }, release17: { id: "release17", value: 0.6157205240174672, normalized: !1 }, release18: { id: "release18", value: 0.62882096069869, normalized: !1 }, release19: { id: "release19", value: 0.5807860262008734, normalized: !1 }, release20: { id: "release20", value: 0.5283842794759825, normalized: !1 }, release21: { id: "release21", value: 0.3318777292576419, normalized: !1 }, release22: { id: "release22", value: 0.22270742358078602, normalized: !1 }, release23: { id: "release23", value: 0.31004366812227074, normalized: !1 }, release24: { id: "release24", value: 0.37117903930131, normalized: !1 }, release25: { id: "release25", value: 0.3799126637554585, normalized: !1 }, release26: { id: "release26", value: 0.37554585152838427, normalized: !1 }, release27: { id: "release27", value: 0.30131004366812225, normalized: !1 }, release28: { id: "release28", value: 0.22270742358078602, normalized: !1 }, release29: { id: "release29", value: 0.10043668122270742, normalized: !1 }, release_duration: { id: "release_duration", value: 0.5, normalized: !1 }, interpolate: { id: "interpolate", value: 1, normalized: !1 } } },
  Xylophone: { parameterValues: { curve0: { id: "curve0", value: -1, normalized: !1 }, curve1: { id: "curve1", value: -0.8666666666666667, normalized: !1 }, curve2: { id: "curve2", value: -0.7333333333333334, normalized: !1 }, curve3: { id: "curve3", value: -0.6, normalized: !1 }, curve4: { id: "curve4", value: -0.4666666666666667, normalized: !1 }, curve5: { id: "curve5", value: -0.33333333333333337, normalized: !1 }, curve6: { id: "curve6", value: -0.19999999999999996, normalized: !1 }, curve7: { id: "curve7", value: -0.06666666666666665, normalized: !1 }, curve8: { id: "curve8", value: 0.06666666666666665, normalized: !1 }, curve9: { id: "curve9", value: 0.19999999999999996, normalized: !1 }, curve10: { id: "curve10", value: 0.33333333333333326, normalized: !1 }, curve11: { id: "curve11", value: 0.46666666666666656, normalized: !1 }, curve12: { id: "curve12", value: 0.6000000000000001, normalized: !1 }, curve13: { id: "curve13", value: 0.7333333333333334, normalized: !1 }, curve14: { id: "curve14", value: 0.8666666666666667, normalized: !1 }, curve15: { id: "curve15", value: 1, normalized: !1 }, curve16: { id: "curve16", value: 0.8666666666666667, normalized: !1 }, curve17: { id: "curve17", value: 0.7333333333333334, normalized: !1 }, curve18: { id: "curve18", value: 0.6000000000000001, normalized: !1 }, curve19: { id: "curve19", value: 0.4666666666666668, normalized: !1 }, curve20: { id: "curve20", value: 0.3333333333333335, normalized: !1 }, curve21: { id: "curve21", value: 0.20000000000000018, normalized: !1 }, curve22: { id: "curve22", value: 0.06666666666666687, normalized: !1 }, curve23: { id: "curve23", value: -0.06666666666666687, normalized: !1 }, curve24: { id: "curve24", value: -0.20000000000000018, normalized: !1 }, curve25: { id: "curve25", value: -0.3333333333333335, normalized: !1 }, curve26: { id: "curve26", value: -0.4666666666666668, normalized: !1 }, curve27: { id: "curve27", value: -0.6000000000000001, normalized: !1 }, curve28: { id: "curve28", value: -0.7333333333333334, normalized: !1 }, curve29: { id: "curve29", value: -0.8666666666666667, normalized: !1 }, attack0: { id: "attack0", value: 0, normalized: !1 }, attack1: { id: "attack1", value: 0.9956331877729258, normalized: !1 }, attack2: { id: "attack2", value: 0.9868995633187773, normalized: !1 }, attack3: { id: "attack3", value: 0.9868995633187773, normalized: !1 }, attack4: { id: "attack4", value: 0.9868995633187773, normalized: !1 }, attack5: { id: "attack5", value: 0.9868995633187773, normalized: !1 }, attack6: { id: "attack6", value: 0.9868995633187773, normalized: !1 }, attack7: { id: "attack7", value: 0.9868995633187773, normalized: !1 }, attack8: { id: "attack8", value: 0.9868995633187773, normalized: !1 }, attack9: { id: "attack9", value: 0.9868995633187773, normalized: !1 }, attack10: { id: "attack10", value: 0.9868995633187773, normalized: !1 }, attack11: { id: "attack11", value: 0.9868995633187773, normalized: !1 }, attack12: { id: "attack12", value: 0.9868995633187773, normalized: !1 }, attack13: { id: "attack13", value: 0.982532751091703, normalized: !1 }, attack14: { id: "attack14", value: 0.982532751091703, normalized: !1 }, attack15: { id: "attack15", value: 0.982532751091703, normalized: !1 }, attack16: { id: "attack16", value: 0.982532751091703, normalized: !1 }, attack17: { id: "attack17", value: 0.982532751091703, normalized: !1 }, attack18: { id: "attack18", value: 0.9650655021834061, normalized: !1 }, attack19: { id: "attack19", value: 0.982532751091703, normalized: !1 }, attack20: { id: "attack20", value: 0.982532751091703, normalized: !1 }, attack21: { id: "attack21", value: 0.982532751091703, normalized: !1 }, attack22: { id: "attack22", value: 1, normalized: !1 }, attack23: { id: "attack23", value: 1, normalized: !1 }, attack24: { id: "attack24", value: 0.9510565162951535, normalized: !1 }, attack25: { id: "attack25", value: 0.9659258262890683, normalized: !1 }, attack26: { id: "attack26", value: 0.9781476007338057, normalized: !1 }, attack27: { id: "attack27", value: 0.9876883405951378, normalized: !1 }, attack28: { id: "attack28", value: 0.9945218953682733, normalized: !1 }, attack29: { id: "attack29", value: 0.9986295347545738, normalized: !1 }, attack_duration: { id: "attack_duration", value: 0, normalized: !1 }, sustain0: { id: "sustain0", value: 1, normalized: !1 }, sustain1: { id: "sustain1", value: 1, normalized: !1 }, sustain2: { id: "sustain2", value: 1, normalized: !1 }, sustain3: { id: "sustain3", value: 1, normalized: !1 }, sustain4: { id: "sustain4", value: 1, normalized: !1 }, sustain5: { id: "sustain5", value: 1, normalized: !1 }, sustain6: { id: "sustain6", value: 1, normalized: !1 }, sustain7: { id: "sustain7", value: 1, normalized: !1 }, sustain8: { id: "sustain8", value: 1, normalized: !1 }, sustain9: { id: "sustain9", value: 1, normalized: !1 }, sustain10: { id: "sustain10", value: 1, normalized: !1 }, sustain11: { id: "sustain11", value: 1, normalized: !1 }, sustain12: { id: "sustain12", value: 1, normalized: !1 }, sustain13: { id: "sustain13", value: 1, normalized: !1 }, sustain14: { id: "sustain14", value: 1, normalized: !1 }, sustain15: { id: "sustain15", value: 1, normalized: !1 }, sustain16: { id: "sustain16", value: 1, normalized: !1 }, sustain17: { id: "sustain17", value: 1, normalized: !1 }, sustain18: { id: "sustain18", value: 1, normalized: !1 }, sustain19: { id: "sustain19", value: 1, normalized: !1 }, sustain20: { id: "sustain20", value: 1, normalized: !1 }, sustain21: { id: "sustain21", value: 1, normalized: !1 }, sustain22: { id: "sustain22", value: 1, normalized: !1 }, sustain23: { id: "sustain23", value: 1, normalized: !1 }, sustain24: { id: "sustain24", value: 1, normalized: !1 }, sustain25: { id: "sustain25", value: 1, normalized: !1 }, sustain26: { id: "sustain26", value: 1, normalized: !1 }, sustain27: { id: "sustain27", value: 1, normalized: !1 }, sustain28: { id: "sustain28", value: 1, normalized: !1 }, sustain29: { id: "sustain29", value: 1, normalized: !1 }, sustain_duration: { id: "sustain_duration", value: 0, normalized: !1 }, sustain_loop: { id: "sustain_loop", value: 0, normalized: !1 }, release0: { id: "release0", value: 0.9082969432314411, normalized: !1 }, release1: { id: "release1", value: 0.7030567685589519, normalized: !1 }, release2: { id: "release2", value: 0.4847161572052402, normalized: !1 }, release3: { id: "release3", value: 0.3318777292576419, normalized: !1 }, release4: { id: "release4", value: 0.25327510917030566, normalized: !1 }, release5: { id: "release5", value: 0.2096069868995633, normalized: !1 }, release6: { id: "release6", value: 0.17903930131004367, normalized: !1 }, release7: { id: "release7", value: 0.1703056768558952, normalized: !1 }, release8: { id: "release8", value: 0.1615720524017467, normalized: !1 }, release9: { id: "release9", value: 0.15283842794759825, normalized: !1 }, release10: { id: "release10", value: 0.13100436681222707, normalized: !1 }, release11: { id: "release11", value: 0.1091703056768559, normalized: !1 }, release12: { id: "release12", value: 0.09606986899563319, normalized: !1 }, release13: { id: "release13", value: 0.09606986899563319, normalized: !1 }, release14: { id: "release14", value: 0.09170305676855896, normalized: !1 }, release15: { id: "release15", value: 0.07860262008733625, normalized: !1 }, release16: { id: "release16", value: 0.07423580786026202, normalized: !1 }, release17: { id: "release17", value: 0.07423580786026202, normalized: !1 }, release18: { id: "release18", value: 0.07423580786026202, normalized: !1 }, release19: { id: "release19", value: 0.06550218340611354, normalized: !1 }, release20: { id: "release20", value: 0.06550218340611354, normalized: !1 }, release21: { id: "release21", value: 0.06550218340611354, normalized: !1 }, release22: { id: "release22", value: 0.06550218340611354, normalized: !1 }, release23: { id: "release23", value: 0.06550218340611354, normalized: !1 }, release24: { id: "release24", value: 0.06550218340611354, normalized: !1 }, release25: { id: "release25", value: 0.056768558951965066, normalized: !1 }, release26: { id: "release26", value: 0.056768558951965066, normalized: !1 }, release27: { id: "release27", value: 0.06550218340611354, normalized: !1 }, release28: { id: "release28", value: 0.06550218340611354, normalized: !1 }, release29: { id: "release29", value: 0.06550218340611354, normalized: !1 }, release_duration: { id: "release_duration", value: 0.5, normalized: !1 }, interpolate: { id: "interpolate", value: 1, normalized: !1 } } },
  Trumpet: { parameterValues: { curve0: { id: "curve0", value: 0.11499272197962156, normalized: !1 }, curve1: { id: "curve1", value: 0.39737991266375544, normalized: !1 }, curve2: { id: "curve2", value: 0.6098981077147015, normalized: !1 }, curve3: { id: "curve3", value: 0.7467248908296943, normalized: !1 }, curve4: { id: "curve4", value: 0.6273653566229985, normalized: !1 }, curve5: { id: "curve5", value: 0.48762736535662304, normalized: !1 }, curve6: { id: "curve6", value: 0.5516739446870452, normalized: !1 }, curve7: { id: "curve7", value: 0.7292576419213974, normalized: !1 }, curve8: { id: "curve8", value: 0.6914119359534207, normalized: !1 }, curve9: { id: "curve9", value: 0.4294032023289665, normalized: !1 }, curve10: { id: "curve10", value: 0.3857350800582242, normalized: !1 }, curve11: { id: "curve11", value: 0.5623483745754488, normalized: !1 }, curve12: { id: "curve12", value: 0.7069383794274624, normalized: !1 }, curve13: { id: "curve13", value: 0.5361475012130034, normalized: !1 }, curve14: { id: "curve14", value: 0.19844735565259583, normalized: !1 }, curve15: { id: "curve15", value: -0.19844735565259583, normalized: !1 }, curve16: { id: "curve16", value: -0.5361475012130034, normalized: !1 }, curve17: { id: "curve17", value: -0.7069383794274624, normalized: !1 }, curve18: { id: "curve18", value: -0.5623483745754488, normalized: !1 }, curve19: { id: "curve19", value: -0.3857350800582242, normalized: !1 }, curve20: { id: "curve20", value: -0.4294032023289665, normalized: !1 }, curve21: { id: "curve21", value: -0.6914119359534207, normalized: !1 }, curve22: { id: "curve22", value: -0.7292576419213974, normalized: !1 }, curve23: { id: "curve23", value: -0.5516739446870452, normalized: !1 }, curve24: { id: "curve24", value: -0.48762736535662304, normalized: !1 }, curve25: { id: "curve25", value: -0.6273653566229985, normalized: !1 }, curve26: { id: "curve26", value: -0.7467248908296943, normalized: !1 }, curve27: { id: "curve27", value: -0.6098981077147015, normalized: !1 }, curve28: { id: "curve28", value: -0.39737991266375544, normalized: !1 }, curve29: { id: "curve29", value: -0.11499272197962156, normalized: !1 }, attack0: { id: "attack0", value: 0.11353711790393013, normalized: !1 }, attack1: { id: "attack1", value: 0.22270742358078602, normalized: !1 }, attack2: { id: "attack2", value: 0.3318777292576419, normalized: !1 }, attack3: { id: "attack3", value: 0.42358078602620086, normalized: !1 }, attack4: { id: "attack4", value: 0.5109170305676856, normalized: !1 }, attack5: { id: "attack5", value: 0.5851528384279476, normalized: !1 }, attack6: { id: "attack6", value: 0.6331877729257642, normalized: !1 }, attack7: { id: "attack7", value: 0.6986899563318777, normalized: !1 }, attack8: { id: "attack8", value: 0.7379912663755459, normalized: !1 }, attack9: { id: "attack9", value: 0.759825327510917, normalized: !1 }, attack10: { id: "attack10", value: 0.7816593886462883, normalized: !1 }, attack11: { id: "attack11", value: 0.8165938864628821, normalized: !1 }, attack12: { id: "attack12", value: 0.8427947598253275, normalized: !1 }, attack13: { id: "attack13", value: 0.8471615720524017, normalized: !1 }, attack14: { id: "attack14", value: 0.8602620087336245, normalized: !1 }, attack15: { id: "attack15", value: 0.868995633187773, normalized: !1 }, attack16: { id: "attack16", value: 0.8864628820960698, normalized: !1 }, attack17: { id: "attack17", value: 0.9126637554585153, normalized: !1 }, attack18: { id: "attack18", value: 0.9301310043668122, normalized: !1 }, attack19: { id: "attack19", value: 0.9563318777292577, normalized: !1 }, attack20: { id: "attack20", value: 0.9737991266375546, normalized: !1 }, attack21: { id: "attack21", value: 0.982532751091703, normalized: !1 }, attack22: { id: "attack22", value: 1, normalized: !1 }, attack23: { id: "attack23", value: 1, normalized: !1 }, attack24: { id: "attack24", value: 1, normalized: !1 }, attack25: { id: "attack25", value: 1, normalized: !1 }, attack26: { id: "attack26", value: 0.9781476007338057, normalized: !1 }, attack27: { id: "attack27", value: 0.9876883405951378, normalized: !1 }, attack28: { id: "attack28", value: 0.9945218953682733, normalized: !1 }, attack29: { id: "attack29", value: 0.9986295347545738, normalized: !1 }, attack_duration: { id: "attack_duration", value: 0.1, normalized: !1 }, sustain0: { id: "sustain0", value: 0.9475982532751092, normalized: !1 }, sustain1: { id: "sustain1", value: 0.9126637554585153, normalized: !1 }, sustain2: { id: "sustain2", value: 0.8820960698689956, normalized: !1 }, sustain3: { id: "sustain3", value: 0.8777292576419214, normalized: !1 }, sustain4: { id: "sustain4", value: 0.868995633187773, normalized: !1 }, sustain5: { id: "sustain5", value: 0.8602620087336245, normalized: !1 }, sustain6: { id: "sustain6", value: 0.8602620087336245, normalized: !1 }, sustain7: { id: "sustain7", value: 0.8602620087336245, normalized: !1 }, sustain8: { id: "sustain8", value: 0.8602620087336245, normalized: !1 }, sustain9: { id: "sustain9", value: 0.8602620087336245, normalized: !1 }, sustain10: { id: "sustain10", value: 0.8602620087336245, normalized: !1 }, sustain11: { id: "sustain11", value: 0.8602620087336245, normalized: !1 }, sustain12: { id: "sustain12", value: 0.8602620087336245, normalized: !1 }, sustain13: { id: "sustain13", value: 0.8646288209606987, normalized: !1 }, sustain14: { id: "sustain14", value: 0.8646288209606987, normalized: !1 }, sustain15: { id: "sustain15", value: 0.8777292576419214, normalized: !1 }, sustain16: { id: "sustain16", value: 0.8777292576419214, normalized: !1 }, sustain17: { id: "sustain17", value: 0.8820960698689956, normalized: !1 }, sustain18: { id: "sustain18", value: 0.8820960698689956, normalized: !1 }, sustain19: { id: "sustain19", value: 0.8820960698689956, normalized: !1 }, sustain20: { id: "sustain20", value: 0.8820960698689956, normalized: !1 }, sustain21: { id: "sustain21", value: 0.8820960698689956, normalized: !1 }, sustain22: { id: "sustain22", value: 0.8951965065502183, normalized: !1 }, sustain23: { id: "sustain23", value: 0.8995633187772926, normalized: !1 }, sustain24: { id: "sustain24", value: 0.9170305676855895, normalized: !1 }, sustain25: { id: "sustain25", value: 0.9170305676855895, normalized: !1 }, sustain26: { id: "sustain26", value: 0.9388646288209607, normalized: !1 }, sustain27: { id: "sustain27", value: 0.9475982532751092, normalized: !1 }, sustain28: { id: "sustain28", value: 0.9781659388646288, normalized: !1 }, sustain29: { id: "sustain29", value: 0.9956331877729258, normalized: !1 }, sustain_duration: { id: "sustain_duration", value: 0.2, normalized: !1 }, sustain_loop: { id: "sustain_loop", value: 1, normalized: !1 }, release0: { id: "release0", value: 0.9388646288209607, normalized: !1 }, release1: { id: "release1", value: 0.9213973799126638, normalized: !1 }, release2: { id: "release2", value: 0.8777292576419214, normalized: !1 }, release3: { id: "release3", value: 0.8471615720524017, normalized: !1 }, release4: { id: "release4", value: 0.8209606986899564, normalized: !1 }, release5: { id: "release5", value: 0.7554585152838428, normalized: !1 }, release6: { id: "release6", value: 0.5807860262008734, normalized: !1 }, release7: { id: "release7", value: 0.49344978165938863, normalized: !1 }, release8: { id: "release8", value: 0.47161572052401746, normalized: !1 }, release9: { id: "release9", value: 0.47161572052401746, normalized: !1 }, release10: { id: "release10", value: 0.4759825327510917, normalized: !1 }, release11: { id: "release11", value: 0.49344978165938863, normalized: !1 }, release12: { id: "release12", value: 0.5240174672489083, normalized: !1 }, release13: { id: "release13", value: 0.5283842794759825, normalized: !1 }, release14: { id: "release14", value: 0.5283842794759825, normalized: !1 }, release15: { id: "release15", value: 0.4672489082969432, normalized: !1 }, release16: { id: "release16", value: 0.2838427947598253, normalized: !1 }, release17: { id: "release17", value: 0.1965065502183406, normalized: !1 }, release18: { id: "release18", value: 0.17903930131004367, normalized: !1 }, release19: { id: "release19", value: 0.1615720524017467, normalized: !1 }, release20: { id: "release20", value: 0.16593886462882096, normalized: !1 }, release21: { id: "release21", value: 0.19213973799126638, normalized: !1 }, release22: { id: "release22", value: 0.22707423580786026, normalized: !1 }, release23: { id: "release23", value: 0.24017467248908297, normalized: !1 }, release24: { id: "release24", value: 0.2576419213973799, normalized: !1 }, release25: { id: "release25", value: 0.2576419213973799, normalized: !1 }, release26: { id: "release26", value: 0.22707423580786026, normalized: !1 }, release27: { id: "release27", value: 0.17467248908296942, normalized: !1 }, release28: { id: "release28", value: 0.13537117903930132, normalized: !1 }, release29: { id: "release29", value: 0.06550218340611354, normalized: !1 }, release_duration: { id: "release_duration", value: 0.5, normalized: !1 }, interpolate: { id: "interpolate", value: 1, normalized: !1 } } },
  Flute: { parameterValues: { curve0: { id: "curve0", value: -0.0700707754048647, normalized: !1 }, curve1: { id: "curve1", value: 0.21159230264595133, normalized: !1 }, curve2: { id: "curve2", value: 0.47449463194777114, normalized: !1 }, curve3: { id: "curve3", value: 0.6823557653029916, normalized: !1 }, curve4: { id: "curve4", value: 0.8120711872604526, normalized: !1 }, curve5: { id: "curve5", value: 0.8728033448928532, normalized: !1 }, curve6: { id: "curve6", value: 0.9005317535781424, normalized: !1 }, curve7: { id: "curve7", value: 0.9166016530228384, normalized: !1 }, curve8: { id: "curve8", value: 0.9402339355619577, normalized: !1 }, curve9: { id: "curve9", value: 0.9513224444427927, normalized: !1 }, curve10: { id: "curve10", value: 0.9312113896632789, normalized: !1 }, curve11: { id: "curve11", value: 0.8558749366358122, normalized: !1 }, curve12: { id: "curve12", value: 0.7055119218491651, normalized: !1 }, curve13: { id: "curve13", value: 0.5000387353465062, normalized: !1 }, curve14: { id: "curve14", value: 0.24733238546127237, normalized: !1 }, curve15: { id: "curve15", value: 0.00981588039050966, normalized: !1 }, curve16: { id: "curve16", value: -0.20842916314101215, normalized: !1 }, curve17: { id: "curve17", value: -0.37949695691091606, normalized: !1 }, curve18: { id: "curve18", value: -0.5490267591381892, normalized: !1 }, curve19: { id: "curve19", value: -0.7027231148648441, normalized: !1 }, curve20: { id: "curve20", value: -0.8420946914457961, normalized: !1 }, curve21: { id: "curve21", value: -0.9300086470915173, normalized: !1 }, curve22: { id: "curve22", value: -0.9715632742620935, normalized: !1 }, curve23: { id: "curve23", value: -0.9738792773539494, normalized: !1 }, curve24: { id: "curve24", value: -0.9418393994503372, normalized: !1 }, curve25: { id: "curve25", value: -0.8843108952720821, normalized: !1 }, curve26: { id: "curve26", value: -0.7927062832129431, normalized: !1 }, curve27: { id: "curve27", value: -0.6796885234076049, normalized: !1 }, curve28: { id: "curve28", value: -0.5255851593279074, normalized: !1 }, curve29: { id: "curve29", value: -0.3236583645049736, normalized: !1 }, attack0: { id: "attack0", value: 0, normalized: !1 }, attack1: { id: "attack1", value: 0.05233595624294383, normalized: !1 }, attack2: { id: "attack2", value: 0.10452846326765346, normalized: !1 }, attack3: { id: "attack3", value: 0.15643446504023087, normalized: !1 }, attack4: { id: "attack4", value: 0.20791169081775931, normalized: !1 }, attack5: { id: "attack5", value: 0.25881904510252074, normalized: !1 }, attack6: { id: "attack6", value: 0.3090169943749474, normalized: !1 }, attack7: { id: "attack7", value: 0.35836794954530027, normalized: !1 }, attack8: { id: "attack8", value: 0.40673664307580015, normalized: !1 }, attack9: { id: "attack9", value: 0.45399049973954675, normalized: !1 }, attack10: { id: "attack10", value: 0.49999999999999994, normalized: !1 }, attack11: { id: "attack11", value: 0.544639035015027, normalized: !1 }, attack12: { id: "attack12", value: 0.5877852522924731, normalized: !1 }, attack13: { id: "attack13", value: 0.6293203910498375, normalized: !1 }, attack14: { id: "attack14", value: 0.6691306063588582, normalized: !1 }, attack15: { id: "attack15", value: 0.7071067811865476, normalized: !1 }, attack16: { id: "attack16", value: 0.7431448254773941, normalized: !1 }, attack17: { id: "attack17", value: 0.7771459614569708, normalized: !1 }, attack18: { id: "attack18", value: 0.8090169943749475, normalized: !1 }, attack19: { id: "attack19", value: 0.8386705679454239, normalized: !1 }, attack20: { id: "attack20", value: 0.8660254037844386, normalized: !1 }, attack21: { id: "attack21", value: 0.8910065241883678, normalized: !1 }, attack22: { id: "attack22", value: 0.9135454576426009, normalized: !1 }, attack23: { id: "attack23", value: 0.9335804264972017, normalized: !1 }, attack24: { id: "attack24", value: 0.9510565162951535, normalized: !1 }, attack25: { id: "attack25", value: 0.9659258262890683, normalized: !1 }, attack26: { id: "attack26", value: 0.9781476007338057, normalized: !1 }, attack27: { id: "attack27", value: 0.9876883405951378, normalized: !1 }, attack28: { id: "attack28", value: 0.9945218953682733, normalized: !1 }, attack29: { id: "attack29", value: 0.9986295347545738, normalized: !1 }, attack_duration: { id: "attack_duration", value: 0.3, normalized: !1 }, sustain0: { id: "sustain0", value: 0.9694323144104804, normalized: !1 }, sustain1: { id: "sustain1", value: 0.9475982532751092, normalized: !1 }, sustain2: { id: "sustain2", value: 0.9301310043668122, normalized: !1 }, sustain3: { id: "sustain3", value: 0.9301310043668122, normalized: !1 }, sustain4: { id: "sustain4", value: 0.9301310043668122, normalized: !1 }, sustain5: { id: "sustain5", value: 0.9301310043668122, normalized: !1 }, sustain6: { id: "sustain6", value: 0.9301310043668122, normalized: !1 }, sustain7: { id: "sustain7", value: 0.9301310043668122, normalized: !1 }, sustain8: { id: "sustain8", value: 0.9170305676855895, normalized: !1 }, sustain9: { id: "sustain9", value: 0.9170305676855895, normalized: !1 }, sustain10: { id: "sustain10", value: 0.9126637554585153, normalized: !1 }, sustain11: { id: "sustain11", value: 0.9039301310043668, normalized: !1 }, sustain12: { id: "sustain12", value: 0.9039301310043668, normalized: !1 }, sustain13: { id: "sustain13", value: 0.9039301310043668, normalized: !1 }, sustain14: { id: "sustain14", value: 0.9039301310043668, normalized: !1 }, sustain15: { id: "sustain15", value: 0.8995633187772926, normalized: !1 }, sustain16: { id: "sustain16", value: 0.8951965065502183, normalized: !1 }, sustain17: { id: "sustain17", value: 0.8951965065502183, normalized: !1 }, sustain18: { id: "sustain18", value: 0.8951965065502183, normalized: !1 }, sustain19: { id: "sustain19", value: 0.8777292576419214, normalized: !1 }, sustain20: { id: "sustain20", value: 0.8602620087336245, normalized: !1 }, sustain21: { id: "sustain21", value: 0.8427947598253275, normalized: !1 }, sustain22: { id: "sustain22", value: 0.8384279475982532, normalized: !1 }, sustain23: { id: "sustain23", value: 0.8122270742358079, normalized: !1 }, sustain24: { id: "sustain24", value: 0.8078602620087336, normalized: !1 }, sustain25: { id: "sustain25", value: 0.8078602620087336, normalized: !1 }, sustain26: { id: "sustain26", value: 0.8209606986899564, normalized: !1 }, sustain27: { id: "sustain27", value: 0.8384279475982532, normalized: !1 }, sustain28: { id: "sustain28", value: 0.8646288209606987, normalized: !1 }, sustain29: { id: "sustain29", value: 0.9301310043668122, normalized: !1 }, sustain_duration: { id: "sustain_duration", value: 0.2, normalized: !1 }, sustain_loop: { id: "sustain_loop", value: 1, normalized: !1 }, release0: { id: "release0", value: 1, normalized: !1 }, release1: { id: "release1", value: 0.9986295347545738, normalized: !1 }, release2: { id: "release2", value: 0.9945218953682734, normalized: !1 }, release3: { id: "release3", value: 0.9876883405951377, normalized: !1 }, release4: { id: "release4", value: 0.9781476007338057, normalized: !1 }, release5: { id: "release5", value: 0.9659258262890683, normalized: !1 }, release6: { id: "release6", value: 0.9510565162951536, normalized: !1 }, release7: { id: "release7", value: 0.9335804264972017, normalized: !1 }, release8: { id: "release8", value: 0.913545457642601, normalized: !1 }, release9: { id: "release9", value: 0.8910065241883679, normalized: !1 }, release10: { id: "release10", value: 0.8660254037844387, normalized: !1 }, release11: { id: "release11", value: 0.838670567945424, normalized: !1 }, release12: { id: "release12", value: 0.8090169943749475, normalized: !1 }, release13: { id: "release13", value: 0.777145961456971, normalized: !1 }, release14: { id: "release14", value: 0.7431448254773942, normalized: !1 }, release15: { id: "release15", value: 0.7071067811865476, normalized: !1 }, release16: { id: "release16", value: 0.6691306063588583, normalized: !1 }, release17: { id: "release17", value: 0.6293203910498374, normalized: !1 }, release18: { id: "release18", value: 0.5877852522924732, normalized: !1 }, release19: { id: "release19", value: 0.5446390350150273, normalized: !1 }, release20: { id: "release20", value: 0.5000000000000003, normalized: !1 }, release21: { id: "release21", value: 0.45399049973954686, normalized: !1 }, release22: { id: "release22", value: 0.40673664307580004, normalized: !1 }, release23: { id: "release23", value: 0.35836794954530066, normalized: !1 }, release24: { id: "release24", value: 0.3090169943749475, normalized: !1 }, release25: { id: "release25", value: 0.2588190451025206, normalized: !1 }, release26: { id: "release26", value: 0.20791169081775931, normalized: !1 }, release27: { id: "release27", value: 0.15643446504023098, normalized: !1 }, release28: { id: "release28", value: 0.10452846326765373, normalized: !1 }, release29: { id: "release29", value: 0.05233595624294381, normalized: !1 }, release_duration: { id: "release_duration", value: 0.5, normalized: !1 }, interpolate: { id: "interpolate", value: 1, normalized: !1 } } },
  Clarinet: { parameterValues: { curve0: { id: "curve0", value: 0.6666666666666666, normalized: !1 }, curve1: { id: "curve1", value: 0.5256410256410257, normalized: !1 }, curve2: { id: "curve2", value: 0.2532051282051282, normalized: !1 }, curve3: { id: "curve3", value: -0.028846153846153855, normalized: !1 }, curve4: { id: "curve4", value: -0.2884615384615385, normalized: !1 }, curve5: { id: "curve5", value: -0.5544871794871795, normalized: !1 }, curve6: { id: "curve6", value: -0.7403846153846153, normalized: !1 }, curve7: { id: "curve7", value: -0.7596153846153846, normalized: !1 }, curve8: { id: "curve8", value: -0.5448717948717948, normalized: !1 }, curve9: { id: "curve9", value: -0.22115384615384617, normalized: !1 }, curve10: { id: "curve10", value: 0.03525641025641024, normalized: !1 }, curve11: { id: "curve11", value: 0.019230769230769235, normalized: !1 }, curve12: { id: "curve12", value: -0.2756410256410256, normalized: !1 }, curve13: { id: "curve13", value: -0.5608974358974359, normalized: !1 }, curve14: { id: "curve14", value: -0.5865384615384616, normalized: !1 }, curve15: { id: "curve15", value: -0.30448717948717946, normalized: !1 }, curve16: { id: "curve16", value: -0.028846153846153855, normalized: !1 }, curve17: { id: "curve17", value: -0.08012820512820513, normalized: !1 }, curve18: { id: "curve18", value: -0.5, normalized: !1 }, curve19: { id: "curve19", value: -0.5673076923076923, normalized: !1 }, curve20: { id: "curve20", value: -0.5160256410256411, normalized: !1 }, curve21: { id: "curve21", value: -0.20833333333333337, normalized: !1 }, curve22: { id: "curve22", value: 0.17948717948717943, normalized: !1 }, curve23: { id: "curve23", value: 0.4038461538461538, normalized: !1 }, curve24: { id: "curve24", value: 0.5288461538461539, normalized: !1 }, curve25: { id: "curve25", value: 0.5448717948717948, normalized: !1 }, curve26: { id: "curve26", value: 0.4775641025641026, normalized: !1 }, curve27: { id: "curve27", value: 0.41987179487179493, normalized: !1 }, curve28: { id: "curve28", value: 0.45512820512820523, normalized: !1 }, curve29: { id: "curve29", value: 0.6121794871794872, normalized: !1 }, attack0: { id: "attack0", value: 0.038461538461538464, normalized: !1 }, attack1: { id: "attack1", value: 0.038461538461538464, normalized: !1 }, attack2: { id: "attack2", value: 0.04807692307692308, normalized: !1 }, attack3: { id: "attack3", value: 0.057692307692307696, normalized: !1 }, attack4: { id: "attack4", value: 0.07692307692307693, normalized: !1 }, attack5: { id: "attack5", value: 0.07692307692307693, normalized: !1 }, attack6: { id: "attack6", value: 0.07692307692307693, normalized: !1 }, attack7: { id: "attack7", value: 0.07692307692307693, normalized: !1 }, attack8: { id: "attack8", value: 0.07692307692307693, normalized: !1 }, attack9: { id: "attack9", value: 0.07692307692307693, normalized: !1 }, attack10: { id: "attack10", value: 0.07692307692307693, normalized: !1 }, attack11: { id: "attack11", value: 0.07692307692307693, normalized: !1 }, attack12: { id: "attack12", value: 0.08173076923076923, normalized: !1 }, attack13: { id: "attack13", value: 0.09615384615384616, normalized: !1 }, attack14: { id: "attack14", value: 0.09615384615384616, normalized: !1 }, attack15: { id: "attack15", value: 0.09615384615384616, normalized: !1 }, attack16: { id: "attack16", value: 0.11538461538461539, normalized: !1 }, attack17: { id: "attack17", value: 0.1346153846153846, normalized: !1 }, attack18: { id: "attack18", value: 0.16826923076923078, normalized: !1 }, attack19: { id: "attack19", value: 0.1971153846153846, normalized: !1 }, attack20: { id: "attack20", value: 0.21153846153846154, normalized: !1 }, attack21: { id: "attack21", value: 0.25, normalized: !1 }, attack22: { id: "attack22", value: 0.28846153846153844, normalized: !1 }, attack23: { id: "attack23", value: 0.3605769230769231, normalized: !1 }, attack24: { id: "attack24", value: 0.40865384615384615, normalized: !1 }, attack25: { id: "attack25", value: 0.47596153846153844, normalized: !1 }, attack26: { id: "attack26", value: 0.5913461538461539, normalized: !1 }, attack27: { id: "attack27", value: 0.6971153846153846, normalized: !1 }, attack28: { id: "attack28", value: 0.8317307692307693, normalized: !1 }, attack29: { id: "attack29", value: 0.9230769230769231, normalized: !1 }, attack_duration: { id: "attack_duration", value: 0.2, normalized: !1 }, sustain0: { id: "sustain0", value: 0.9375, normalized: !1 }, sustain1: { id: "sustain1", value: 0.8317307692307693, normalized: !1 }, sustain2: { id: "sustain2", value: 0.7596153846153846, normalized: !1 }, sustain3: { id: "sustain3", value: 0.7259615384615384, normalized: !1 }, sustain4: { id: "sustain4", value: 0.6875, normalized: !1 }, sustain5: { id: "sustain5", value: 0.6394230769230769, normalized: !1 }, sustain6: { id: "sustain6", value: 0.5961538461538461, normalized: !1 }, sustain7: { id: "sustain7", value: 0.5384615384615384, normalized: !1 }, sustain8: { id: "sustain8", value: 0.5, normalized: !1 }, sustain9: { id: "sustain9", value: 0.46153846153846156, normalized: !1 }, sustain10: { id: "sustain10", value: 0.4375, normalized: !1 }, sustain11: { id: "sustain11", value: 0.41346153846153844, normalized: !1 }, sustain12: { id: "sustain12", value: 0.3942307692307692, normalized: !1 }, sustain13: { id: "sustain13", value: 0.36538461538461536, normalized: !1 }, sustain14: { id: "sustain14", value: 0.34134615384615385, normalized: !1 }, sustain15: { id: "sustain15", value: 0.3076923076923077, normalized: !1 }, sustain16: { id: "sustain16", value: 0.3173076923076923, normalized: !1 }, sustain17: { id: "sustain17", value: 0.28846153846153844, normalized: !1 }, sustain18: { id: "sustain18", value: 0.25, normalized: !1 }, sustain19: { id: "sustain19", value: 0.23557692307692307, normalized: !1 }, sustain20: { id: "sustain20", value: 0.22596153846153846, normalized: !1 }, sustain21: { id: "sustain21", value: 0.21153846153846154, normalized: !1 }, sustain22: { id: "sustain22", value: 0.17307692307692307, normalized: !1 }, sustain23: { id: "sustain23", value: 0.16346153846153846, normalized: !1 }, sustain24: { id: "sustain24", value: 0.15384615384615385, normalized: !1 }, sustain25: { id: "sustain25", value: 0.14423076923076922, normalized: !1 }, sustain26: { id: "sustain26", value: 0.1346153846153846, normalized: !1 }, sustain27: { id: "sustain27", value: 0.09615384615384616, normalized: !1 }, sustain28: { id: "sustain28", value: 0.08653846153846154, normalized: !1 }, sustain29: { id: "sustain29", value: 0.04326923076923077, normalized: !1 }, sustain_duration: { id: "sustain_duration", value: 3, normalized: !1 }, sustain_loop: { id: "sustain_loop", value: 0, normalized: !1 }, release0: { id: "release0", value: 0.8317307692307693, normalized: !1 }, release1: { id: "release1", value: 0.6105769230769231, normalized: !1 }, release2: { id: "release2", value: 0.5192307692307693, normalized: !1 }, release3: { id: "release3", value: 0.46634615384615385, normalized: !1 }, release4: { id: "release4", value: 0.4230769230769231, normalized: !1 }, release5: { id: "release5", value: 0.3701923076923077, normalized: !1 }, release6: { id: "release6", value: 0.36538461538461536, normalized: !1 }, release7: { id: "release7", value: 0.3173076923076923, normalized: !1 }, release8: { id: "release8", value: 0.27403846153846156, normalized: !1 }, release9: { id: "release9", value: 0.22596153846153846, normalized: !1 }, release10: { id: "release10", value: 0.1875, normalized: !1 }, release11: { id: "release11", value: 0.16826923076923078, normalized: !1 }, release12: { id: "release12", value: 0.15384615384615385, normalized: !1 }, release13: { id: "release13", value: 0.1346153846153846, normalized: !1 }, release14: { id: "release14", value: 0.12980769230769232, normalized: !1 }, release15: { id: "release15", value: 0.12980769230769232, normalized: !1 }, release16: { id: "release16", value: 0.11538461538461539, normalized: !1 }, release17: { id: "release17", value: 0.09615384615384616, normalized: !1 }, release18: { id: "release18", value: 0.09615384615384616, normalized: !1 }, release19: { id: "release19", value: 0.09615384615384616, normalized: !1 }, release20: { id: "release20", value: 0.08653846153846154, normalized: !1 }, release21: { id: "release21", value: 0.08653846153846154, normalized: !1 }, release22: { id: "release22", value: 0.08653846153846154, normalized: !1 }, release23: { id: "release23", value: 0.07692307692307693, normalized: !1 }, release24: { id: "release24", value: 0.07692307692307693, normalized: !1 }, release25: { id: "release25", value: 0.07211538461538461, normalized: !1 }, release26: { id: "release26", value: 0.07211538461538461, normalized: !1 }, release27: { id: "release27", value: 0.07211538461538461, normalized: !1 }, release28: { id: "release28", value: 0.08173076923076923, normalized: !1 }, release29: { id: "release29", value: 0.08173076923076923, normalized: !1 }, release_duration: { id: "release_duration", value: 0.4, normalized: !1 }, interpolate: { id: "interpolate", value: 1, normalized: !1 } } }
};
class V extends HTMLElement {
  constructor(a) {
    super(), this.wam = a, this.#a = [], this.selectedMenu = "preset", this.#t = this.attachShadow({ mode: "closed" }), this.#e = new pe(a.audioNode), this.wave = Array.from({ length: V.RESOLUTION }, (s, f) => this.#e.addParameter(`curve${f}`)), this.attack = Array.from({ length: V.RESOLUTION }, (s, f) => this.#e.addParameter(`attack${f}`)), this.release = Array.from({ length: V.RESOLUTION }, (s, f) => this.#e.addParameter(`release${f}`)), this.sustain = Array.from({ length: V.RESOLUTION }, (s, f) => this.#e.addParameter(`sustain${f}`)), this.interpolate = this.#e.addParameter("interpolate"), this.attack_duration = this.#e.addParameter("attack_duration"), this.release_duration = this.#e.addParameter("release_duration"), this.sustain_duration = this.#e.addParameter("sustain_duration"), this.sustain_loop = this.#e.addParameter("sustain_loop");
  }
  static {
    this.NAME = `card-cardboard${ge}`;
  }
  static {
    this.RESOLUTION = 30;
  }
  #e;
  #a;
  #t;
  connectedCallback() {
    this.#a.forEach((e) => e()), this.#a = [];
    const a = this;
    let s;
    if (this.selectedMenu == "wave") {
      const e = new A(
        -1,
        1,
        0,
        !0,
        null,
        [{ index: this.wave.length / 2, name: "" }],
        this.wave
      ), t = new q(this.interpolate, "Interpolate curve points", "interpolate"), l = y.a`<button title="Symmetrize the wave">Symmetrize</button>`;
      l.onclick = () => {
        for (let o = 0; o < this.wave.length / 2; o++)
          this.wave[this.wave.length - 1 - o].set(-this.wave[o].value);
      };
      const i = y.a`<button title="Smooth the wave shape">Smooth</button>`;
      i.onclick = () => {
        const o = this.wave.map((u) => u.value);
        for (let u = 0; u < this.wave.length; u++) {
          let v = 0;
          v += o[(u - 1 + this.wave.length) % this.wave.length], v += o[u], v += o[(u + 1) % this.wave.length], this.wave[u].set(v / 3);
        }
      };
      const r = y.a`<button title="Noisify the wave">Noise</button>`;
      r.onclick = () => {
        for (let o = 0; o < this.wave.length; o++)
          this.wave[o].set(Math.max(-1, Math.min(1, this.wave[o].value + (Math.random() - 0.5) / 2)));
      };
      const c = y.a`<button title="Set the wave to a sine wave">Sine</button>`;
      c.onclick = () => {
        for (let o = 0; o < this.wave.length; o++) this.wave[o].set(Math.sin(o / this.wave.length * Math.PI * 2));
      };
      const h = y.a`<button title="Set the wave to a square wave">Square</button>`;
      h.onclick = () => {
        for (let o = 0; o < this.wave.length; o++) this.wave[o].set(o < this.wave.length / 2 ? 1 : -1);
      };
      const n = y.a`<button title="Set the wave to a sawtooth">Sawtooth</button>`;
      n.onclick = () => {
        for (let o = 0; o < this.wave.length; o++) this.wave[o].set(o < this.wave.length / 2 ? o / this.wave.length * 2 : -2 + o / this.wave.length * 2);
      };
      const m = y.a`<button title="Set the wave to a triangle">Triangle</button>`;
      m.onclick = () => {
        for (let o = 0; o < this.wave.length; o++) this.wave[o].set(o < this.wave.length / 2 ? o / this.wave.length * 4 - 1 : 3 - o / this.wave.length * 4);
      }, s = y`
                ${e.element}
                <div id="options">
                    ${t.element}
                    <div class=category>${l} ${i} ${r}</div>
                    <div class=category>${c} ${h} ${n} ${m}</div>
                </div>
            `, this.#a.push(() => e.dispose(), () => t.dispose());
    } else if (this.selectedMenu == "attack") {
      const e = new A(
        0,
        1,
        0,
        !1,
        { name: "Attack Duration", unit: "seconds", min: 0, max: 5, step: 0.1, value: a.attack_duration },
        [],
        this.attack
      );
      s = y`
                ${e.element}
            `, this.#a.push(() => e.dispose());
    } else if (this.selectedMenu == "sustain") {
      const e = new A(
        0,
        1,
        0,
        !1,
        { name: "Sustain Duration", unit: "seconds", min: 0, max: 10, step: 0.1, value: a.sustain_duration },
        [],
        this.sustain
      ), t = new q(this.sustain_loop, "Loop Sustain Curve", "sustain_loop");
      s = y`
                ${e.element}
                <div id="options">
                    ${t.element}
                </div>
            `, this.#a.push(() => e.dispose(), () => t.dispose());
    } else if (this.selectedMenu == "release") {
      const e = new A(
        0,
        1,
        0,
        !1,
        { name: "Release Duration", unit: "seconds", min: 0, max: 5, step: 0.1, value: a.release_duration },
        [],
        this.release
      );
      s = y`
                ${e.element}
            `, this.#a.push(() => e.dispose());
    } else if (this.selectedMenu == "preset") {
      const e = this.wam.audioNode;
      s = y`
                <div class="button_list">
                ${function* () {
        for (const [t, l] of Object.entries(ye)) {
          const i = y.a`<button>${t}</button>`;
          i.onclick = () => {
            e.setState(l);
          }, yield i;
        }
      }}
                </div>
            `;
    }
    function f(e) {
      a.selectedMenu = e.target.id.replace("_menu", ""), a.connectedCallback();
    }
    this.#t.replaceChildren(y`
            <link rel="stylesheet" crossorigin href="${ke}" />
            <h1>Cardboardizer</h1>
            <ul class="menu">
                <li id=wave_menu @${{ click: f }}>Wave</li>
                <li id=attack_menu @${{ click: f }}>Attack</li>
                <li id=sustain_menu @${{ click: f }}>Sustain</li>
                <li id=release_menu @${{ click: f }}>Release</li>
                <li id=preset_menu @${{ click: f }}>Preset</li>
            </ul>
            ${s}
            <div class=crayon></div>
        `), this.#t.querySelector(`#${this.selectedMenu}_menu`).classList.add("selected");
  }
  disconnectedCallback() {
  }
  dispose() {
    this.#e.dispose(), this.#a.forEach((a) => a());
  }
}
try {
  customElements.define(V.NAME, V);
} catch {
}
class A {
  constructor(a, s, f, e, t, l, i) {
    this.diposables = [];
    const r = i.length, { diposables: c } = this, h = s - a, n = [], m = Math.round(100 - (f - a) / h * 100);
    this.element = y.a`
            <div class=curve>
                <svg viewBox="0 0 200 100">
                    <text x=0 y=7 fill=white style="font-size: .5rem">${s}</text>
                    <text x=0 y=97 fill=white style="font-size: .5rem">${a}</text>
                    <line x1=0 y1=${m} x2=200 y2=${m} stroke=white stroke-width=1 />
                    ${function* () {
      let v = 0;
      for (const { name: p, index: g } of l) {
        const _ = g / r * 200, z = A.COLORS[v % A.COLORS.length];
        yield y`<svg><text x=${_ + 2} y=80 fill=${z} style="font-size: .5rem">${p}</text></svg>`, yield y`<svg><line x1=${_} y1=0 x2=${_} y2=100 stroke=${z} stroke-width=1 /></svg>`, v++;
      }
    }}
                    ${function* () {
      const v = 200 / r, p = e ? -1 : 0, g = e ? r : r - 1;
      for (let _ = p; _ < g; _++) {
        const z = (_ + r) % r, k = (z + 1) % r, b = i[z], S = i[k], I = y.a`<svg><line stroke=black stroke-width=1 /></svg>`.children[0];
        I.x1.baseVal.value = (_ + 0.5) * v, I.x2.baseVal.value = (_ + 1.5) * v;
        const T = () => {
          I.y1.baseVal.value = 100 - (b.value - a) / h * 100, I.y2.baseVal.value = 100 - (S.value - a) / h * 100;
        };
        c.push(b.observable.add(T)), c.push(S.observable.add(T)), T(), yield I;
      }
      for (let _ = 0; _ < r; _++) {
        const z = i[_], k = y.a`<svg><circle r=1.5 stroke=white stroke-width=1 fill=black /></svg>`.children[0];
        k.cx.baseVal.value = (_ + 0.5) * v, c.push(z.link(({ to: b }) => {
          k.cy.baseVal.value = 100 - (z.value - a) / h * 100;
        })), n.push(k), yield k;
      }
    }}
                </svg>
                ${() => {
      if (t) {
        const v = y.a`
                            <div>
                                <input type="range" min=${t.min} max=${t.max} step=${t.step} />
                                <label for="curve_length">${t.name}</label>
                            </div>
                        `, p = v.children[1], g = v.children[0];
        return t.value.link(({ to: _ }) => {
          g.value = _.toString(), p.textContent = `${t.name} (${_}${t.unit ? ` ${t.unit}` : ""})`;
        }), g.addEventListener("input", () => t.value.set(parseFloat(g.value))), v;
      } else
        return;
    }}
                
            </div>
        `;
    const o = this.element.children[0], u = (v) => {
      const p = Math.round(v.offsetX / o.clientWidth * r), g = Math.max(a, Math.min(s, (o.clientHeight - v.offsetY) / o.clientHeight * h + a));
      if (p < 0 || p >= r) return;
      n.forEach((z) => z.r.baseVal.value = 1.5), n[p].r.baseVal.value = 3;
      const _ = i[p];
      v.buttons == 1 && _.set(g);
    };
    o.addEventListener("mousemove", u), o.addEventListener("mousedown", u), o.addEventListener("mouseleave", () => {
      n.forEach((v) => v.r.baseVal.value = 1.5);
    });
  }
  static {
    this.COLORS = ["red", "blue", "green", "yellow", "purple", "magenta", "cyan", "orange", "pink", "brown"];
  }
  dispose() {
    this.diposables.forEach((a) => a());
  }
}
class we extends X {
  async initialize(a) {
    return this._descriptorUrl = import.meta.resolve("./descriptor.json"), await this._loadDescriptor(), await super.initialize(a), this;
  }
  async createAudioNode(a) {
    await L.addModules(this.audioContext, this.moduleId);
    const s = new L(this);
    return await s._initialize(), a && s.setState(a), s;
  }
  async createGui() {
    return new V(this);
  }
}
export {
  we as CardboardWAM,
  we as default
};
