// Express 모듈을 불러옵니다.
const express = require('express');

// path 모듈을 불러옵니다.
const path= require('path');

// Express 앱을 실행합니다.
const app = express();

// 앱의 포트를 설정합니다. 환경 변수에 포트가 지장되어 있지 않으면 3000번 포트를 사용합니다.
app.set('port', process.env.PORT || 3000);
// app.set(키, 값)에 데이터를 저장, 데이터를 app.get(키)로 가져올 수 있음.

// 루트 경로('/')로 GET 요청이 오면 index.html 파일을 클라이언트에게 전송합니다.
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '/index.html'));
});
// app.get(주소, 라우터) -> 주소에 대한 GET요청이 올때 어떤 동작을 할지 적는 부분
// req -> 요청에 대한 정보가 들어 있는 객체
// res -> 응답에 대한 정보가 들어있는 객체
// res.sendFile() -> 클라이언트에게 파일을 전송하는 메서드
// path.join(_dirname, '/index.html') -> 서버의 디렉토리 경로와 'index.html' 파일의 상대 경로를 결합하여 전체 파일 경로를 생성
// _dirname -> 현재 스크립트가 위치한 디렉토리를 나타내는 Node.js 전역 변수

// 앱이 설정한 포트에서 대기 상태로 시작됩니다.
// 서버가 시작되면 해당 포트에서 대기 중 메시지를 로그에 출력합니다.
app.listen(app.get('port'), () => {
    console.log(app.get('port'), '번 포트에서 대기중');
});