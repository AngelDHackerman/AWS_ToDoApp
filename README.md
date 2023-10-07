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

* __Sort Key:__ `timeStamp`

* __Attributes:__

* `taskName` (string) - El nombre o descripción de la tarea.
* `status` (string) - El estado de la tarea (por ejemplo, "completada", "pendiente").
* `dueDate` (string) - La fecha de vencimiento de la tarea.
* `priority` (string) - La prioridad de la tarea (por ejemplo, "alta", "media", "baja").
* `reminder` (string) - Una fecha y hora para enviar un recordatorio sobre la tarea.
* Otros atributos según las necesidades de tu aplicación.

### Para el frontEnd Tanto el Bucket S3 y cloudFront fueron creados manualmente por problemas con el Stack. 

* __Bucket S3:__ contendra el codigo del frontEnd.

* __cloud Front:__ sera usado por estos 4 motivos: 

1. __Rendimiento:__ Reduce la latencia al almacenar copias del contenido más cerca del usuario.

2. __Escalabilidad:__ Maneja eficientemente altos volúmenes de tráfico.

3. __Seguridad:__ Ofrece protecciones como HTTPS y WAF (Web Application Firewall).

4. __Costo:__ Puede reducir los costos de transferencia de datos y las solicitudes a tus servidores o buckets de S3.