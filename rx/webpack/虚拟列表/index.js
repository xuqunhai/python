const virtualList = document.getElementById("virtual-list");
const listContainer = document.getElementById("list-container");

virtualList.addEventListener("scroll", () => {
  const start = Math.floor(virtualList.scrollTop / itemHeight);
  const end = start + visibleCount;

  renderList(start, end);
});

function renderList(start, end) {
  listContainer.innerHTML = ""; // 清空容器
  listContainer.style.height = `${data.length * itemHeight}px`; // 设置虚拟总高度

  const fragment = document.createDocumentFragment();

  for (let i = start; i < end && i < data.length; i++) {
    const item = document.createElement("div");
    item.textContent = data[i];
    item.style.position = "absolute";
    item.style.top = `${i * itemHeight}px`;
    item.style.height = `${itemHeight}px`;
    item.style.left = "0";
    item.style.right = "0";

    fragment.appendChild(item);
  }

  listContainer.appendChild(fragment);
}
