const Entorno = require("./Entorno");
const {
  Declaracion,
  Declaracion2,
  Asignacion,
  Imprimir,Imprimirln,If,IfElse,
  Incremento,Decremento,If2,IfElse2,For1,For2,While,
  While2,DoWhile,DoWhile2,Procedimiento,Ejecutar
} = require("./Instrucciones");

const {
  Numero,
  Cadena,
  Identificador,
  Suma,
  Resta,
  Multiplicacion,
  Division,
  BOOL,Mayor,Menor,Igual,
  NoIgual, Decimal,Exp,Mod,Caracter,Not,
  MayorIgual,MenorIgual,And,Or,Casteo,ToLower,
  ToUpper
} = require("./Expresiones");

let s ="";
let ifcount =0;
let ifElsecount =0;
let forCount =0;
let whCount =0;
let DwhCount =0;

function convertirNodo(nodo) {
  if (!nodo || typeof nodo !== "object") return null;
  switch (nodo.tipo) {
    case "DECLARACION":
      return new Declaracion(nodo.id, nodo.tipoDato, convertirNodo(nodo.valor));
    case "DECLARACION2":
      return new Declaracion2(nodo.id, nodo.tipoDato, nodo.valor);      
    case "ASIGNACION":     
      return new Asignacion(nodo.id, convertirNodo(nodo.valor));
    case "IMPRIMIR":
      return new Imprimir(convertirNodo(nodo.valor));
    case "IMPRIMIRLN":
      return new Imprimirln(convertirNodo(nodo.valor)); 
    case "INC":
      return new Incremento(nodo.nombre);
    case "DEC":
      return new Decremento(nodo.nombre);
    case "NOT":
      return new Not(nodo.nombre);           

    case "NUMERO":
      return new Numero(nodo.valor);
    case "CADENA":
      return new Cadena(nodo.valor);  
    case "ID":
      return new Identificador(nodo.nombre);
    case "BOOL":
      return new BOOL(nodo.valor);
    case "DECIMAL":
      return new Decimal(nodo.valor);
    case "CHAR":
      return new Caracter(nodo.valor);      


    case "SUMA":
      return new Suma(convertirNodo(nodo.izquierda), convertirNodo(nodo.derecha));
    case "RESTA":
      return new Resta(convertirNodo(nodo.izquierda), convertirNodo(nodo.derecha));
    case "MULTIPLICACION":
      return new Multiplicacion(convertirNodo(nodo.izquierda), convertirNodo(nodo.derecha));
    case "DIVISION":
      return new Division(convertirNodo(nodo.izquierda), convertirNodo(nodo.derecha));
    case "POTENCIA":
      return new Exp(convertirNodo(nodo.izquierda), convertirNodo(nodo.derecha));
    case "MODULO":
      return new Mod(convertirNodo(nodo.izquierda),convertirNodo(nodo.derecha));      


    case "MAYORQUE":
      return new Mayor(convertirNodo(nodo.izquierda),convertirNodo(nodo.derecha));
    case "MENORQUE":
      return new Menor(convertirNodo(nodo.izquierda), convertirNodo(nodo.derecha));
    case "MAYORIGUAL":
      return new MayorIgual(convertirNodo(nodo.izquierda), convertirNodo(nodo.derecha));
    case "MENORIGUAL":
      return new MenorIgual(convertirNodo(nodo.izquierda), convertirNodo(nodo.derecha));            
    case "IGUAL":
      return new Igual(convertirNodo(nodo.izquierda),convertirNodo(nodo.derecha));
    case "NOIGUAL":
      return new NoIgual(convertirNodo(nodo.izquierda),convertirNodo(nodo.derecha));
    case "AND":
      return new And(convertirNodo(nodo.izquierda),convertirNodo(nodo.derecha));
    case "OR":
      return new Or(convertirNodo(nodo.izquierda),convertirNodo(nodo.derecha));  
      
      
    case "IF":
      ifcount++;
      return new If(convertirNodo(nodo.condicion),nodo.cuerpo,ifcount);
    case "IF2":
      ifcount++;
      return new If2(nodo.condicion,nodo.cuerpo,ifcount);  

    case "IF_ELSE":
      ifElsecount++;
      return new IfElse(convertirNodo(nodo.condicion),nodo.cuerpoVerdadero,nodo.cuerpoFalso,ifElsecount);
    case "IF_ELSE2":
      ifElsecount++;
      return new IfElse2(nodo.condicion,nodo.cuerpoVerdadero,nodo.cuerpoFalso,ifElsecount);
      
    case "FOR1":
      forCount++;
      return new For1(convertirNodo(nodo.declaracion),convertirNodo(nodo.condicion) ,convertirNodo(nodo.act), 
                      nodo.cuerpo,forCount, nodo.condicion.derecha, nodo.condicion.izquierda,nodo.condicion.tipo,nodo.act);
    case "FOR2":
      forCount++;
      return new For2(convertirNodo(nodo.asignacion),convertirNodo(nodo.condicion) ,convertirNodo(nodo.act), 
                      nodo.cuerpo,forCount, nodo.condicion.derecha, nodo.condicion.izquierda,nodo.condicion.tipo,nodo.act.tipo);                    
    case "WHILE":
      whCount++;
      return new While(convertirNodo(nodo.condicion),nodo.cuerpo,whCount);

    case "WHILE2":
      whCount++;
      return new While2(nodo.condicion,nodo.cuerpo,whCount);


    case "DOWHILE":
      whCount++;
      return new DoWhile(convertirNodo(nodo.condicion),nodo.cuerpo,DwhCount);

    case "DOWHILE2":
      whCount++;
      return new DoWhile2(nodo.condicion,nodo.cuerpo,DwhCount);
    case "CASTEO":
      return new Casteo(nodo.derecha,nodo.cast);
    case "TOLOWER":
      return new ToLower(convertirNodo(nodo.derecha));
    case "TOUPPER":
      return new ToUpper(convertirNodo(nodo.derecha));
      
    case "PROCED":
      return new Procedimiento(nodo.id,nodo.cuerpo);
    case "EJECUTAR":
      return new Ejecutar(nodo.nombre);

    default:
      return null;
  }
}

function interpretar(nodosAST) {
  ifcount =0;
  ifElsecount =0;
  forCount =0;
  whCount =0;
  DwhCount = 0;
  const entorno = new Entorno();

  for (const nodo of nodosAST || []) {
    const instruccion = convertirNodo(nodo);
    if (instruccion) {
      instruccion.interpretar(entorno);
    } else {
      entorno.errores.push({ tipo: "Sintáctico", descripcion: "Nodo inválido" });
    }
  }

  let res = [...entorno.variables.entries()].map(([id, val]) => ({
    id,
    tipo: val.tipo, 
    valor: val.valor, entorno: val.entorno
  }));
  s = "";
  s += entorno.salida;

  for (const sub of entorno.hijos) {
    entorno.errores = entorno.errores.concat(sub.errores);
    s  += sub.salida;
    res = res.concat(obtenerSimbolos(sub));
  }

  return {
    consola: s,
    errores: entorno.errores,
    simbolos: res
  };
}


function obtenerSimbolos(entorno) {
  let res = [...entorno.variables.entries()].map(([id, val]) => ({
    id, 
    tipo: 
    val.tipo, 
    valor: 
    val.valor, 
    entorno: val.entorno
  }));

  for (const sub of entorno.hijos) {
    entorno.errores = entorno.errores.concat(sub.errores);
    s += sub.salida;
    res = res.concat(obtenerSimbolos(sub));
    
  }
  
  return res;
}

module.exports = {interpretar,convertirNodo};