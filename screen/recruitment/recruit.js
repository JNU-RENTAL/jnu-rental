const Recruitment = require("../../models/recruitment");

// document 객체를 사용하여 HTML 문서의 요소를 가져온다.
const $profile = document.querySelector(".user_logo img");
const $recruitSearchInput = document.querySelector(".search input");
const $recruitSearchBtn = document.querySelector(".search button");
const $recruitSections = document.querySelectorAll("section");
const $recruitWriteBtn = document.querySelector(".write_btn button");
const $navList = document.querySelectorAll("nav ul li");

// 각 li 태그를 클릭했을 때 실행되는 함수입니다.
function clickNavList(event) {
  // 클릭한 li 태그의 텍스트를 가져옵니다.
  const text = event.target.textContent;

  // 데이터베이스에서 해당 텍스트에 해당하는 데이터를 가져옵니다.
  const data = Recruitment.findAll({
    where: {
      name: text,
    },
  });

  // (이 부분은 서버와의 통신을 통해 구현되어야 합니다.)
  // 가져온 데이터를 이용해 필요한 작업을 수행합니다.
  console.log(`Clicked on ${text}`);
  console.log(data.name);
}

// 각 li 태그에 이벤트 리스너를 등록합니다.
$navList.forEach((li) => {
  li.addEventListener("click", clickNavList);
});

$recruitSearchBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log($recruitSearchInput.value); // 검색어를 출력한다.
});

$recruitSections.forEach(function (section) {
  section.addEventListener("click", function (e) {
    e.preventDefault();
    console.log(section.querySelector("h2").textContent); // 클릭한 게시글의 제목을 출력한다.
  });
});

const tagElements = document.querySelectorAll("li a"); // li 태그에 속한 모든 a 태그 요소를 가져옴
console.log(tagElements);

tagElements.forEach((tagElement) => {
  tagElement.addEventListener("click", (event) => {
    event.preventDefault(); // 기본적으로 발생하는 이벤트 동작을 중지시킴

    const tagText = event.target.textContent; // 클릭된 태그의 텍스트 값을 가져옴

    fetch(listUrl) //`/data/${tagText}`
      .then((response) => response.json()) // 서버로부터 받은 데이터를 json 형태로 변환
      .then((data) => {
        console.log(data); // 데이터를 출력
      })
      .catch((error) => {
        console.error(error); // 오류가 발생한 경우 오류 메시지를 출력
      });
  });
});
