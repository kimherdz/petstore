import express from 'express';
import pkg from 'pg';
const { Pool } = pkg;
import cors from 'cors';

// Crear la aplicación de Express
const app = express();

app.use(cors());
app.use(express.json());

// Conexión a PostgreSQL
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'petstore',
    password: '123456',
    port: 5432,
});

// Iniciar el servidor en el puerto 5000
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// nuevo cliente
app.post('/api/clientes', async (req, res) => {
    const { nombre, email, contraseña, telefono, direccion, tipo, postal } = req.body;

    try {
        const result = await pool.query(
            'INSERT INTO Clientes (nombre, email, contraseña, telefono, direccion, tipo, postal) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *',
            [nombre, email, contraseña, telefono, direccion, tipo, postal]
        );
        res.json(result.rows[0]); 
    } catch (error) {
        console.error('Error al insertar cliente:', error);
        console.log(error)
        res.status(500).send('Error en el servidor');
    }
});

// Obtener todos los clientes
app.get('/api/clientes', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM Clientes');
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener clientes:', error);
        res.status(500).send('Error en el servidor');
    }
});


// obtener productos
app.get('/api/productos', async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM Producto'
        );
        res.json(result.rows);
    } catch (error) {
        console.error('Error al obtener productos:', error);
        res.status(500).send('Error en el servidor');
    }
});

// obtener el postal
app.get('/api/getPostal', async (req, res) => {
    const { email } = req.query;
    try {
      const result = await pool.query('SELECT postal FROM Clientes WHERE email = $1', [email]);
      if (result.rows.length > 0) {
        res.json({ postal: result.rows[0].postal });
      } else {
        console.log('No se encontró el código postal para el correo:', email);
        res.status(404).json({ error: 'Código postal no encontrado' });
      }
    } catch (error) {
      console.error('Error en la consulta de la base de datos', error);
      res.status(500).json({ error: 'Error en la consulta de la base de datos' });
    }
  });


//login
app.post('/api/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const result = await pool.query('SELECT * FROM Clientes WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];
        
        // Comparar la contraseña directamente
        if (password !== user.contraseña) { // Comparación directa
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        res.json({ message: 'Inicio de sesión exitoso', user: { nombre: user.nombre, email: user.email, tipo: user.tipo } });
    } catch (error) {
        console.error('Error al procesar el login:', error);
        res.status(500).send('Error en el servidor');
    }
});

//editar inventario
app.put('/api/productos/:id', async (req, res) => {
    const { id } = req.params; 
    const { nombre, precio, descripcion, stock } = req.body;
  
    try {
      const result = await pool.query(
        'UPDATE Producto SET nombre = $1, precio = $2, descripcion = $3, stock = $4 WHERE idproducto = $5 RETURNING *',
        [nombre, precio, descripcion, stock, id]
      );
  
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
      }
  
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al actualizar el producto:', error);
      res.status(500).send('Error en el servidor');
    }
  });

  //eliminar producto
  app.delete('/api/productos/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('DELETE FROM Producto WHERE idproducto = $1 RETURNING *', [id]);
        if (result.rowCount > 0) {
            res.status(204).send();
        } else {
            res.status(404).send('Producto no encontrado');
        }
    } catch (error) {
        console.error('Error al eliminar producto:', error);
        res.status(500).send('Error en el servidor');
    }
});

  //editar usuarios
  app.put('/api/clientes/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, email, telefono, direccion, tipo } = req.body; 

    try {
        const result = await pool.query(
            'UPDATE Clientes SET nombre = $1, email = $2, telefono = $3, direccion = $4, tipo = $5 WHERE idcliente = $6 RETURNING *',
            [nombre, email, telefono, direccion, tipo, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error('Error al actualizar el usuario:', error);
        res.status(500).send('Error en el servidor');
    }
});

//eliminar usuarios
app.delete('/api/clientes/:id', async (req, res) => {
  const { id } = req.params;

  try {
      await pool.query('DELETE FROM Clientes WHERE idcliente = $1', [id]);
      res.status(204).send(); 
  } catch (error) {
      console.error('Error al eliminar el usuario:', error);
      res.status(500).send('Error en el servidor');
  }
});

// Crear un pedido
app.post('/api/pedidos', async (req, res) => {
    const { email, total } = req.body;

    if (!email || total === undefined) {
        return res.status(400).json({ error: 'Email y total son requeridos.' });
    }

    try {
        // Obtener el idcliente basado en el email proporcionado
        const clienteResult = await pool.query('SELECT idcliente FROM Clientes WHERE email = $1', [email]);

        if (clienteResult.rows.length === 0) {
            return res.status(404).json({ error: 'Cliente no encontrado.' });
        }

        const idcliente = clienteResult.rows[0].idcliente;

        // Generar un número de pedido aleatorio
        const orderNumber = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000;

        // Insertar el pedido usando el idcliente y el idpedido aleatorio
        await pool.query(
            'INSERT INTO Pedidos (idpedido, idcliente, total) VALUES ($1, $2, $3)',
            [orderNumber, idcliente, total]
        );

        // Devolver el número de pedido aleatorio
        res.json({ orderNumber });
    } catch (error) {
        console.error('Error al crear el pedido:', error);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

// Agregar un nuevo producto
app.post('/api/productos', async (req, res) => {
    const { nombre, precio, descripcion, stock } = req.body;
  
    try {
      const result = await pool.query(
        'INSERT INTO Producto (nombre, precio, descripcion, stock) VALUES ($1, $2, $3, $4) RETURNING *',
        [nombre, precio, descripcion, stock]
      );
      res.json(result.rows[0]);
    } catch (error) {
      console.error('Error al agregar el producto:', error);
      res.status(500).send('Error en el servidor');
    }
  });
  



