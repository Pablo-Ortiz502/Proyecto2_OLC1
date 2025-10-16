
class Numero {
  constructor(valor) { this.valor = Number(valor); }
  interpretar(_) { return this.valor; }
}

class Cadena {
  constructor(valor) { this.valor = String(valor); }
  interpretar(_) { return this.valor; }
}

class Caracter {
  constructor(valor) { this.valor = String(valor); }
  interpretar(_) { return this.valor; }
}


class Decimal {
  constructor(valor) { this.valor = Number(valor); }
  interpretar(_) { return this.valor; }
}


class BOOL {
  constructor(valor) { this.valor = Boolean(valor); }
  interpretar(_) { return this.valor; }
}

class Identificador {
  constructor(nombre) { this.nombre = nombre; }
  interpretar(entorno) { return entorno.obtener(this.nombre); }
}

class Exp {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    const l = this.izq.interpretar(entorno);
    const r = this.der.interpretar(entorno);
    if(typeof l != "number" || typeof r != "number"){
      { entorno.errores.push({ tipo: "Semántico", descripcion: "No se admite la Potencia entre no numericos" }); return;} 
    }
    return l**r;
  }
}

class Mod {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    const l = this.izq.interpretar(entorno);
    const r = this.der.interpretar(entorno);
    if(typeof l != "number" || typeof r != "number"){
      { entorno.errores.push({ tipo: "Semántico", descripcion: "No se admite el modulo entre no numericos" }); return;} 
    }
    return l%r;
  }
}

class Suma {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    const l = this.izq.interpretar(entorno);
    const r = this.der.interpretar(entorno);
    if (typeof l === "string" || typeof r === "string" && (l.length != 1 || r.length != 1)) {return String(l)+String(r)}
    else if (typeof l === "boolean" && typeof r == "boolean"){ entorno.errores.push({ tipo: "Semántico", descripcion: "No se admite la suma entre booleanos" }); return;}
    else if (typeof l === "string" && typeof r == "boolean" ) {entorno.errores.push({ tipo: "Semántico", descripcion: "No se admite la suma entre char y booleano" }); return;}
    else if (typeof l === "boolean" && typeof r == "string" ) {entorno.errores.push({ tipo: "Semántico", descripcion: "No se admite la suma entre char y booleano" }); return;}
    return l + r;
  }
}


class Resta {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    return this.izq.interpretar(entorno) - this.der.interpretar(entorno);
  }
}

class Mayor {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    return this.izq.interpretar(entorno) > this.der.interpretar(entorno);
  }
}

class Menor {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    return this.izq.interpretar(entorno) < this.der.interpretar(entorno);
  }
}

class Igual {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    return this.izq.interpretar(entorno) === this.der.interpretar(entorno);
  }
}

class NoIgual {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    return this.izq.interpretar(entorno) != this.der.interpretar(entorno);
  }
}

class Multiplicacion {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    return this.izq.interpretar(entorno) * this.der.interpretar(entorno);
  }
}

class Division {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    const a = this.izq.interpretar(entorno);
    const b = this.der.interpretar(entorno);
    if (b === 0) {
      entorno.errores.push({ tipo: "Semántico", descripcion: "División por cero" });
    }
    return a / b;
  }
}



module.exports = {
  Numero,
  Cadena,
  Identificador,
  Suma,
  Resta,
  Multiplicacion,
  Division,
  BOOL,Mayor,Menor,
  Igual,NoIgual,Decimal,
  Exp,Mod,Caracter
};
