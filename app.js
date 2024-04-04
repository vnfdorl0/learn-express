const express = require('express'); // Express 모듈
const morgan = require('morgan'); // morgan 미들웨어 -> HTTP 요청에 대한 로그 기록
const cookieParser = require('cookie-parser'); // cookieParser 미들웨어 -> 클라이언트가 보낸 쿠키 파싱
const session = require('express-session'); // express-session -> 세션 관리
const dotenv = require('dotenv'); // dotenv 라이브러리 -> 환경 변수 관리
const path= require('path');// path 모듈 -> 파일 및 디렉토리 경로를 처리

dotenv.config(); // .env 파일의 환경 변수를 로드

const app = express();// Express 앱을 생성

app.set('port', process.env.PORT || 3000); // 앱의 포트를 설정 -> 환경 변수에 포트가 지정되어 있지 않으면 3000번 포트를 사용
    // app.set(키, 값)에 데이터를 저장, 데이터를 app.get(키)로 가져올 수 있음.

app.use(morgan('dev')); // morgan('dev') -> 요청과 응답에 대한 정보를 콘솔에 기록

// express.staric -> 정적 파일들을 제공하는 라우터 역할
// public 디렉토리 안에 있는 파일들을 제공 -> 직접 읽어서 전송하지 않아도 됨.
app.use('/', express.static(path.join(__dirname, 'public')));

// 요청의 본문에 있는 데이터 해석 -> req.body 객체로 만들어주는 미들웨어 
app.use(express.json());
    // JSON 데이터를 JavaScript 객체로 변환 -> req.body 객체에 저장
app.use(express.urlencoded({ extended: false }));
    // 주소 형식 데이터 해석 -> req.body 객체에 저장
    // { extended: false } -> 노드의 qureystring 모듈을 사용해 쿼리스트링 해석

// 요청의 동봉된 쿠키를 해석 -> req.cookies 객체에 저장
app.use(cookieParser(process.env.COOKIE_SECRET));
    // COOKIE_SECRET -> 제공한 비밀키를 통해 해당 쿠키가 내 서버가 만든 쿠키임을 검증
    // 쿠키 -> 서버와 클라이언트 간의 상태를 유지하고 정보를 교환하는대 사용하는 작은 데이터 조각, 웹브라우저에 저장됨.
    
// 세션 관리를 위한 미들웨어 -> 세션 정보를 서버에 저장
// 일반적으로 cookie-parser 미들웨어 뒤에 위치
app.use(session({
    resave: false,
    saveUninitialized: false,
    secret: process.env.COOKIE_SECRET,
    cookie: {
        httpOnly: true,
        secure: false,
    },
    name: 'session-cookie' ,
}))
    // resave -> 요청이 올 때 세션에 수정사항이 생기지 않더라도 세션을 다시 저장할지 설정
    // saveUninitialized -> 세션에 저장할 내역이 없더라도 처음부터 세션을 생성할지 설정
    // secret -> 안전하기 쿠키를 전송하려면 쿠키에 서명을 추가해야 함. 쿠키에 서명할 때 secret 값이 필요
    // cookie -> 세션 쿠키에 대한 설정
        // httpOnly: true -> 클라이언트에서 쿠키를 확인할 수 없음.
        // secur: false -> http 가 아닌 환경에서도 사용할 수 있음.
    // name: 'session-cookie' -> 세션 쿠키의 이름을 'session-cookie'로 지정

// app.use('abc', 미들웨어) -> abc로 시작되는 요청에서 미들웨어 실행
app.use((req, res, next) => {
    console.log('모든 요청에 다 실행됩니다.');
    next();
})
    // req -> 요청에 대한 정보가 들어 있는 객체
    // res -> 응답에 대한 정보가 들어있는 객체
    // next -> 다음 미들웨어로 넘어가는 함수, next를 실행하지 않으면 다음 미들웨어가 실행되지 않음.

// 루트 경로('/')로 GET 요청이 오면 실행
app.get('/', (req, res, next) => {
    console.log('GET / 요청에서만 실행됩니다.');
    next();
}, (req, res) => {
    throw new Error('에러는 에러 처리 미들웨어로 갑니다.')
});
    // app.get(주소, 라우터) -> 주소에 대한 GET요청이 올때 어떤 동작을 할지 적는 부분
    // (req, res) => {} -> 다음으로 실행될 콜백 함수를 정의, 이 함수는 req, res를 인자로 받음.
    // throw net Error -> 에러를 발생시키고, 이를 등록된 에러 처리 미들웨어로 전달

// 에러처리 미들웨어 -> 매개 변수가 err, req, res, next로 4개 -> 반드시 매개변수가 4개여야 함.
// 기본적으로 익스프레스가 에러를 처리하긴 하지만, 직접 에러 처리 미들웨어를 연결해주는 것을 권장
// 에러처리 미들웨어는 특변한 경우가 아니면 가장 아래에 위치함.
app.use((err, req, res, next) => {
    console.error(err);
    res.status(500).send(err.message);
})
    // err -> 에러에 관한 정보가 담겨 있음
    // res.status(HTTP 상태코드) -> HTTP 상태코드 지정, 기본 값은 200(성공)

// 앱이 설정한 포트에서 대기 상태로 시작됩니다.
// 서버가 시작되면 해당 포트에서 대기 중 메시지를 로그에 출력합니다.
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});