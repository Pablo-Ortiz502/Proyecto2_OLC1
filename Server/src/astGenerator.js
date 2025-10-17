
let contador = 0;

function generarAST(instrucciones) {
  contador = 0;
  let dot = 'digraph AST {\nnode [shape=box];\n';
  const conexiones = [];
  const nodos = [];

  const raizId = nuevoNodo("INICIO", nodos);

  for (const instr of instrucciones || []) {
    const sub = procesarNodo(instr, nodos, conexiones);
    conexiones.push(`${raizId} -> ${sub};`);
  }

  dot += nodos.join("\n") + "\n" + conexiones.join("\n") + "\n}";
  return dot;
}

function nuevoNodo(label, nodos) {
  const id = `n${contador++}`;
  const safeLabel = String(label).replace(/"/g, '\\"');
  nodos.push(`${id} [label="${safeLabel}"]`);
  return id;
}

function procesarNodo(nodo, nodos, conexiones) {
  if (!nodo || typeof nodo !== "object") {
    return nuevoNodo("null", nodos);
  }

  switch (nodo.tipo) {
    case "DECLARACION2":
    case "DECLARACION": {
      const raiz = nuevoNodo("DECLARACION", nodos);
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      const tipoNode = nuevoNodo(`TIPO: ${nodo.tipoDato}`, nodos);
      const valNode = procesarNodo(nodo.valor, nodos, conexiones);
      conexiones.push(`${raiz} -> ${idNode}`);
      conexiones.push(`${raiz} -> ${tipoNode}`);
      conexiones.push(`${raiz} -> ${valNode}`);
      return raiz;
    }
    case "IF_ELSE":{
      const raiz = nuevoNodo("SI_DE LO CONTRARIO", nodos);
      const condNode = procesarNodo(nodo.condicion, nodos, conexiones);
      for(const n of nodo.cuerpoVerdadero){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${raiz} -> ${valNode}`);
      }

      for(const n of nodo.cuerpoFalso){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${raiz} -> ${valNode}`);
      }
      conexiones.push(`${raiz} -> ${condNode}`);
      return raiz;

    }

    case "IF":{
      const raiz = nuevoNodo("SI", nodos);
      const condNode = procesarNodo(nodo.condicion, nodos, conexiones);
      for(const n of nodo.cuerpo){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${raiz} -> ${valNode}`);
      }
      conexiones.push(`${raiz} -> ${condNode}`);
      return raiz;
    }


    case "ASIGNACION": {
      const raiz = nuevoNodo("ASIGNACION", nodos);
      const idNode = nuevoNodo(`ID: ${nodo.id}`, nodos);
      const valNode = procesarNodo(nodo.valor, nodos, conexiones);
      conexiones.push(`${raiz} -> ${idNode}`);
      conexiones.push(`${raiz} -> ${valNode}`);
      return raiz;
    }
    
    case "IMPRIMIR": {
      const raiz = nuevoNodo("IMPRIMIR", nodos);
      const valNode = procesarNodo(nodo.valor, nodos, conexiones);
      conexiones.push(`${raiz} -> ${valNode}`);
      return raiz;
    }
    case "IMPRIMIRLN": {
      const raiz = nuevoNodo("IMPRIMIRLN", nodos);
      const valNode = procesarNodo(nodo.valor, nodos, conexiones);
      conexiones.push(`${raiz} -> ${valNode}`);
      return raiz;
    }    

    case "NUMERO":
      return nuevoNodo(`NUM: ${nodo.valor}`, nodos);

    case "CADENA":
      return nuevoNodo(`CAD: ${nodo.valor}`, nodos);

    case "ID":
      return nuevoNodo(`ID: ${nodo.nombre}`, nodos);
    case "BOOL":
      return nuevoNodo(`BOOL: ${nodo.valor}`, nodos);
    case "DECIMAL":
      return nuevoNodo(`DECIMAL: ${nodo.valor}`, nodos);
    case "CHAR":
      return nuevoNodo(`CAR: ${nodo.valor}`, nodos);

    case "SUMA":
    case "RESTA":
    case "MAYORQUE":
    case "MENORQUE":
    case "IGUAL":
    case "NOIGUAL":   
    case "MULTIPLICACION":
    case "MODULO":
    case "POTENCIA":    
    case "DIVISION": {
      const raiz = nuevoNodo(nodo.tipo, nodos);
      const izq = procesarNodo(nodo.izquierda, nodos, conexiones);
      const der = procesarNodo(nodo.derecha, nodos, conexiones);
      conexiones.push(`${raiz} -> ${izq}`);
      conexiones.push(`${raiz} -> ${der}`);
      return raiz;
    }

    default:
      return nuevoNodo(`???: ${nodo.tipo}`, nodos);
  }
}

module.exports = generarAST;
