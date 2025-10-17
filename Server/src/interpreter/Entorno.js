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
    this.variables.set(id, { tipo, valor, entorno: this.nombre });
  }

  obtener(id) {
    if (this.variables.has(id)) return this.variables.get(id).valor;
    if (this.padre) return this.padre.obtener(id);
    return null;
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