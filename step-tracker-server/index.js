const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2/promise');
const WebSocket = require('ws');
const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());

// MySQL 데이터베이스 연결 설정
const dbConfig = {
    host: 'project-db-cgi.smhrd.com',
    user: 'homewalk',
    password: 'homewalk',
    database: 'homewalk',
    port: 3307
};

// stepsData 변수 정의 및 초기화
let stepsData = [];

// 회원가입 엔드포인트 추가
app.post('/register', async (req, res) => {
    const { username, password, age } = req.body;
    if (!username || !password || !age) {
        return res.status(400).send('All fields are required');
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT id FROM user WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(409).send('Username already exists');
        }

        await connection.execute('INSERT INTO user (username, password, age) VALUES (?, ?, ?)', [username, password, age]);
        await connection.end();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
    }
});

// 하드코딩된 사용자 정보
const users = {
    'hj': '123',
    'gy': '123',
    'gm': '123',
    'dg': '123',
    'jh': '123'
};

// 로그인 엔드포인트 추가
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    // 하드코딩된 사용자 정보 확인
    if (users[username] && users[username] === password) {
        return res.status(200).send('Login successful');
    }

    // MySQL 데이터베이스에서 사용자 정보 확인
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT * FROM user WHERE username = ? AND password = ?', [username, password]);
        await connection.end();

        if (rows.length > 0) {
            res.status(200).send('Login successful');
        } else {
            res.status(401).send('Invalid username or password');
        }
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).send('Internal server error');
    }
});

// WebSocket 서버 설정
const wss = new WebSocket.Server({ port: 3001 });

wss.on('connection', ws => {
    console.log('WebSocket connection established');
    ws.send(JSON.stringify(stepsData));

    ws.on('message', (message) => {
        console.log('Received message from client:', message);
    });

    ws.on('close', () => {
        console.log('WebSocket connection closed');
    });

    ws.on('error', (error) => {
        console.error('WebSocket server error:', error);
    });
});

const broadcast = (data) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(data));
        }
    });
};

app.post('/steps', (req, res) => {
    const { userId, steps, timestamp } = req.body;
    if (userId !== undefined && steps !== undefined && timestamp !== undefined) {
        stepsData.push({ userId, steps, timestamp });
        console.log(`Received steps data: ID: ${userId} Steps: ${steps} at ${new Date(timestamp).toLocaleString()}`);
        broadcast(stepsData);
    } else {
        console.log('Received malformed data:', req.body);
    }
    res.status(200).send('Data received');
});

app.get('/steps', (req, res) => {
    console.log('Steps data being sent:', stepsData);
    res.json(stepsData);
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
