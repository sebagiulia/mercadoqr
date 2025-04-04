# mercadoQR (en desarrollo)
[link](https://mercadoqr.onrender.com)
## Descripción
Este proyecto es un mercado online diseñado para negocios que ofrecen sus servicios de forma presencial y necesitan una herramienta para vender y gestionar los pedidos, reservas y turnos.

Los negocios pueden publicar su catálogo de productos y servicios en la aplicación, permitiendo a los clientes comprarlos en línea. Al completar la compra, el cliente recibe un código QR que deberá presentar en el local físico para su validación y retiro.

## Estructuración
El desarrollo del proyecto se divide en cinco componentes: la interfaz web para clientes, el servidor backend que gestiona las solicitudes juntos con sus bases de datos, un servidor que gestiona las transacciones y verifica el pago del cliente, un panel de administración para los negocios y sus catálogos, y una aplicación para escanear y validar los códigos QR.

### Interfaz Web
La interfaz web fue desarrollada con Next.js y TypeScript, aprovechando su capacidad de renderizado híbrido y tipado estático para mayor seguridad y eficiencia.
### Servidor Backend
El servidor fue implementado con Node.js y Express, siguiendo una arquitectura en capas tipo MVC con el patrón de inversión de dependencias para mejorar la modularidad y el mantenimiento del código.
### Gestión de Pagos
Se integró la API de Mercado Pago utilizando el Modelo de Checkout Pro, permitiendo una experiencia de pago segura y eficiente desde el backend.
### Panel de Administración
No implementado
### Aplicación de Escaneo
No implementado
