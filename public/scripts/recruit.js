// document 객체를 사용하여 HTML 문서의 요소를 가져온다.
const $profile = document.querySelector(".user_logo img");
const $recruitSearchInput = document.querySelector(".search input");
const $recruitSearchBtn = document.querySelector(".search button");
const $recruitSections = document.querySelectorAll("section");
const $recruitWriteBtn = document.querySelector(".write_btn button");

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

$recruitWriteBtn.addEventListener("click", function (e) {
  e.preventDefault();
  console.log("글쓰기 버튼이 클릭되었습니다."); // 글쓰기 버튼 클릭 시 메시지를 출력한다.
});
