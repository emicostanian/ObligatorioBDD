Cambios en el Modelo de Base de Datos

Este readme resume las modificaciones realizadas al modelo original del sistema de votación digital, justificando cada cambio en función de las necesidades del sistema, la normalización y la funcionalidad final implementada.

1. Reestructuración General del Modelo
Se introdujo la tabla OPCION como entidad abstracta que agrupa tanto LISTA como PAPELETA, permitiendo un tratamiento uniforme de los distintos tipos de voto.

Se eliminó la tabla VOTO_USA_PAPELETA, ya que ahora los votos referencian directamente a OPCION.

Se creó la tabla REGISTRO_DE_VOTACION para registrar que un votante ya emitió su voto, sin romper el secreto del mismo.

Se agregaron los campos contexto y tipo para poder distinguir entre distintas instancias electorales simultáneas.

Se agregó la tabla ADMIN para permitir autenticación de usuarios administradores.

2. PAPELETA
Antes: PAPELETA(id_papeleta, tipo, color, id_lista)

Ahora: PAPELETA(id_opcion, tipo, color, contexto)

Cambios:
id_papeleta se reemplazó por id_opcion, convirtiendo a PAPELETA en una especialización de OPCION.

Se eliminó el campo id_lista como clave foránea, porque las papeletas ya no dependen de una lista.

Justificación del campo contexto:
El campo contexto permite distinguir entre diferentes tipos de instancia electoral dentro de una misma elección. Los valores posibles son:

'n/a' → Opción común (como una lista partidaria)

'plebiscito' → Voto correspondiente a una reforma constitucional

'referendum' → Voto correspondiente a la derogación o aprobación de una ley

Esto permite que:

Un votante pueda emitir hasta tres votos distintos en una misma elección (uno por lista, uno por plebiscito, uno por referéndum).

La interfaz del frontend muestre cada instancia de forma separada y clara.

Se mantenga una única tabla de votos, simplificando la gestión.

3. OPCION
Nueva tabla: OPCION(id_opcion, tipo, descripcion, contexto)

¿Para qué sirve?
Permite representar de forma unificada a todas las opciones posibles de votación: listas partidarias y papeletas.

Ventajas:
Evita redundancia entre tablas LISTA y PAPELETA

Permite una estructura de voto más simple

Facilita registrar votos desde el backend y filtrar resultados

4. VOTO
Antes: VOTO(id_voto, es_observado, fecha, hora, tipo, ci_votante, id_papeleta)

Ahora: VOTO(id_voto, tipo, es_observado, id_opcion, fecha, hora, circuito_emision, contexto)

Cambios:
Se eliminó ci_votante para proteger el secreto del voto.

Se agregó circuito_emision para permitir verificar si el voto fue emitido fuera del circuito asignado (voto observado).

id_opcion referencia a OPCION en lugar de PAPELETA.

¿Por qué se elimina ci_votante?
Para asegurar que no exista ninguna forma de relacionar al votante con su voto, cumpliendo el principio de voto secreto. Para saber si una persona ya votó, se usa una tabla aparte (REGISTRO_DE_VOTACION).

5. REGISTRO_DE_VOTACION
Nueva tabla: REGISTRO_DE_VOTACION(ci, fecha)

¿Por qué se agregó?
Para registrar que un votante ya emitió su voto, sin comprometer el secreto del mismo. Se almacena el número de cédula y la fecha, sin asociar directamente al voto registrado.

6. LISTA
Antes: LISTA(id_lista, numero, órgano, orden, id_departamento, nombre_partido)

Ahora: LISTA(id_opcion, nombre_lista, numero, órgano, orden, departamento, nombre_partido, ci_candidato, candidato_presidente, candidato_vicepresidente)

Cambios:
id_lista se unificó con id_opcion, y la tabla ahora hereda desde OPCION.

Se agregó un campo ci_candidato con FK a CANDIDATO, para facilitar la vinculación entre lista y su principal candidato.

Se agregaron los campos candidato_presidente y candidato_vicepresidente como texto.

Justificación:
Los cambios reflejan la decisión de permitir que las listas puedan tener diferentes combinaciones de candidatos sin repetir registros innecesarios.

Aunque se mantiene la tabla ES_PRESIDENTE/ES_VICEPRESIDENTE, los nombres visibles se almacenan también en LISTA por razones prácticas (mostrar en frontend).

7. CANDIDATO_LISTA
Nueva tabla de relación: CANDIDATO_LISTA(id_candidato, id_opcion)

¿Por qué se agregó?
Para permitir la existencia de múltiples candidatos asociados a una lista, y que un candidato pueda participar en más de una lista, en caso de que se repita para distintos órganos o contextos.

8. ADMIN
Nueva tabla: ADMIN(id_admin, usuario, contrasena)

¿Para qué?
Permite autenticar usuarios con rol de administración dentro del sistema web. Se garantiza que los usuarios sean únicos y que la contraseña esté almacenada con hash (backend).

9. Eliminaciones y simplificaciones
Se eliminó VOTO_USA_PAPELETA: ahora VOTO referencia directamente a OPCION.

Se eliminaron los campos id_lista y id_papeleta individuales y se unificaron en la tabla OPCION.

Se evitó duplicar lógica de voto para diferentes tipos, al centralizar en OPCION.
