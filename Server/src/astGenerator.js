
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
      const raiz = nuevoNodo("SI", nodos);
      const condNode = procesarNodo(nodo.condicion, nodos, conexiones);
      const jNode = nuevoNodo("CONDICION",nodos);
      const aNode = nuevoNodo("ACCIONES",nodos);         
             
      for(const n of nodo.cuerpoVerdadero){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${aNode} -> ${valNode}`);
      }
      const sNode = "DE_LO_CONTRARIO";
      conexiones.push(`${raiz} -> ${sNode}`)      

      for(const n of nodo.cuerpoFalso){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${sNode} -> ${valNode}`);
      }
      conexiones.push(`${raiz} -> ${jNode}`);
      conexiones.push(`${raiz} -> ${aNode}`);
      conexiones.push(`${jNode} -> ${condNode}`)  
      return raiz;

    }

    case "IF_ELSE2":{
      const raiz = nuevoNodo("SI", nodos);
      const condNode = nuevoNodo(`ID: ${nodo.condicion}`, nodos);
      const jNode = nuevoNodo("CONDICION",nodos);
      const aNode = nuevoNodo("ACCIONES",nodos);             
      for(const n of nodo.cuerpoVerdadero){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${aNode} -> ${valNode}`);
      }
      const sNode = "DE_LO_CONTRARIO";
      conexiones.push(`${raiz} -> ${sNode}`)      

      for(const n of nodo.cuerpoFalso){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${sNode} -> ${valNode}`);
      }
      conexiones.push(`${raiz} -> ${jNode}`);
      conexiones.push(`${raiz} -> ${aNode}`);
      conexiones.push(`${jNode} -> ${condNode}`)  
      return raiz;

    }   

    case "IF2":{
      const raiz = nuevoNodo("SI", nodos);
      const jNode = nuevoNodo("CONDICION",nodos);
      const aNode = nuevoNodo("ACCIONES",nodos); 
      const condNode =  nuevoNodo(`ID: ${nodo.condicion}`, nodos);
      conexiones.push(`${raiz} -> ${jNode}`);
      conexiones.push(`${raiz} -> ${aNode}`);
      conexiones.push(`${jNode} -> ${condNode}`)      
      for(const n of nodo.cuerpo){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${aNode} -> ${valNode}`);
      }
      return raiz;
    }

    case "DOWHILE2":{
      const raiz = nuevoNodo("HACER", nodos);
      const jNode = nuevoNodo("HASTA_QUE",nodos);
      const aNode = nuevoNodo("ACCIONES",nodos); 
      const condNode =  nuevoNodo(`ID: ${nodo.condicion}`, nodos);
      conexiones.push(`${raiz} -> ${jNode}`);
      conexiones.push(`${raiz} -> ${aNode}`);
      conexiones.push(`${jNode} -> ${condNode}`)      
      for(const n of nodo.cuerpo){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${aNode} -> ${valNode}`);
      }
      return raiz;
    } 

    case "WHILE2":{
      const raiz = nuevoNodo("MIENTRAS", nodos);
      const jNode = nuevoNodo("CONDICION",nodos);
      const aNode = nuevoNodo("ACCIONES",nodos); 
      const condNode =  nuevoNodo(`ID: ${nodo.condicion}`, nodos);
      conexiones.push(`${raiz} -> ${jNode}`);
      conexiones.push(`${raiz} -> ${aNode}`);
      conexiones.push(`${jNode} -> ${condNode}`)      
      for(const n of nodo.cuerpo){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${aNode} -> ${valNode}`);
      }
      return raiz;
    }    
    case "DOWHILE":{
      const raiz = nuevoNodo("HACER", nodos);
      const jNode = nuevoNodo("HASTA_QUE",nodos);
      const aNode = nuevoNodo("ACCIONES",nodos);            
      const condNode = procesarNodo(nodo.condicion, nodos, conexiones);
      for(const n of nodo.cuerpo){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${aNode} -> ${valNode}`);
      }
      conexiones.push(`${raiz} -> ${jNode}`);
      conexiones.push(`${raiz} -> ${aNode}`);
      conexiones.push(`${jNode} -> ${condNode}`) 
      return raiz;
    }
    case "WHILE":{
      const raiz = nuevoNodo("MIENTRAS", nodos);
      const jNode = nuevoNodo("CONDICION",nodos);
      const aNode = nuevoNodo("ACCIONES",nodos);            
      const condNode = procesarNodo(nodo.condicion, nodos, conexiones);
      for(const n of nodo.cuerpo){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${aNode} -> ${valNode}`);
      }
      conexiones.push(`${raiz} -> ${jNode}`);
      conexiones.push(`${raiz} -> ${aNode}`);
      conexiones.push(`${jNode} -> ${condNode}`) 
      return raiz;
    }

    case "IF":{
      const raiz = nuevoNodo("SI", nodos);
      const jNode = nuevoNodo("CONDICION",nodos);
      const aNode = nuevoNodo("ACCIONES",nodos);             
      const condNode = procesarNodo(nodo.condicion, nodos, conexiones);
      for(const n of nodo.cuerpo){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${aNode} -> ${valNode}`);
      }
      conexiones.push(`${raiz} -> ${jNode}`);
      conexiones.push(`${raiz} -> ${aNode}`);
      conexiones.push(`${jNode} -> ${condNode}`) 
      return raiz;
    }
    
    case"FOR2":
    case"FOR1":{
      const raiz = nuevoNodo("PARA",nodos);
      const cond = "CONDICION";
      const ac = "ACTUALIZACION";
      let dNode = null;
      if (nodo.declaracion != null) dNode = procesarNodo(nodo.declaracion,nodos,conexiones);
      else dNode = procesarNodo(nodo.asignacion,nodos,conexiones);
      const cNode = procesarNodo(nodo.condicion,nodos,conexiones)
      const aNode = procesarNodo(nodo.act,nodos,conexiones);
      const kNode = "ACCIONES";

      conexiones.push(`${raiz} -> ${cond}`);
      conexiones.push(`${cond} -> ${cNode}`);
      conexiones.push(`${raiz} -> ${dNode}`);
      conexiones.push(`${raiz} -> ${ac}`);      
      conexiones.push(`${ac} -> ${aNode}`);
      conexiones.push(`${raiz} -> ${kNode}`);

      for(const n of nodo.cuerpo){
        const valNode = procesarNodo(n,nodos,conexiones);
        conexiones.push(`${kNode} -> ${valNode}`);
      }
      return raiz;
    }

    case "DEC":
    case"INC":
    case"NOT":{
      const raiz = nuevoNodo(nodo.tipo, nodos);
      const der = nuevoNodo(`ID: ${nodo.nombre}`, nodos);;
      conexiones.push(`${raiz} -> ${der}`);
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
    
    case "CASTEO":{
      const raiz = nuevoNodo("CASTEO", nodos);
      const nNode = nuevoNodo(nodo.cast,nodos);
      const dNode = procesarNodo(nodo.derecha,nodos,conexiones);
      conexiones.push(`${raiz} -> ${nNode}`);
      conexiones.push(`${raiz} -> ${dNode}`);
      return raiz;      
    }
    case "TOUPPER":
    case "TOLOWER":
      let raiz = null;
      if(nodo.tipo=="TOLOWER"){raiz = nuevoNodo("TOLOWER", nodos);}
      else{raiz = nuevoNodo("TOUPPER",nodos);}
      const nNode = procesarNodo(nodo.derecha,nodos,conexiones);
      conexiones.push(`${raiz} -> ${nNode}`);
      return raiz;

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
      

    case "AND":
    case "OR":
    case "MAYORIGUAL":
    case "MENORIGUAL":        
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
