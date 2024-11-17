// const Customer = require('../models/Customer');
// const { publishMessage } = require('../services/queue.service');
// const { body, validationResult } = require('express-validator');

// exports.createCustomer = async (req, res) => {
//   try {
//     console.log('[x] Received request to create customer with data:', req.body);

//     // Validation rules
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       console.error('[x] Validation error:', errors.array());
//       return res.status(400).json({ errors: errors.array() });
//     }

//     const { name, email } = req.body;

//     // Check for name and email fields
//     if (!name || !email) {
//       return res.status(400).json({ error: 'Name and email are required' });
//     }

//     // Check for valid email format
//     if (!/^\S+@\S+\.\S+$/.test(email)) {
//       return res.status(400).json({ error: 'Email must be a valid email address' });
//     }

//     // Create new customer object
//     const customer = new Customer({ name, email });
//     console.log('[x] Customer object created:', customer);

//     // Save customer to the database (if needed)
//     await customer.save();

//     // Publish message to RabbitMQ
//     try {
//       await publishMessage({ type: 'CREATE_CUSTOMER', payload: customer });
//       console.log('[x] Message published to queue:', { type: 'CREATE_CUSTOMER', payload: customer });
//     } catch (publishError) {
//       console.error('[x] Error publishing message to RabbitMQ:', publishError.message);
//       return res.status(500).json({ error: 'Customer created, but failed to publish message to the queue' });
//     }

//     res.status(201).json(customer);
//     console.log('[x] Response sent to client with status 201:', customer);
//   } catch (err) {
//     console.error('[x] Error creating customer:', err);
//     res.status(500).json({ error: 'Error creating customer' });
//   }
// };

// // Validation middleware
// exports.validateCreateCustomer = [
//   body('name').notEmpty().withMessage('Name is required'),
//   body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email address'),
// ];



const Customer = require('../models/Customer');
const { publishMessage } = require('../services/queue.service');
const { body, validationResult } = require('express-validator');

exports.createCustomer = async (req, res) => {
  try {
    console.log('[x] Received request to create customer with data:', req.body);

    // Validation rules
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.error('[x] Validation error:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email } = req.body;

    // Check for name and email fields
    if (!name || !email) {
      return res.status(400).json({ error: 'Name and email are required' });
    }

    // Check if the email already exists
    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const customer = new Customer({ name, email });
    console.log('[x] Customer object created:', customer);

    // Save the customer to the database
    const savedCustomer = await customer.save();
    console.log('[x] Customer saved to database:', savedCustomer);

    res.status(201).json(savedCustomer);
  } catch (err) {
    console.error('[x] Error creating customer:', err.message);
    res.status(500).json({ error: 'Error creating customer' });
  }
};

// Validation middleware
exports.validateCreateCustomer = [
  body('name').notEmpty().withMessage('Name is required'),
  body('email').notEmpty().withMessage('Email is required').isEmail().withMessage('Email must be a valid email address'),
];