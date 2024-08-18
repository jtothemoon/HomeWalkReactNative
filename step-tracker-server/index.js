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

// 일정 시간마다 데이터를 DB에 저장하기 위한 함수
const saveStepsToDatabase = async () => {
    if (stepsData.length === 0) {
        return;
    }

    try {
        const connection = await mysql.createConnection(dbConfig);

        for (const data of stepsData) {
            const { userId, steps, timestamp } = data;
            // 로컬 시간대에 맞춘 날짜 추출
            const dateObj = new Date(timestamp);
            const year = dateObj.getFullYear();
            const month = String(dateObj.getMonth() + 1).padStart(2, '0');
            const day = String(dateObj.getDate()).padStart(2, '0');
            const date = `${year}-${month}-${day}`;
            
            const hour = dateObj.getHours();

            // 기존 데이터가 있는지 확인
            const [rows] = await connection.execute(
                `SELECT steps_count, hourly_data FROM steps WHERE user_id = ? AND date = ?`,
                [userId, date]
            );

            if (rows.length > 0) {
                // 데이터가 존재하면 업데이트 (걸음수 +1 및 hourly_data 업데이트)
                const existingSteps = rows[0].steps_count;
                let hourlyData = JSON.parse(rows[0].hourly_data || '{}');
                
                // 각 걸음 수를 1씩 증가시키는 방식으로 처리
                hourlyData[hour] = (hourlyData[hour] || 0) + 1;

                await connection.execute(
                    `UPDATE steps SET steps_count = ?, hourly_data = ? WHERE user_id = ? AND date = ?`,
                    [existingSteps + 1, JSON.stringify(hourlyData), userId, date]
                );
            } else {
                // 데이터가 없으면 새로 삽입
                const hourlyData = JSON.stringify({ [hour]: 1 });

                await connection.execute(
                    `INSERT INTO steps (user_id, steps_count, date, hourly_data) VALUES (?, ?, ?, ?)`,
                    [userId, 1, date, hourlyData]
                );
            }
        }

        await connection.end();
        console.log(`Processed ${stepsData.length} records with step increment.`);
        stepsData = [];  // 저장 후 메모리 데이터 초기화
    } catch (error) {
        console.error('Error processing steps data:', error);
    }
};

// 주기적으로 DB에 데이터를 저장 (예: 1분마다)
setInterval(saveStepsToDatabase, 5000);  // 60000ms = 1분

// 회원가입 엔드포인트 추가
app.post('/register', async (req, res) => {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
        return res.status(400).send('All fields are required');
    }

    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT user_id FROM users WHERE username = ?', [username]);
        if (rows.length > 0) {
            return res.status(409).send('Username already exists');
        }

        await connection.execute('INSERT INTO users (username, password, email) VALUES (?, ?, ?)', [username, password, email]);
        await connection.end();
        res.status(201).send('User registered successfully');
    } catch (error) {
        console.error('Error registering user:', error);
        res.status(500).send('Internal server error');
    }
});

// 로그인 엔드포인트 추가
app.post('/login', async (req, res) => {
    const { username, password } = req.body;
    if (!username || !password) {
        return res.status(400).send('Username and password are required');
    }

    // MySQL 데이터베이스에서 사용자 정보 확인
    try {
        const connection = await mysql.createConnection(dbConfig);
        const [rows] = await connection.execute('SELECT user_id FROM users WHERE username = ? AND password = ?', [username, password]);
        await connection.end();

        if (rows.length > 0) {
            const userId = rows[0].user_id;
            res.status(200).json({ message: 'Login successful', userId: userId });
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
