'use strict';

require('dotenv').config();
const express = require('express');
const axios = require('axios');
const path = require('path');

const app = express();

// ── Configuration ──────────────────────────────────────────────────────────
const PORT = process.env.PORT || 3000;
const HUBSPOT_ACCESS_TOKEN = process.env.HUBSPOT_ACCESS_TOKEN;
const CUSTOM_OBJECT_TYPE = process.env.CUSTOM_OBJECT_TYPE;

if (!HUBSPOT_ACCESS_TOKEN || !CUSTOM_OBJECT_TYPE) {
  console.error(
    'ERROR: Missing required environment variables.\n' +
    'Please ensure HUBSPOT_ACCESS_TOKEN and CUSTOM_OBJECT_TYPE are set in your .env file.'
  );
  process.exit(1);
}

// ── HubSpot API client ─────────────────────────────────────────────────────
const hubspotClient = axios.create({
  baseURL: 'https://api.hubapi.com',
  headers: {
    Authorization: `Bearer ${HUBSPOT_ACCESS_TOKEN}`,
    'Content-Type': 'application/json',
  },
});

// ── Middleware ─────────────────────────────────────────────────────────────
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ── Routes ─────────────────────────────────────────────────────────────────

/**
 * GET /
 * Fetches all records from the HubSpot Custom Object and renders the homepage
 * with a table of current solicitudes.
 */
app.get('/', async (req, res) => {
  try {
    const response = await hubspotClient.get(
      `/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`,
      {
        params: {
          properties: 'name,interest_program,source_channel',
          limit: 100,
        },
      }
    );

    const records = response.data.results || [];

    res.render('homepage', {
      title: 'Solicitudes Bot Admisiones | Integrating With HubSpot I Practicum',
      records,
    });
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response
      ? JSON.stringify(error.response.data, null, 2)
      : error.message;

    console.error(`Error fetching records from HubSpot [${status}]:`, message);

    res.status(status).render('homepage', {
      title: 'Solicitudes Bot Admisiones | Integrating With HubSpot I Practicum',
      records: [],
      error: `Failed to load records (HTTP ${status}). Check your token and object type in .env`,
    });
  }
});

/**
 * GET /update-cobj
 * Renders the form for creating a new Custom Object record.
 */
app.get('/update-cobj', (req, res) => {
  res.render('updates', {
    title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
  });
});

/**
 * POST /update-cobj
 * Receives form data, posts a new record to HubSpot, then redirects to /.
 */
app.post('/update-cobj', async (req, res) => {
  const { name, interest_program, source_channel } = req.body;

  const properties = { name };
  if (interest_program) properties.interest_program = interest_program;
  if (source_channel) properties.source_channel = source_channel;

  try {
    await hubspotClient.post(`/crm/v3/objects/${CUSTOM_OBJECT_TYPE}`, {
      properties,
    });

    res.redirect('/');
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response
      ? JSON.stringify(error.response.data, null, 2)
      : error.message;

    console.error(`Error creating record in HubSpot [${status}]:`, message);

    res.status(status).render('updates', {
      title: 'Update Custom Object Form | Integrating With HubSpot I Practicum',
      error: `Failed to create record (HTTP ${status}). Please try again.`,
      formData: req.body,
    });
  }
});

/**
 * GET /contacts
 * Fetches HubSpot Contacts and renders contacts.pug.
 */
app.get('/contacts', async (req, res) => {
  try {
    const response = await hubspotClient.get('/crm/v3/objects/contacts', {
      params: {
        properties: 'firstname,lastname,email,phone',
        limit: 100,
      },
    });

    const contacts = response.data.results || [];

    res.render('contacts', {
      title: 'Contactos HubSpot | Integrating With HubSpot I Practicum',
      contacts,
    });
  } catch (error) {
    const status = error.response ? error.response.status : 500;
    const message = error.response
      ? JSON.stringify(error.response.data, null, 2)
      : error.message;

    console.error(`Error fetching contacts from HubSpot [${status}]:`, message);

    res.status(status).render('contacts', {
      title: 'Contactos HubSpot | Integrating With HubSpot I Practicum',
      contacts: [],
      error: `Failed to load contacts (HTTP ${status}).`,
    });
  }
});

// ── 404 Handler ────────────────────────────────────────────────────────────
app.use((req, res) => {
  res.status(404).send('<h1>404 - Page Not Found</h1><a href="/">Return to homepage</a>');
});

// ── Start Server ───────────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\nServer running at http://localhost:${PORT}`);
  console.log(`Custom Object Type: ${CUSTOM_OBJECT_TYPE}\n`);
});
