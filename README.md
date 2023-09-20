# The To-Do List App with AWS 

## Steps to follow for the creation of this app: 

### Funciones Lambda:

createTask: Esta función se encargará de agregar una nueva tarea a la base de datos DynamoDB.
getTasks: Esta función recuperará todas las tareas o filtrará las tareas según ciertos criterios (por ejemplo, tareas completadas, tareas pendientes).
getTaskById: Esta función recuperará una tarea específica por su ID.
updateTask: Esta función modificará una tarea existente, como marcarla como completada o cambiar su prioridad.
deleteTask: Esta función eliminará una tarea específica por su ID.

### Base de datos DynamoDB:
Tabla de Tareas (TasksTable):
Partition Key: taskId (string) - Un identificador único para cada tarea.
Attributes:
taskName (string) - El nombre o descripción de la tarea.
status (string) - El estado de la tarea (por ejemplo, "completada", "pendiente").
dueDate (string) - La fecha de vencimiento de la tarea.
priority (string) - La prioridad de la tarea (por ejemplo, "alta", "media", "baja").
reminder (string) - Una fecha y hora para enviar un recordatorio sobre la tarea.
Otros atributos según las necesidades de tu aplicación.

### Orden de implementación sugerido:

Configuración de DynamoDB:
Crea la tabla de DynamoDB programáticamente usando el SDK de AWS.
Define los atributos y las claves de la tabla.
Funciones Lambda:

Comienza con la función createTask para poder agregar tareas a tu base de datos.
Continúa con getTasks y getTaskById para poder leer las tareas.
Luego, implementa updateTask para modificar tareas.
Finalmente, implementa deleteTask para eliminar tareas.
API Gateway:

Una vez que tengas tus funciones Lambda listas, puedes configurar API Gateway para exponer estas funciones como endpoints HTTP.
Crea rutas para cada función (por ejemplo, POST para crear, GET para leer, PUT para actualizar, DELETE para eliminar).
Integración:

Integra tus funciones Lambda con API Gateway.
Configura los permisos necesarios para que API Gateway pueda invocar tus funciones Lambda.
Pruebas:

Realiza pruebas para asegurarte de que cada endpoint funcione correctamente y de que las tareas se almacenen, recuperen, modifiquen y eliminen correctamente en/from DynamoDB.