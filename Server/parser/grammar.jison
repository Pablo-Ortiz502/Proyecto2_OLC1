%lex
%%

[ \t\r]+                     
"/\\*"[^]*?"\\*/" 
"//".* 
\n                            return 'NEWLINE';
"ingresar"                    return 'INGRESAR';
"como"                        return 'COMO';
"con valor"                   return 'CONVALOR';
"Entero"                      return 'TIPO_ENTERO';
"Cadena"                      return 'TIPO_CADENA';
"Booleano"                    return 'TIPO_BOOL';  
"Verdadero"                   return 'TRUE';
"Falso"                       return 'FALSE';
"imprimir ln"                 return 'IMPRIMIRLN';    
"imprimir"                    return 'IMPRIMIR';
"Decimal"                     return 'TIPO_DECIMAL';
"Caracter"                    return 'TIPO_CHAR';
"si"                          return 'IF';
"de lo contrario"             return 'ELSE';   
([0-9]+\.[0-9]*|\.[0-9]+)     return 'DECIMAL';
[0-9]+                        return 'NUMERO';
\"[^"]*\"                     return 'CADENA';
\'([^\\']|\\.)\'              return 'CHAR';
[a-zA-Z_][a-zA-Z0-9_]*        return 'ID';
"||"                          return 'OR';
"&&"                          return 'AND';
"!="                          return '!=';
"!"                           return 'NOT';        
">="                          return '>=';  
">"                           return '>';
"<="                          return '<=';  
"<"                           return '<';
"%"                           return '%';
"++"                          return 'INC';  
"+"                           return '+';
"--"                          return 'DEC';  
"-"                           return '-';
"=="                          return '=='; 
"="                           return 'ASIG';
"*"                           return '*';
"/"                           return '/';
"^"                           return '^';
"%"                           return '%';  
";"                           return ';';
"("                           return '(';
")"                           return ')';
"{"                           return '{';
"}"                           return '}';
"\n"                          return      
<<EOF>>                       return 'EOF';

. {
    console.error(`Carácter no reconocido: '${yytext}'`);
    return 'INVALIDO'; 
}

/lex

%left '<' '>'
%left '==' '!='
%left '+' '-'
%left '*' '/'
%left '^' '%'

%start programa
%token INGRESAR COMO CONVALOR TIPO_ENTERO TIPO_CADENA TIPO_CHAR TIPO_BOOL TIPO_DECIMAL  IMPRIMIR ID NUMERO CADENA CHAR DECIMAL NEWLINE TRUE FALSE ASIG IF ELSE NEWLINE

%locations
%error-verbose

%%

programa
    : sentencias EOF
        { return $1; }
    ;




sentencias
    : sentencias sentencia
        { 
          if ($2 !== null) {
            $$ = $1.concat([$2]); 
          } else {
            $$ = $1;
          }
        }
    | /* empty */
        { $$ = []; }
    ;

    
sentencia
    : instruccion separador
        { $$ = $1; }
    | separador
        { $$ = null; }
    ;
   

separador
    :  NEWLINE
    ;


instruccion
    : TIPO_ENTERO ID ';'
        { $$ = { tipo: 'DECLARACION2', id: $2, tipoDato: 'Entero', valor: 0 }; } 
    | TIPO_ENTERO ID CONVALOR expresion ';'
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Entero', valor: $4 }; }
    | TIPO_ENTERO ID ASIG expresion  ';'
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Entero', valor: $4 }; }

    | TIPO_DECIMAL ID ';'
        { $$ = { tipo: 'DECLARACION2', id: $2, tipoDato: 'Decimal', valor: 0.0 }; } 
    | TIPO_DECIMAL ID CONVALOR expresion ';'
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Decimal', valor: $4 }; }
    | TIPO_DECIMAL ID ASIG expresion ';' 
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Decimal', valor: $4 }; }        

    | TIPO_CADENA ID ';'
        { $$ = { tipo: 'DECLARACION2', id: $2, tipoDato: 'Cadena', valor: ""}; }
    | TIPO_CADENA ID CONVALOR expresion ';'
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Cadena', valor: $4}; }
    | TIPO_CADENA ID ASIG expresion ';'
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Cadena', valor: $4}; }

    | TIPO_CHAR ID ';'
        { $$ = { tipo: 'DECLARACION2', id: $2, tipoDato: 'Caracter', valor: ''}; }
    | TIPO_CHAR ID CONVALOR expresion ';'
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Caracter', valor: $4}; }
    | TIPO_CHAR ID ASIG expresion ';'
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Caracter', valor: $4 }; }


    | TIPO_BOOL ID ';'
        { $$ = { tipo: 'DECLARACION2', id: $2, tipoDato: 'Booleano', valor: true }; }
    | TIPO_BOOL ID CONVALOR expresion ';'
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Booleano', valor: $4 }; }
    | TIPO_BOOL ID ASIG expresion ';'
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Booleano', valor: $4 }; }

    | ID ASIG expresion ';'
        { $$ = { tipo: 'ASIGNACION', id: $1, valor: $3 }; }
    | IMPRIMIRLN expresion ';'
        { $$ = { tipo: 'IMPRIMIRLN', valor: $2 }; }            
    | IMPRIMIR expresion ';'
        { $$ = { tipo: 'IMPRIMIR', valor: $2 }; }


    | IF '(' expresionBol ')' '{' sentencias '}'
    {
        $$ = {
            tipo: 'IF',
            condicion: $3,
            cuerpo: $6
        };
    }

| IF '(' expresionBol ')' '{' sentencias '}' ELSE '{' sentencias '}'
    {
        $$ = {
            tipo: 'IF_ELSE',
            condicion: $3,
            cuerpoVerdadero: $6,
            cuerpoFalso: $10
        };
    }

    ;    

expresion
    : expresion '+' expresion 
        { $$ = { tipo: 'SUMA', izquierda: $1, derecha: $3 }; }
    | expresion '-' expresion 
        { $$ = { tipo: 'RESTA', izquierda: $1, derecha: $3 }; }
    | expresion '*' expresion 
        { $$ = { tipo: 'MULTIPLICACION', izquierda: $1, derecha: $3 }; }
    | expresion '/' expresion 
        { $$ = { tipo: 'DIVISION', izquierda: $1, derecha: $3 }; }
    | expresion '^' expresion 
        { $$ = { tipo: 'POTENCIA', izquierda: $1, derecha: $3 }; }
    | expresion '%' expresion 
        { $$ = { tipo: 'MODULO', izquierda: $1, derecha: $3 }; }                
    | expresionBol 
        { $$ = $1;}    
    | variable 
        { $$ = $1;}
    ;





expresionBol
    : expresion '>' expresion 
        { $$ = { tipo: 'MAYORQUE', izquierda: $1, derecha: $3 }; }
    | expresion '<' expresion 
        { $$ = { tipo: 'MENORQUE', izquierda: $1, derecha: $3 }; }
    | expresion '==' expresion 
        { $$ = { tipo: 'IGUAL', izquierda: $1, derecha: $3 }; }
    | expresion '!=' expresion 
        { $$ = { tipo: 'NOIGUAL', izquierda: $1, derecha: $3 }; }
    | booleano
        { $$ = $1;}       
    ;

variable
    : NUMERO
        { $$ = { tipo: 'NUMERO', valor: Number($1) }; }
    | ID
        { $$ = { tipo: 'ID', nombre: $1 }; }
    | CADENA
        { $$ = { tipo: 'CADENA', valor: $1.slice(1, -1) }; }
    | DECIMAL
        { $$ = { tipo: 'DECIMAL', valor: Number($1) }; }
    | CHAR
        { $$ = { tipo: 'CHAR', valor: $1.slice(1, -1) }; }      
    ;    

booleano
    : TRUE
        { $$ = { tipo: 'BOOL', valor: true }; }
    | FALSE
        { $$ = { tipo: 'BOOL', valor: false }; }
    ;
