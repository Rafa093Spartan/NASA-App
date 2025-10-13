# Computación en la Nube y Sistemas Distribuidos

## ¿Qué es la computación en la nube y cómo se relaciona con los sistemas distribuidos?
La computación en la nube (Cloud Computing) es un modelo que permite el acceso bajo demanda a través de la red a un conjunto compartido de recursos informáticos configurables, como redes, servidores, almacenamiento, aplicaciones y servicios. Estos recursos pueden ser rápidamente aprovisionados y liberados con un mínimo esfuerzo de gestión o interacción con el proveedor del servicio. ☁️

---
La relación con los sistemas distribuidos es intrínseca y fundamental. La nube es, en esencia, una evolución a gran escala de los sistemas distribuidos. Un sistema distribuido es un conjunto de computadoras autónomas que se comunican entre sí a través de una red y que colaboran para realizar una tarea, presentándose ante el usuario como un único sistema coherente. La infraestructura de la nube se basa en este principio, utilizando miles de servidores interconectados en centros de datos distribuidos globalmente. La virtualización permite abstraer y agrupar estos recursos físicos (CPU, RAM, almacenamiento) para ofrecerlos como servicios elásticos y escalables, ocultando la complejidad subyacente al usuario final.

---
## Modelos de Servicio Fundamentales
Los servicios en la nube se clasifican generalmente en tres modelos principales, que se pueden visualizar como niveles de una pirámide de gestión, donde cada capa superior abstrae más la complejidad de la inferior.

--- 
### IaaS (Infraestructura como Servicio): 
Es el modelo más básico. Proporciona los bloques de construcción fundamentales de la computación: recursos de red, almacenamiento y servidores virtualizados (máquinas virtuales). Ofrece el mayor nivel de flexibilidad y control sobre los recursos de TI, siendo análogo a alquilar el hardware de un centro de datos sin tener que comprarlo ni gestionarlo físicamente. El usuario es responsable de administrar el sistema operativo, el middleware y las aplicaciones.

Ejemplos: Amazon Web Services (AWS) EC2, Google Compute Engine (GCE), Microsoft Azure Virtual Machines.

---
### PaaS (Plataforma como Servicio): 
Este modelo elimina la necesidad de que las organizaciones administren la infraestructura subyacente (hardware y sistemas operativos) y les permite centrarse en el desarrollo, despliegue y gestión de aplicaciones. Proporciona un entorno o plataforma con herramientas de software, bases de datos y sistemas operativos listos para usar. Es ideal para desarrolladores, ya que agiliza el ciclo de vida del software.

Ejemplos: Heroku, Google App Engine, AWS Elastic Beanstalk.

---
### SaaS (Software como Servicio):
Es el modelo más completo y conocido. Ofrece un producto de software terminado que es gestionado íntegramente por el proveedor. Los usuarios acceden a la aplicación a través de un navegador web o una API, generalmente bajo un modelo de suscripción. No tienen que preocuparse por la instalación, el mantenimiento o la infraestructura subyacente.

Ejemplos: Google Workspace, Salesforce, Dropbox, Microsoft 365.

---
## Modelos de Despliegue
Nube Pública: La infraestructura es propiedad de un proveedor externo (como AWS, Google Cloud o Azure) que la pone a disposición del público general a través de internet. Es el modelo más común y ofrece enormes economías de escala, escalabilidad casi ilimitada y un modelo de pago por uso.

### Nube Privada: 
La infraestructura de la nube es utilizada exclusivamente por una única organización. Puede estar ubicada en el centro de datos local de la empresa (on-premise) o ser alojada por un proveedor externo. Ofrece mayor control, seguridad y privacidad, pero a un costo mayor y con menos escalabilidad.

---
### Nube Híbrida: 
Combina una nube privada con una o más nubes públicas. Permite a las organizaciones mantener sus aplicaciones y datos críticos en la nube privada por seguridad, mientras aprovechan los recursos de la nube pública para cargas de trabajo menos sensibles, picos de demanda (cloud bursting) o recuperación ante desastres.

Ejemplo Práctico: Netflix y AWS 🎬
Netflix es el caso de estudio por excelencia del uso masivo y exitoso de la nube. Migró toda su infraestructura de centros de datos privados a Amazon Web Services (AWS) para lograr escalabilidad global y resiliencia.

---
### Computación y Transcodificación (IaaS):
Netflix utiliza miles de instancias de Amazon EC2 para transcodificar sus archivos de video maestros a cientos de formatos y resoluciones diferentes, optimizados para cada dispositivo y velocidad de conexión. Este proceso masivamente paralelo es perfecto para la elasticidad de la nube.

---
### Almacenamiento (IaaS): 
Almacena petabytes de contenido de video en Amazon S3, un servicio de almacenamiento de objetos altamente duradero y escalable.

---
### Bases de Datos (PaaS): 
Gestiona toda la información de sus más de 200 millones de suscriptores, historiales de visualización y recomendaciones personalizadas utilizando bases de datos gestionadas por AWS como DynamoDB y Aurora.

---
### Escalabilidad Global: 
La infraestructura global de AWS permite a Netflix desplegar su servicio cerca de sus usuarios en todo el mundo, reduciendo la latencia. Cuando se estrena una serie popular, la plataforma escala automáticamente para soportar millones de solicitudes simultáneas y vuelve a reducir su tamaño cuando la demanda baja, optimizando costos.

---
## Ventajas de la Nube vs. On-Premise
La adopción de la nube ofrece ventajas significativas sobre las arquitecturas tradicionales donde la empresa posee y gestiona su propia infraestructura (on-premise):

Sustitución de Gasto de Capital por Gasto Variable: En lugar de una gran inversión inicial en hardware (CapEx), se paga una tarifa mensual o por uso (OpEx), mejorando el flujo de caja.

Elasticidad y Escalabilidad: Los recursos se pueden aumentar o disminuir en minutos para adaptarse a la demanda del negocio, algo que en un modelo on-premise llevaría semanas o meses.

Economías de Escala Masivas: Los proveedores de la nube compran hardware a gran escala, lo que reduce los costos y traslada esos ahorros a los clientes.

Agilidad y Velocidad: Se pueden aprovisionar nuevos servicios y entornos de desarrollo casi instantáneamente, lo que permite a las empresas innovar y lanzar productos mucho más rápido.

Alcance Global: Permite desplegar aplicaciones en múltiples regiones geográficas con solo unos clics, proporcionando una mejor experiencia a los usuarios finales en todo el mundo.

Enfoque en el Negocio: Al delegar la gestión de la infraestructura al proveedor de la nube, los equipos de TI pueden centrarse en proyectos que aportan valor directo al negocio en lugar de en el mantenimiento de servidores.

## Bibliografía
Amazon Web Services. (2025). ¿Qué es la computación en la nube? Recuperado de https://aws.amazon.com/what-is-cloud-computing/

Microsoft Azure. (2025). What are public, private, and hybrid clouds? Recuperado de https://azure.microsoft.com/en-us/resources/cloud-computing-dictionary/what-are-private-public-hybrid-clouds

Netflix Technology Blog. (2025). Netflix on AWS. Recuperado de https://netflixtechblog.com/

Mell, P., & Grance, T. (2011). The NIST Definition of Cloud Computing (SP 800-145). National Institute of Standards and Technology. Recuperado de https://csrc.nist.gov/publications/detail/sp/800-145/final
