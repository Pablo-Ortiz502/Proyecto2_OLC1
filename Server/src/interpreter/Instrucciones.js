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
    return valorActual + 1;
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
    return valorActual - 1;
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

class DoWhile {
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
        descripcion: "La condición del While no es booleana"
      });
      return;
    }

    do{
      const subEntrono = entorno.crearSubEntorno(`DOWHILE: ${this.conunt}`);
      for (const nodo of this.cuerpo || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
        }
      }
    }while (!this.condicion.interpretar(entorno));
  }
}

class DoWhile2 {
  constructor(condicion, cuerpo,count) {
    this.condicion = condicion;
    this.cuerpo = cuerpo;
    this.conunt = count;
  }

  interpretar(entorno) {
    const {interpretar,convertirNodo} = require("./interpreter");
    const cond = entorno.obtener(this.condicion);
    if (typeof cond !== "boolean") {
      entorno.errores.push({
        tipo: "Semántico",
        descripcion: "La condición del While no es booleana"
      });
      return;
    }

     do{
      const subEntrono = entorno.crearSubEntorno(`DOWHILE: ${this.conunt}`);
      for (const nodo of this.cuerpo || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
        }
      }
    }while (!entorno.obtener(this.condicion)); 
  }
}




class While {
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
        descripcion: "La condición del While no es booleana"
      });
      return;
    }

    while (this.condicion.interpretar(entorno)) {
      const subEntrono = entorno.crearSubEntorno(`WHILE: ${this.conunt}`);
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

class While2 {
  constructor(condicion, cuerpo,count) {
    this.condicion = condicion;
    this.cuerpo = cuerpo;
    this.conunt = count;
  }

  interpretar(entorno) {
    const {interpretar,convertirNodo} = require("./interpreter");
    const cond = entorno.obtener(this.condicion);
    if (typeof cond !== "boolean") {
      entorno.errores.push({
        tipo: "Semántico",
        descripcion: "La condición del While no es booleana"
      });
      return;
    }

    while (entorno.obtener(this.condicion)) {
      const subEntrono = entorno.crearSubEntorno(`WHILE: ${this.conunt}`);
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




class For1 {
  constructor(declaracion,condicion,act, cuerpo,count, der,izq,tip,actTipo) {
    this.izq = izq;
    this.condicion = condicion;
    this.der = der;
    this.tip = tip;
    this.cuerpo = cuerpo;
    this.conunt = count;
    this.declaracion = declaracion;
    this.act = act;
    this.actTipo = actTipo.tipo;
  }

  interpretar(entorno) {
    const {interpretar,convertirNodo} = require("./interpreter");
    const subEntrono = entorno.crearSubEntorno(`Para: ${this.conunt}`);
    this.declaracion.interpretar(subEntrono);
    this.condicion.interpretar(subEntrono);
    let o = convertirNodo(this.izq).interpretar(subEntrono);
    let k = convertirNodo(this.der).interpretar(subEntrono);

    if (k == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.der.nombre} en  [${entorno.nombre}]`}); return;}
    if (o == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.izq.nombre} en  [${entorno.nombre}]`}); return;}

    if (this.tip =="MENORQUE" && this.actTipo == "INC"){
      for (let i = o;i<k;i++){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono); 
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    }
    else if (this.tip =="MAYORQUE" && this.actTipo == "DEC"){
      for (let i = o;i>k;i--){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } else if (this.tip =="MENORIGUAL" && this.actTipo == "INC"){
      for (let i = o;i<=k;i++){
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } else if (this.tip =="MAYORIGUAL" && this.actTipo == "DEC"){
      for (let i = o;i>=k;i--){
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } else if (this.tip =="IGUAL" && this.actTipo == "INC"){
      for (let i = o;i==k;i++){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } else if (this.tip =="MENORQUE" && this.actTipo == "DEC"){
      for (let i = o;i==k;i--){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } 

  }
}


class For2 {
  constructor(asignacion,condicion,act, cuerpo,count, der,izq,tip,actTipo) {
    this.izq = izq;
    this.condicion = condicion;
    this.der = der;
    this.tip = tip;
    this.cuerpo = cuerpo;
    this.conunt = count;
    this.asignacion = asignacion;
    this.act = act;
    this.actTipo = actTipo;
  }

  interpretar(entorno) {
    const {interpretar,convertirNodo} = require("./interpreter");
    const subEntrono = entorno.crearSubEntorno(`Para: ${this.conunt}`);
    this.asignacion.interpretar(subEntrono);
    this.condicion.interpretar(subEntrono);
    let o = convertirNodo(this.izq).interpretar(subEntrono);
    let k = convertirNodo(this.der).interpretar(subEntrono);
    if (k == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.der.nombre} en  [${entorno.nombre}]`}); return;}
    if (o == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.izq.nombre} en  [${entorno.nombre}]`}); return;}

    if (this.tip =="MENORQUE" && this.actTipo == "INC"){
      for (let i = o;i<k;i++){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    }
    else if (this.tip =="MAYORQUE" && this.actTipo == "DEC"){
      for (let i = o;i>k;i--){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } else if (this.tip =="MENORIGUAL" && this.actTipo == "INC"){
      for (let i = o;i<=k;i++){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } else if (this.tip =="MAYORIGUAL" && this.actTipo == "DEC"){
      for (let i = o;i>=k;i--){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } else if (this.tip =="IGUAL" && this.actTipo == "INC"){
      for (let i = o;i==k;i++){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } else if (this.tip =="MENORQUE" && this.actTipo == "DEC"){
      for (let i = o;i==k;i--){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } 

  }
}


class If2 {
  constructor(condicion, cuerpo,count) {
    this.condicion = condicion;
    this.cuerpo = cuerpo;
    this.conunt = count;
  }

  interpretar(entorno) {
    const {interpretar,convertirNodo} = require("./interpreter");
    const cond = entorno.obtener(this.condicion);
    if (cond == null){
      entorno.errores.push({ tipo: "Semantico", descripcion: `Variable ${this.condicion} no declarada` });
      return;
    }
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


class IfElse2 {
  constructor(condicion, cuerpoVerdadero,cuerpoFalso, count) {
    this.condicion = condicion;
    this.cuerpoVerdadero = cuerpoVerdadero;
    this.cuerpoFalso = cuerpoFalso;
    this.count = count; 
  }

  interpretar(entorno) {
    
    const {interpretar,convertirNodo} = require("./interpreter");
    const cond = entorno.obtener(this.condicion);
    const subEntrono = entorno.crearSubEntorno(`SI_DE LO CONTRARIO: ${this.count}`);
    if (cond == null){
      entorno.errores.push({ tipo: "Semantico", descripcion: `Variable ${this.condicion} no declarada` });
      return;
    }
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

module.exports = { Declaracion, Asignacion, Imprimir, Incremento, Decremento, Declaracion2,Imprimirln, If, IfElse,If2,IfElse2,For1,For2,While,While2,DoWhile,DoWhile2 };