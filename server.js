const express = require('express');
const cors = require('cors');
const ldap = require('ldapjs');
const path = require('path'); // Novo: para lidar com caminhos de arquivos

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- NOVO: Servir arquivos estáticos (HTML, CSS, JS) ---
// Isso faz com que o Node entenda que a pasta atual tem arquivos de tela
app.use(express.static(__dirname)); 

// --- NOVO: Rota principal para abrir o login.html ---
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'login.html'));
});

// LDAP Configuration
const LDAP_URL = 'ldap://your-ldap-server.com:389';
const LDAP_DOMAIN = 'yourdomain.com';

// API Login Route
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required.' });
    }

    const client = ldap.createClient({ url: LDAP_URL });

    client.on('error', (err) => {
        console.error('LDAP Error:', err);
        return res.status(500).json({ message: 'Directory server error.' });
    });

    const userPrincipalName = `${username}@${LDAP_DOMAIN}`;

    client.bind(userPrincipalName, password, (err) => {
        if (err) {
            client.unbind();
            return res.status(401).json({ message: 'Invalid credentials.' });
        }
        client.unbind();
        return res.status(200).json({ message: 'Authentication successful', user: { username } });
    });
});

app.listen(PORT, () => {
    console.log(`System running at: http://localhost:${PORT}`);
});