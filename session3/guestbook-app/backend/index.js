const express = require('express'); //express 모듈을 가져옴
const cors = require('cors'); //cors(Cross-Origin Resource Sharing) 모듈을 가져옴. 다른 도메인에서 서버의 리소스에 접근할 수 있도록 하는 방법
const { Pool } = require('pg'); //pg 모듈에서 Pool 클래스를 가져옴. PostgreSQL DB를 Node.js Application과 연결해주는 라이브러리
require('dotenv').config(); //dotenv 패키지가 .env 파일에 정의된 환경 변수를 로드하도록 함.
console.log(process.env.DATABASE_URL); //환경변수값 체크

const app = express(); //express application 초기화. app 객체는 HTTP 요청 처리에 사용.
app.use(cors()); //cors 미들웨어 추가
app.use(express.json()); //JSON형식의 요청 본문을 자동으로 파싱하여 req.body에 넣어줌.

const pool = new Pool({
    connectionString: process.env.DATABASE_URL, //DB와 연결
    ssl: false, //ssl 사용x
});

//방명록 항목 추가
app.post('/api/guestbook', async (req, res) => {
    const { name, message, password } = req.body;
    try {
        //Q. guestbook 이라는 테이블에 name, message, password 컬럼에 값을 추가하세요. 값을 추가하고, 바로 반환해서 확인하세요.
        const result = await pool.query(
            'INSERT INTO guestbook (name, message, password) VALUES ($1, $2, $3) RETURNING *',
            [name, message, password]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 방명록 항목 가져오기
app.get('/api/guestbook', async (req, res) => {
    try {
        // id, name, message, created_at, likes 컬럼을 guestbook 테이블에서 가져옴
        const result = await pool.query('SELECT id, name, message, created_at, likes FROM guestbook ORDER BY id DESC');
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 방명록 항목 수정
app.put('/api/guestbook/:id', async (req, res) => {
    const { id } = req.params;
    const { message, password } = req.body;
    try {
        // id로 비밀번호를 확인
        const result = await pool.query('SELECT password, likes FROM guestbook WHERE id = $1', [id]);

        // 비밀번호 확인
        if (result.rows.length > 0 && result.rows[0].password === password) {
            const likes = result.rows[0].likes; // 기존의 좋아요 수를 가져옴

            // 메시지 업데이트, 좋아요 수는 그대로 유지
            const updateResult = await pool.query(
                'UPDATE guestbook SET message = $1, likes = $2 WHERE id = $3 RETURNING id, name, message, likes, created_at',
                [message, likes, id]
            );

            res.json(updateResult.rows[0]);
        } else {
            res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//방명록 항목 삭제
app.delete('/api/guestbook/:id', async (req, res) => {
    const { id } = req.params;
    const { password } = req.body;
    try {
        //Q. guestbook 테이블에서 id로 특정 항목의 비밀번호를 가져오세요.
        const result = await pool.query('SELECT password FROM guestbook WHERE id = $1', [id]);
        if (result.rows.length > 0 && result.rows[0].password === password) {
            //Q. guestbook 테이블에서 id로 특정 항목을 삭제하세요.
            await pool.query('DELETE FROM guestbook WHERE id = $1', [id]);
            res.json({ message: '삭제되었습니다.' });
        } else {
            res.status(403).json({ error: '비밀번호가 일치하지 않습니다.' });
        }
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 방명록 항목 좋아요 수 증가
app.put('/api/guestbook/:id/like', async (req, res) => {
    const { id } = req.params;

    try {
        // id에 해당하는 항목의 likes 수를 1 증가시킴
        const result = await pool.query(
            'UPDATE guestbook SET likes = likes + 1 WHERE id = $1 RETURNING id, name, message, likes, created_at',
            [id]
        );

        // 항목이 존재하지 않는 경우
        if (result.rows.length === 0) {
            return res.status(404).json({ error: '항목을 찾을 수 없습니다.' });
        }

        // 업데이트된 항목을 클라이언트에 반환
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// 방명록 항목 검색
app.get('/api/guestbook/search', async (req, res) => {
    const { query } = req.query; // 검색어 받기
    console.log('검색어:', query); // 쿼리 로그
    try {
        // 이름이나 메시지에서 검색어가 포함된 항목 찾기
        const result = await pool.query(
            `SELECT id, name, message, created_at, likes 
             FROM guestbook 
             WHERE name ILIKE $1 OR message ILIKE $1 
             ORDER BY id DESC`,
            [`%${query}%`] // 쿼리 파라미터를 통해 부분 검색
        );

        res.json(result.rows); // 검색된 항목을 반환
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

//서버 실행
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
