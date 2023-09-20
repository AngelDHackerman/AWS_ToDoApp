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

* Implementa el patrón Singleton para la conexión a DynamoDB.

* Crea la tabla de DynamoDB programáticamente usando el SDK de AWS con la conexión Singleton.

* Define los atributos y las claves de la tabla.

2. __Funciones Lambda:__

* Implementa la inyección de dependencia para inyectar la conexión de DynamoDB en las funciones.

* Comienza con la función `createTask` para poder agregar tareas a tu base de datos.

* Continúa con `getTasks` y `getTaskById` para poder leer las tareas.

* Luego, implementa `updateTask` para modificar tareas.

* Finalmente, implementa `deleteTask` para eliminar tareas.

3. __API Gateway con Proxies:__

* Crea un único recurso proxy en API Gateway (por ejemplo, `{proxy+}`) que capturará todas las rutas y métodos.

* Integra este recurso proxy con una única función Lambda.

* Dentro de esta función Lambda, en función de la ruta y el método HTTP, invoca la función Lambda correspondiente (por ejemplo, `createTask`, `getTasks`, etc.).

4. __Integración:__

* Asegúrate de que tu función Lambda proxy tenga los permisos necesarios para invocar otras funciones Lambda.

* Configura los permisos para que API Gateway pueda invocar tu función Lambda proxy.

5. __Pruebas:__

* Realiza pruebas para asegurarte de que cada ruta y método funcione correctamente a través del proxy.