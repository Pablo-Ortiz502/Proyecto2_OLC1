class Entorno {
  constructor() {
    this.variables = new Map();
    this.errores = [];
    this.salida = "";
  }

  declarar(id, tipo, valor) {
    if (this.variables.has(id)) {
      this.errores.push({ tipo: "Semántico", descripcion: `Variable ${id} ya declarada` });
      return;
    }
    this.variables.set(id, { tipo, valor });
  }

  asignar(id, valor) {
    if (!this.variables.has(id)) {
      this.errores.push({ tipo: "Semántico", descripcion: `Variable ${id} no declarada` });
      return;
    }
    
    if (typeof this.variables.get(id).valor != typeof valor){
      this.errores.push({ tipo: "Semántico", descripcion: `Variable [ ${id}  ]   no se puede asignar Tipo diferente` });
      return null;
    }



    this.variables.get(id).valor = valor;
  }

  obtener(id) {
    if (!this.variables.has(id)) {
      this.errores.push({ tipo: "Semántico", descripcion: `Variable ${id} no declarada` });
      return null;
    }
    return this.variables.get(id).valor;
  }
}

module.exports = Entorno; 