%lex
%%
[ \t\r]+                      /* skip horizontal whitespace */
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
"para"                        return 'FOR';
"mientras"                    return 'WHILE';
"hacer"                       return 'DO';
"hasta que"                   return 'DOWHILE';     
"de lo contrario"             return 'ELSE';
"tolower"                     return 'TOLOWER';
"toupper"                     return 'TOUPPER';
"procedimiento"                return 'PROCED';
"ejecutar"                    return 'EJECUTAR';  
([0-9]+\.[0-9]*|\.[0-9]+)     return 'DECIMAL';
[0-9]+                        return 'NUMERO';
\"[^"]*\"                     return 'CADENA';
\'([^\\']|\\.)\'              return 'CHAR';
[a-zA-Z_][a-zA-Z0-9_]*        return 'ID';
"||"                          return '||';
"&&"                          return '&&';
"!="                          return '!=';
"!"                           return '!';        
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
","                           return ',';  
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
<<EOF>>                       return 'EOF';

. {
    console.error(`Carácter no reconocido: '${yytext}'`);
    return 'INVALIDO'; 
}

/lex
%left '||'
%left  '&&'
%right '!' 
%left '==' '!=' '<=' '>=' '<' '>'
%left '+' '-'
%left '*' '/' '%' 
%right '^'
%right '('
%left  ')'

%start programa
%token INGRESAR COMO CONVALOR TIPO_ENTERO TIPO_CADENA TIPO_CHAR TIPO_BOOL TIPO_DECIMAL  IMPRIMIR ID NUMERO CADENA CHAR DECIMAL NEWLINE TRUE 
%token FALSE ASIG IF ELSE NEWLINE FOR WHILE DO DOWHILE TOLOWER TOUPPER PROCED, EJECUTAR
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
    : declaracion';'
    | asignaciones ';'
    | IMPRIMIRLN expresion ';'
        { $$ = { tipo: 'IMPRIMIRLN', valor: $2 }; }            
    | IMPRIMIR expresion ';'
        { $$ = { tipo: 'IMPRIMIR', valor: $2 }; }

    | incdec ';'

    | IF '(' expresionBol ')' '{' sentencias '}'
    {
        $$ = {
            tipo: 'IF',
            condicion: $3,
            cuerpo: $6
        };
    }
    | IF '(' ID ')' '{' sentencias '}'
    {
        $$ = {
            tipo: 'IF2',
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
    | IF '(' ID ')' '{' sentencias '}' ELSE '{' sentencias '}'
    {
        $$ = {
            tipo: 'IF_ELSE2',
            condicion: $3,
            cuerpoVerdadero: $6,
            cuerpoFalso: $10
        };
    }
    |FOR '(' decNum ';' expresionBol ';' incdec')' '{' sentencias '}'
    {
        $$ = {
            tipo: 'FOR1',
            declaracion: $3,
            condicion: $5,
            act: $7,
            cuerpo: $10
        };
    }

    |FOR '(' asignaciones ';' expresionBol ';' incdec ')' '{' sentencias '}'
    {
        $$ = {
            tipo: 'FOR2',
            asignacion: $3,
            condicion: $5,
            act: $7,
            cuerpo: $10
        };        
    }
    |WHILE '('expresionBol ')' '{' sentencias '}'
    {
        $$ = {
            tipo: 'WHILE',
            condicion: $3,
            cuerpo: $6
        };        
    }
    |WHILE '('ID')' '{' sentencias '}'
    {
        $$ = {
            tipo: 'WHILE2',
            condicion: $3,
            cuerpo: $6
        };        
    }
    |DO '{' sentencias '}' DOWHILE '(' expresionBol ')'
    {
        $$ = {
            tipo: 'DOWHILE',
            condicion: $7,
            cuerpo: $3
        };        
    }
    |DO '{' sentencias '}' DOWHILE '(' ID ')'
    {
        $$ = {
            tipo: 'DOWHILE2',
            condicion: $7,
            cuerpo: $3
        };        
    }
    |PROCED ID  '('')''{' sentencias '}'
    {
        $$ = {
            tipo: 'PROCED',
            id: $2,
            cuerpo: $6
        };        
    }
    | EJECUTAR ID '('')'';'
        { $$ = { tipo: 'EJECUTAR', nombre: $2}; }
    ;
    

incdec
    : ID INC 
         { $$ = { tipo: 'INC', nombre: $1}; }
    | ID DEC
         { $$ = { tipo: 'DEC', nombre: $1}; }
    ;

asignaciones
    :ID ASIG expresion 
        { $$ = { tipo: 'ASIGNACION', id: $1, valor: $3 }; }
    ;


declaracion
    :decNum
    | TIPO_DECIMAL ID 
        { $$ = { tipo: 'DECLARACION2', id: $2, tipoDato: 'Decimal', valor: 0.0 }; } 
    | TIPO_DECIMAL ID CONVALOR expresion 
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Decimal', valor: $4}; }
    | TIPO_DECIMAL ID ASIG expresion 
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Decimal', valor: $4 }; }        

    | TIPO_CADENA ID 
        { $$ = { tipo: 'DECLARACION2', id: $2, tipoDato: 'Cadena', valor: ""}; }
    | TIPO_CADENA ID CONVALOR expresion 
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Cadena', valor: $4}; }
    | TIPO_CADENA ID ASIG expresion 
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Cadena', valor: $4}; }

    | TIPO_CHAR ID 
        { $$ = { tipo: 'DECLARACION2', id: $2, tipoDato: 'Caracter', valor: ''}; }
    | TIPO_CHAR ID CONVALOR expresion 
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Caracter', valor: $4}; }
    | TIPO_CHAR ID ASIG expresion 
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Caracter', valor: $4 }; }


    | TIPO_BOOL ID 
        { $$ = { tipo: 'DECLARACION2', id: $2, tipoDato: 'Booleano', valor: true }; }
    | TIPO_BOOL ID CONVALOR expresion 
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Booleano', valor: $4}; }
    | TIPO_BOOL ID ASIG expresion 
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Booleano', valor: $4 }; }                
    ;

decNum
    :TIPO_ENTERO ID 
        { $$ = { tipo: 'DECLARACION2', id: $2, tipoDato: 'Entero', valor: 0 }; } 
    | TIPO_ENTERO ID CONVALOR expresion 
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Entero', valor: $4 };  }
    | TIPO_ENTERO ID ASIG expresion  
        { $$ = { tipo: 'DECLARACION', id: $2, tipoDato: 'Entero', valor: $4 }; }
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
    | '(' tipoDato ')' expresion
        { $$ = { tipo: 'CASTEO', derecha: $4, cast: $2}; }
    | TOLOWER '(' expresion ')'
        { $$ = { tipo: 'TOLOWER', derecha: $3}; }
    | TOUPPER '(' expresion ')'
        { $$ = { tipo: 'TOUPPER', derecha: $3}; }    
    | expresionBol 
        { $$ = $1;}    
    | variable 
        { $$ = $1;}
    | incdec    
    ;

tipoDato
:TIPO_BOOL
|TIPO_CADENA
|TIPO_CHAR
|TIPO_ENTERO
|TIPO_DECIMAL
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
    | expresion '>=' expresion 
        { $$ = { tipo: 'MAYORIGUAL', izquierda: $1, derecha: $3 }; }
    | expresion '<=' expresion 
        { $$ = { tipo: 'MENORIGUAL', izquierda: $1, derecha: $3 }; }
    | expresion '&&' expresion 
        { $$ = { tipo: 'AND', izquierda: $1, derecha: $3 }; }
    | expresion '||' expresion 
        { $$ = { tipo: 'OR', izquierda: $1, derecha: $3 }; }   
    | '!' ID
        { $$ = { tipo: 'NOT', nombre: $2 }; }   
                               
    | booleano
        { $$ = $1;}       
    ;

variable
    : NUMERO
        { $$ = { tipo: 'NUMERO', valor: Number($1) }; }
    | ID
        { $$ = { tipo: 'ID', nombre: $1}; }
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
