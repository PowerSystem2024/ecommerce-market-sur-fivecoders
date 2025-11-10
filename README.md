# ecommerce-market-sur
repositorio para subir proyecto final ecommerce

# Paso a paso para hacer funcionar la app

## Repositorio:
* Clonamos el repositorio
```sh 
git clone ENLACE_DE_TU_REPOSITORIO
``` 

* Abrimos el VSC
```sh 
code .
``` 

* Agregar un archivo `/.env` que contenga la conexion a la base de datos con el siguiente codigo:
```
PORT=3000
DB_PORT=NUMERO_DE_TU_PUERTO
DB_HOST='localhost'
DB_USER='TU_USUARIO_POSTGRE'
DB_PASSWORD='TU_PASSWORD_POSTGRE'
DB_NAME='marketsur_db'

MP_ACCESS_TOKEN= your_marketplace_access_token_here
MP_PUBLIC_KEY= your_marketplace_public_key_here
``` 

* Instalar dependencias e iniciar servidor:

1. En una terminal, entramos a la carpeta `/frontend` y en otra a `/server`.
```sh 
cd CARPETA
```

2. Instalamos la dependencias.
```sh 
npm i
``` 

3. E iniciamos el servidor.
```sh 
npm run dev
``` 

* Abrir el localhost:5173.
[http://localhost:5173/]


## Base de datos:
* En un **IDE** de PostgreSQL, crear una base de datos llamada `marketsur_db`.

* Crear las siguientes tablas dentro de la base de datos.

1. Tabla usuarios
```sql
-- Almacena la información de los usuarios (consumidores y proveedores).
CREATE TABLE usuarios (
    id SERIAL PRIMARY KEY, -- SERIAL para autoincremento en PostgreSQL
    nombre VARCHAR(100) NOT NULL,
    correo VARCHAR(100) UNIQUE NOT NULL, -- El correo debe ser único
    contrasenia VARCHAR(255) NOT NULL, -- Contraseña hasheada
    rol VARCHAR(100) NOT NULL DEFAULT 'consumidor', -- Rol del usuario (proveedor o consumidor)
    gravatar VARCHAR(255), 
    fecha_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_modificacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Restricción para asegurar que el rol solo pueda ser 'proveedor' o 'consumidor'
ALTER TABLE usuarios
ADD CONSTRAINT chk_rol CHECK (rol IN ('proveedor', 'consumidor'));
```

2. Tabla categorias
```sql
CREATE TABLE categorias (
    id SERIAL PRIMARY KEY, -- Identificador único para la categoría
    nombre VARCHAR(100) UNIQUE NOT NULL, -- Nombre de la categoría (debe ser único)
    descripcion TEXT -- Descripción opcional de la categoría
);
```

3. Tabla productos 
```sql 
CREATE TABLE productos (
    id SERIAL PRIMARY KEY, -- SERIAL para autoincremento
    usuario_id INT NOT NULL, -- Clave foránea al usuario que provee el producto
    categoria_id INT, -- Clave foránea a la tabla de categorías
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT, -- Añadido campo de descripción para productos
    precio DECIMAL(10,2) NOT NULL CHECK (precio >= 0), -- Precio del producto, no puede ser negativo
    img TEXT, -- Ruta o URL de la imagen del producto (ampliado a 255 por si es una URL larga)
    stock INT DEFAULT 0 CHECK (stock >= 0),
    fecha_carga TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    fecha_actualizacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE, -- Si se elimina un usuario, se eliminan sus productos
    FOREIGN KEY (categoria_id) REFERENCES categorias(id) ON DELETE SET NULL -- Si se elimina una categoría, los productos asociados tendrán su categoria_id en NULL
);
```

4. Tabla ordenes 
```sql
-- Representa una orden de compra realizada por un consumidor.
-- Representa una orden de compra realizada por un consumidor.
CREATE TABLE ordenes (
    id SERIAL PRIMARY KEY, -- SERIAL para autoincremento
    usuario_id INT NOT NULL, -- Clave foránea al usuario (consumidor) que realizó la orden
    fecha_orden TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    total DECIMAL(10,2) NOT NULL CHECK (total >= 0), -- El costo total de la orden
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE CASCADE -- Si se elimina un usuario, se eliminan sus órdenes
);
```

5. Tabla items_orden
```sql
-- Detalles de los productos dentro de cada orden (lo que el consumidor compró).
CREATE TABLE items_orden (
    id SERIAL PRIMARY KEY, -- SERIAL para autoincremento
    orden_id INT NOT NULL, -- Clave foránea a la orden a la que pertenece este item
    producto_id INT NOT NULL, -- Clave foránea al producto específico que se compró
    cantidad INT NOT NULL CHECK (cantidad > 0), -- Cantidad del producto comprado en esta orden (debe ser mayor a 0)
    precio_unitario DECIMAL(10,2) NOT NULL CHECK (precio_unitario >= 0), -- Precio al que se compró el producto en ese momento
    FOREIGN KEY (orden_id) REFERENCES ordenes(id) ON DELETE CASCADE, -- Si se elimina una orden, se eliminan sus items
    FOREIGN KEY (producto_id) REFERENCES productos(id) ON DELETE RESTRICT -- Si se intenta eliminar un producto que está en una orden, la eliminación será restringida
    -- NOTA: Se usó ON DELETE RESTRICT aquí para items_orden/productos.
    -- Si un producto es parte de una orden ya hecha, generalmente no quisieramos que se elimine el producto,
    -- ya que eso afectaría el historial de la orden. Es mejor restringir la eliminación del producto
    -- si está referenciado en un item_orden. Si realmente necesitamos eliminarlo, primero deberíamos
    -- "cancelar" o "archivar" las órdenes que lo contienen. Si prefieren la cascada, cambiamos a ON DELETE CASCADE.
);
```
