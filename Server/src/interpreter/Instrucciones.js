

class Declaracion {
  constructor(id, tipoDato, valor) { this.id = id; this.tipoDato = tipoDato; this.valor = valor; }
  interpretar(entorno) {
    const val = this.valor.interpretar(entorno);
    entorno.declarar(this.id, this.tipoDato, val);
  }
}


class Declaracion2 {
  constructor(id, tipoDato, valor) {
    this.id = id;
    this.tipoDato = tipoDato;
    this.valor = valor;
  }

  interpretar(entorno) {
    const val = this.valor;
    entorno.declarar(this.id, this.tipoDato, val);
  }
}

class Asignacion {
  constructor(id, valor) {
    this.id = id;
    this.valor = valor;
  }

  interpretar(entorno) {
    const val = this.valor.interpretar(entorno);
    entorno.asignar(this.id, val);
  }
}

class Imprimir {
  constructor(valor) {
    this.valor = valor;
  }

  interpretar(entorno) {
    const val = this.valor.interpretar(entorno);
    entorno.salida += (val !== undefined && val !== null ? val : "null") ;
  }
}

class Imprimirln {
  constructor(valor) {
    this.valor = valor;
  }

  interpretar(entorno) {
    const val = this.valor.interpretar(entorno);
    entorno.salida += (val !== undefined && val !== null ? val : "null") + "\n";
  }
}


class Incremento {
  constructor(id) { this.id = id; }
  interpretar(entorno) {
    if (entorno.obtener(this.id) == null) {
      entorno.errores.push({ tipo:"Semántico", descripcion:`No se ha declarado la variable (${this.id})` });
      return;
    }
    const valorActual = entorno.obtener(this.id);
    if (typeof valorActual !== "number") {
      entorno.errores.push({ tipo:"Semántico", descripcion:`No se puede aplicar '++' a una variable no numérica (${this.id})` });
      return;
    }
    entorno.asignar(this.id, valorActual + 1);
  }
}

class Decremento {
  constructor(id) { this.id = id; }
  interpretar(entorno) {
    if (entorno.obtener(this.id) == null) {
      entorno.errores.push({ tipo:"Semántico", descripcion:`No se ha declarado la variable (${this.id})` });
      return;
    }    
    const valorActual = entorno.obtener(this.id);
    if (typeof valorActual !== "number") {
      entorno.errores.push({ tipo:"Semántico", descripcion:`No se puede aplicar '--' a una variable no numérica (${this.id})` });
      return;
    }
    entorno.asignar(this.id, valorActual - 1);
  }
}

class If {
  constructor(condicion, cuerpo,count) {
    this.condicion = condicion;
    this.cuerpo = cuerpo;
    this.conunt = count;
  }

  interpretar(entorno) {
    const {interpretar,convertirNodo} = require("./interpreter");
    const cond = this.condicion.interpretar(entorno);
    if (typeof cond !== "boolean") {
      entorno.errores.push({
        tipo: "Semántico",
        descripcion: "La condición del if no es booleana"
      });
      return;
    }

    if (cond) {
      const subEntrono = entorno.crearSubEntorno(`SI: ${this.conunt}`);
      for (const nodo of this.cuerpo || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
        }
      }
    } 
  }
}

class IfElse {
  constructor(condicion, cuerpoVerdadero,cuerpoFalso, count) {
    this.condicion = condicion;
    this.cuerpoVerdadero = cuerpoVerdadero;
    this.cuerpoFalso = cuerpoFalso;
    this.count = count; 
  }

  interpretar(entorno) {
    
    const {interpretar,convertirNodo} = require("./interpreter");
    const cond = this.condicion.interpretar(entorno);
    const subEntrono = entorno.crearSubEntorno(`SI_DE LO CONTRARIO: ${this.count}`);
    if (typeof cond !== "boolean") {
      entorno.errores.push({
        tipo: "Semántico",
        descripcion: "La condición del if no es booleana"
      });
      return;
    }

    if (cond) {
      for (const nodo of this.cuerpoVerdadero || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
        }
      }
    }else{
      for (const nodo of this.cuerpoFalso || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
        }
      }
    } 
  }
}

module.exports = { Declaracion, Asignacion, Imprimir, Incremento, Decremento, Declaracion2,Imprimirln, If, IfElse };