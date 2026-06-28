# Focus Timer (프론트엔드)

본 프로젝트는 노마드 코더에서 진행한 AI ⚡ 기초 탄탄 클럽의 최종 과제로 진행한 Focus Timer의 프론트엔드입니다.

## 기술 스택

- 프론트엔드: React.js, HTML/CSS, JavaScript
- 백엔드: Python, Flask, PyMySQL
- DB: MySQL
- 통계: Recharts
- 배포(프론트엔드): Github Pages
  - spa-github-pages

## Frontend Notes

- Timer: setInterval로 카운트다운, React state로 타이머 상태 관리, localStorage로 페이지 새로고침 후에도 타이머 상태 유지, CSS 애니메이션으로 진행 지표
- History: useEffect로 API 호출, React state로 필터
- Dashboard: Recharts로 막대 차트
- Routing: 3개 화면에 React Router
  React state로 필터

## 배포 과정

```shell
npm run build
npm install -g gh-pages
gh-pages -d dist
```

## 실행 방법

메인 화면(=타이머 화면)에서 과목을 추가한 다음 타이머를 작동시켜서 세션을 시작합니다. 타이머가 끝나면 세션이 저장되고, 기록과 대시보드에서 확인 가능합니다.

## 트러블슈팅

기록, 대시보드 화면에서 브라우저 새로고침을 할 때 404 에러 페이지가 뜨던 오류가 있었습니다. React.js는 싱글 페이지 앱인데, Github Pages는 이를 지원하지 않아서 발생한 문제였습니다. 이를 해결하기 위해 [spa-github-pages](https://github.com/rafgraph/spa-github-pages "Single Page Apps for GitHub Pages")라는 솔루션을 사용했습니다.

- 프로젝트 루트의 index.html과 public/404.html 파일에 \<script\>를 붙여넣는 작업이었습니다.

그 외에도 CORS 에러가 있었는데, 이는 백엔드에 origins를 설정할 때 도메인이 아니라 전체 URL(\<username\>.github.io/\<repo\>
)을 넣은 실수로 인해 발생했습니다.
