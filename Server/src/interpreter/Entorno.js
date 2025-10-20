class Entorno {
  constructor(nombre = "Global", padre = null) {
    this.nombre = nombre;       
    this.padre = padre;        
    this.variables = new Map(); 
    this.errores = [];
    this.salida = "";
    this.hijos = [];           
  }

  crearSubEntorno(nombre) {
    const sub = new Entorno(nombre, this);
    this.hijos.push(sub);
    return sub;
  }

  declarar(id, tipo, valor) {
    if (valor && tipo && id) this.variables.set(id, { tipo, valor, entorno: this.nombre });
  }

  declararPr(id, tipo, valor,cuerpo,entorno) {
    if (valor && tipo && id) this.variables.set(id, { tipo, valor, entorno: this.nombre, cuerpo: cuerpo});
  }


    

  obtener(id) {
    if (this.variables.has(id)) return this.variables.get(id).valor;
    if (this.padre) return this.padre.obtener(id);
    return null;
  }

  obtenerCuer(id) {
    if (this.variables.has(id)) return this.variables.get(id).cuerpo;
    if (this.padre) return this.padre.obtener(id);
    return null;
  }

  getHijo(nombre) {
  return this.hijos.find(hijo => hijo.nombre === nombre);
  }

  asignar(id, valor) {
    if (this.variables.has(id)) {
        if (typeof this.variables.get(id).valor != typeof valor){
          this.errores.push({ tipo: "Semántico", descripcion: `Variable [ ${id}  ]   no se puede asignar Tipo diferente` });
          return;
        }
        this.variables.get(id).valor = valor;
    }
    else if (this.padre){
      this.padre.asignar(id,valor);
    }
    else  this.errores.push({ tipo: "Semántico", descripcion: `Variable ${id} no declarada` }); 
  }

}

module.exports = Entorno; 