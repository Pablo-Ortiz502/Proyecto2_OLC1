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
    const valorActual = entorno.obtener(this.id);
    if (typeof valorActual !== "number") {
      entorno.errores.push({ tipo:"Semántico", descripcion:`No se puede aplicar '--' a una variable no numérica (${this.id})` });
      return;
    }
    entorno.asignar(this.id, valorActual - 1);
  }
}

module.exports = { Declaracion, Asignacion, Imprimir, Incremento, Decremento, Declaracion2,Imprimirln };
