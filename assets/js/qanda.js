(async function initQandA() {
  const container = document.getElementById("qandaList");
  if (!container) return;

  const res = await fetch("/assets/data/qanda.json", { cache: "no-cache" });
  const data = await res.json();

  data.forEach((item, index) => {
    const article = document.createElement("article");
    article.className = "news-item qanda-item";

    const question = document.createElement("h3");
    question.className = "qanda-question";
    question.textContent = item.question;

    const answerWrap = document.createElement("div");
    answerWrap.className = "qanda-answer-wrapper";

    item.answer.forEach(block => {
      if (block.type === "text") {
        const p = document.createElement("p");
        p.textContent = block.content;
        answerWrap.appendChild(p);
      }

      if (block.type === "list") {
        const ul = document.createElement("ul");
        block.items.forEach(liText => {
          const li = document.createElement("li");
          li.textContent = liText;
          ul.appendChild(li);
        });
        answerWrap.appendChild(ul);
      }
    });

    article.appendChild(question);
    article.appendChild(answerWrap);
    container.appendChild(article);

    // Click-Logik
    question.addEventListener("click", () => {
  const isOpen = article.classList.contains("active");

  document.querySelectorAll(".qanda-item").forEach(el => {
    el.classList.remove("active");
  });

  if (!isOpen) {
    article.classList.add("active");
  }
});

  });
})();
