
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
    if (r == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.der.nombre}`}); return;}
    if (l == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.izq.nombre}`}); return;}
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
    let d = this.der.interpretar(entorno);
    let i = this.izq.interpretar(entorno);

    return i - d;
  }
}

class Mayor {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    let d = this.der.interpretar(entorno);
    let i = this.izq.interpretar(entorno);

    return i > d;
  }
}

class Menor {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    let d = this.der.interpretar(entorno);
    let i = this.izq.interpretar(entorno);

    return i < d;
  }
}

class MayorIgual {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    let d = this.der.interpretar(entorno);
    let i = this.izq.interpretar(entorno);

    return i >= d;
  }
}

class MenorIgual {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    let d = this.der.interpretar(entorno);
    let i = this.izq.interpretar(entorno);

    return i <= d;
  }
}

class Not {
  constructor(der) { this.der = der; }
  interpretar(entorno) {
    const b = entorno.obtener(this.der);
    if (b == null) {
      entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${der}`});
      return;
    }
    if (typeof b != "boolean"){
      entorno.errores.push({ tipo: "Semántico", descripcion: `No se puede aplicar NOT a no booleanos`});
      return;
    }    
    return !b;
  }
}

class And {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    const a = this.izq.interpretar(entorno);
    const b = this.der.interpretar(entorno);
    if (typeof a != "boolean" || typeof b != "boolean") {
      entorno.errores.push({ tipo: "Semántico", descripcion: "Solo se puede operar AND con booleanos" });
      return;
    }
    return a && b;
  }
}

class Or {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    const a = this.izq.interpretar(entorno);
    const b = this.der.interpretar(entorno);

    if (typeof a != "boolean" || typeof b != "boolean") {
      entorno.errores.push({ tipo: "Semántico", descripcion: "Solo se puede operar OR con booleanos" });
      return;
    }
    return a || b;
  }
}



class Igual {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    let d = this.der.interpretar(entorno);
    let i = this.izq.interpretar(entorno);

    return i = d;
  }
}

class NoIgual {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    let d = this.der.interpretar(entorno);
    let i = this.izq.interpretar(entorno);


    return i != d;
  }
}

class Multiplicacion {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    let d = this.der.interpretar(entorno);
    let i = this.izq.interpretar(entorno);

    return i * d;
  }
}

class Division {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    const a = this.izq.interpretar(entorno);
    const b = this.der.interpretar(entorno);     
    if (b === 0) {entorno.errores.push({ tipo: "Semántico", descripcion: "División por cero" }); return;}
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
  Exp,Mod,Caracter,Not,MayorIgual,MenorIgual,
  And,Or
};