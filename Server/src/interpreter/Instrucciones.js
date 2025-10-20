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

class Procedimiento {
  constructor(id, cuerpo) {
    this.id = id;
    this.tipoDato = "Procedimiento";
    this.cuerpo = cuerpo;
  }

  interpretar(entorno) {
    const val = "sentencias";
    if (entorno.nombre == "Global"){
      let sub = entorno.crearSubEntorno(`Procedimiento_${this.id}`);
      entorno.declararPr(this.id, this.tipoDato, val,this.cuerpo,sub);
    }else {entorno.errores.push({ tipo: "Semántico", descripcion: `No se puede declarar una funcion en este entorno: [${entorno.nombre}], solo en el Global`}); return null;}
  
  }
} 

class Ejecutar {
  constructor(id) {
    this.id = id;
  }

  interpretar(entorno) {
    const proced = entorno.obtenerCuer(this.id); 
    if (proced){
      let subEntrono = entorno.getHijo(`Procedimiento_${this.id}`);
      
      if (subEntrono){
        const {interpretar,convertirNodo} = require("./interpreter");

        for (const nodo of proced || []) {
        const instruccion = convertirNodo(nodo);


        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          return null;
        }
      }
      } else console.log("no se encontro el sub entorno del procedimiento");
      
    }else {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado el procedimiento [${this.id}]`}); return null;}
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
      return null;
    }
    const valorActual = entorno.obtener(this.id);
    if (typeof valorActual !== "number") {
      entorno.errores.push({ tipo:"Semántico", descripcion:`No se puede aplicar '++' a una variable no numérica (${this.id})` });
      return null;
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
      return null;
    }    
    const valorActual = entorno.obtener(this.id);
    if (typeof valorActual !== "number") {
      entorno.errores.push({ tipo:"Semántico", descripcion:`No se puede aplicar '--' a una variable no numérica (${this.id})` });
      return null;
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
      return null;
    }

    if (cond) {
      const subEntrono = entorno.crearSubEntorno(`SI: ${this.conunt}`);
      for (const nodo of this.cuerpo || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          return null;
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
          return null;
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
          return null;
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
      entorno.errores.push({ tipo: "Semántico", descripcion: "La condición del While no es booleana" });
      return null;
    }

    while (this.condicion.interpretar(entorno)) {
      const subEntrono = entorno.crearSubEntorno(`WHILE: ${this.conunt}`);
      for (const nodo of this.cuerpo || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          return null;
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
      entorno.errores.push({ tipo: "Semántico", descripcion: "La condición del While no es booleana"});
      return null;
    }

    while (entorno.obtener(this.condicion)) {
      const subEntrono = entorno.crearSubEntorno(`WHILE: ${this.conunt}`);
      for (const nodo of this.cuerpo || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
          return null;
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

    if (k == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.der.nombre} en  [${entorno.nombre}]`}); return null;}
    if (o == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.izq.nombre} en  [${entorno.nombre}]`}); return null;}

    if (this.tip =="MENORQUE" && this.actTipo == "INC"){
      for (let i = o;i<k;i++){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono); 
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
            return null;
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
            return null;
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
            return null;
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
            return null;
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
            return null;
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
            return null;
          }
        }
        this.act.interpretar(subEntrono); 
      }
    } else return null;

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
    if (k == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.der.nombre} en  [${entorno.nombre}]`}); return null;}
    if (o == null) {entorno.errores.push({ tipo: "Semántico", descripcion: `No se ha declarado la variable ${this.izq.nombre} en  [${entorno.nombre}]`}); return null;}

    if (this.tip =="MENORQUE" && this.actTipo == "INC"){
      for (let i = o;i<k;i++){
        
        for (const nodo of this.cuerpo || []) {
          const instruccion = convertirNodo(nodo);
          if (instruccion) {
            instruccion.interpretar(subEntrono);
          } else {
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
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
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
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
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
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
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
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
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
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
            entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
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
      return null;
    }
    if (typeof cond !== "boolean") {
      entorno.errores.push({
        tipo: "Semántico",
        descripcion: "La condición del if no es booleana"
      });
      return null;
    }

    if (cond) {
      const subEntrono = entorno.crearSubEntorno(`SI: ${this.conunt}`);
      for (const nodo of this.cuerpo || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
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
      return null;
    }
    if (typeof cond !== "boolean") {
      entorno.errores.push({tipo: "Semántico",descripcion: "La condición del if no es booleana" });
      return null;
    }

    if (cond) {
      for (const nodo of this.cuerpoVerdadero || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
        }
      }
    }else{
      for (const nodo of this.cuerpoFalso || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
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
      entorno.errores.push({ tipo: "Semántico", descripcion: "La condición del if no es booleana" });
      return null;
    }

    if (cond) {
      for (const nodo of this.cuerpoVerdadero || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
        }
      }
    }else{
      for (const nodo of this.cuerpoFalso || []) {
        const instruccion = convertirNodo(nodo);
        if (instruccion) {
          instruccion.interpretar(subEntrono);
        } else {
          entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" }); return null;
        }
      }
    } 
  }
}


module.exports = { Declaracion, Asignacion, Imprimir, Incremento, Decremento, Declaracion2,Imprimirln, If, IfElse,If2,IfElse2,For1,For2,While,While2,DoWhile,DoWhile2,Procedimiento,Ejecutar };