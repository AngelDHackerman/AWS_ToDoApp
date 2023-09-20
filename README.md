# The To-Do List App with AWS 

## Steps to follow for the creation of this app: 

### Funciones Lambda:

1. __createTask:__ Esta función se encargará de agregar una nueva tarea a la base de datos DynamoDB.

2. __getTasks:__ Esta función recuperará todas las tareas o filtrará las tareas según ciertos criterios (por ejemplo, tareas completadas, tareas pendientes).

3. __getTaskById:__ Esta función recuperará una tarea específica por su ID.

4. __updateTask:__ Esta función modificará una tarea existente, como marcarla como completada o cambiar su prioridad.

5. __deleteTask:__ Esta función eliminará una tarea específica por su ID.


### Base de datos DynamoDB:

1. Tabla de Tareas (TasksTable):

* __Partition Key:__ `taskId` (string) - Un identificador único para cada tarea.

* __Attributes:__

* `taskName` (string) - El nombre o descripción de la tarea.
* `status` (string) - El estado de la tarea (por ejemplo, "completada", "pendiente").
* `dueDate` (string) - La fecha de vencimiento de la tarea.
* `priority` (string) - La prioridad de la tarea (por ejemplo, "alta", "media", "baja").
* `reminder` (string) - Una fecha y hora para enviar un recordatorio sobre la tarea.
* Otros atributos según las necesidades de tu aplicación.

### Orden de implementación sugerido:

1. __Configuración de DynamoDB:__

* Crea la tabla de DynamoDB programáticamente usando el SDK de AWS.

* Define los atributos y las claves de la tabla.

2. __Funciones Lambda:__

* Comienza con la función `createTask` para poder agregar tareas a tu base de datos.

* Continúa con `getTasks` y `getTaskById` para poder leer las tareas.

* Luego, implementa `updateTask` para modificar tareas.

* Finalmente, implementa `deleteTask` para eliminar tareas.

3. __API Gateway:__

* Una vez que tengas tus funciones Lambda listas, puedes configurar API Gateway para exponer estas funciones como endpoints HTTP.

* Crea rutas para cada función (por ejemplo, POST para crear, GET para leer, PUT para actualizar, DELETE para eliminar).

4. __Integración:__

* Integra tus funciones Lambda con API Gateway.

* Configura los permisos necesarios para que API Gateway pueda invocar tus funciones Lambda.

5. __Pruebas:__

* Realiza pruebas para asegurarte de que cada endpoint funcione correctamente y de que las tareas se almacenen, recuperen, modifiquen y eliminen correctamente en/from DynamoDB.