
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
      { entorno.errores.push({ tipo: "Semántico", descripcion: "No se admite la Potencia entre no numericos" }); return null;} 
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
      { entorno.errores.push({ tipo: "Semántico", descripcion: "No se admite el modulo entre no numericos" }); return null;} 
    }
    return l%r;
  }
}

class Suma {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    const l = this.izq.interpretar(entorno);
    const r = this.der.interpretar(entorno);
    if (r == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.der.nombre}`}); return null;}
    if (l == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.izq.nombre}`}); return null;}
    if (typeof l === "string" || typeof r === "string" && (l.length != 1 || r.length != 1)) {return String(l)+String(r)}
    else if (typeof l === "boolean" && typeof r == "boolean"){ entorno.errores.push({ tipo: "Semántico", descripcion: "No se admite la suma entre booleanos" }); return null;}
    else if (typeof l === "string" && typeof r == "boolean" ) {entorno.errores.push({ tipo: "Semántico", descripcion: "No se admite la suma entre char y booleano" }); return null;}
    else if (typeof l === "boolean" && typeof r == "string" ) {entorno.errores.push({ tipo: "Semántico", descripcion: "No se admite la suma entre char y booleano" }); return null;}
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


class Casteo {
  constructor( der, cast) { this.der = der; this.cast = cast; }
  interpretar(entorno) {
    const {interpretar,convertirNodo} = require("./interpreter");
    console.log(this.der);
    console.log(this.cast);    
    let d = convertirNodo(this.der).interpretar(entorno);
    
   if (this.der.tipo != "BOOL" && this.der.tipo != "CADENA"){
      switch(this.cast){
        case "Entero":{ // pasar a
          switch(this.der.tipo){ // llega
            case "DECIMAL": return  parseInt(d);
            case "CHAR": return   d.charCodeAt(d);
            default:{ entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha podido realizar el casteo Tipos no validos`}); return null;}
          }    
        }
        case "Caracter":{
          if (this.der.tipo == "NUMERO"){
            n = String.fromCharCode(d);
            if (isNaN(n)){entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha podido realizar el casteo Tipos no validos`}); return null;} 
            else return n
          }else {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha podido realizar el casteo Tipos no validos`}); return null;} 
        }
        case "Cadena":{ //pasar a
          switch(this.der.tipo){ // llega
            case "NUMERO": return  String(d);
            case "DECIMAL": return   String(d);
            default: {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha podido realizar el casteo Tipos no validos`}); return null;}
          }   
        }
        case "Decimal":{
          switch(this.der.tipo){ // llega
            case "NUMERO": return  parseFloat(d);
            case "CHAR": return   parseFloat(d.charCodeAt(d));
            default: {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha podido realizar el casteo Tipos no validos`}); return null;}
          }           
        }
        default: {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha podido realizar el casteo Tipos no validos`}); return null;}
      }
   }else{entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha podido realizar el casteo Tipos no validos`}); return null;}

  }
}



class Not {
  constructor(der) { this.der = der; }
  interpretar(entorno) {
    const b = entorno.obtener(this.der);
    if (b == null) {
      entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${der}`});
      return null;
    }
    if (typeof b != "boolean"){
      entorno.errores.push({ tipo: "Semántico", descripcion: `No se puede aplicar NOT a no booleanos`});
      return null;
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
      return null;
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
      return null;
    }
    return a || b;
  }
}



class Igual {
  constructor(izq, der) { this.izq = izq; this.der = der; }
  interpretar(entorno) {
    let d = this.der.interpretar(entorno);
    let i = this.izq.interpretar(entorno);

    return i === d;
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
    if (b === 0) {entorno.errores.push({ tipo: "Semántico", descripcion: "División por cero" }); return null;}
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
  And,Or,Casteo
};