const apiUrl = 'http://localhost:5000/api/menu'; // 后端API地址
const menuContainer = document.getElementById('menu-container');
const selectedMenuContainer = document.getElementById('selected-menu-container');
const generateImageBtn = document.getElementById('generate-image-btn');
const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let selectedItems = [];

// 获取菜单数据
fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    data.forEach(item => {
      createMenuItem(item);
    });
  })
  .catch(err => {
    console.error('Error fetching menu:', err);
  });

// 创建菜单项
function createMenuItem(item) {
  const menuItem = document.createElement('div');
  menuItem.classList.add('menu-item');

  const img = document.createElement('img');
  img.src = item.imageUrl;
  img.alt = item.name;
  img.addEventListener('click', () => addItemToSelection(item));

  const name = document.createElement('p');
  name.textContent = item.name;

  menuItem.appendChild(img);
  menuItem.appendChild(name);
  menuContainer.appendChild(menuItem);
}

// 将菜品添加到已选列表
function addItemToSelection(item) {
  if (!selectedItems.some(selectedItem => selectedItem.id === item.id)) {
    selectedItems.push(item);
    updateSelectedMenu();
  }
}

// 更新已选菜品显示
function updateSelectedMenu() {
  selectedMenuContainer.innerHTML = '';
  selectedItems.forEach(item => {
    const selectedItem = document.createElement('div');
    selectedItem.classList.add('selected-item');

    const img = document.createElement('img');
    img.src = item.imageUrl;
    img.alt = item.name;

    const name = document.createElement('p');
    name.textContent = item.name;

    const removeButton = document.createElement('button');
    removeButton.textContent = '删除';
    removeButton.addEventListener('click', () => removeItemFromSelection(item));

    selectedItem.appendChild(img);
    selectedItem.appendChild(name);
    selectedItem.appendChild(removeButton);
    selectedMenuContainer.appendChild(selectedItem);
  });
}

// 删除已选菜品
function removeItemFromSelection(item) {
  selectedItems = selectedItems.filter(i => i.id !== item.id);
  updateSelectedMenu();
}

// 生成菜品图像
generateImageBtn.addEventListener('click', () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let yPosition = 20;

  selectedItems.forEach(item => {
    const img = new Image();
    img.src = item.imageUrl;
    img.onload = () => {
      ctx.drawImage(img, 10, yPosition, 100, 100);
      ctx.fillText(item.name, 120, yPosition + 50);
      yPosition += 120;
    };
  });
});

// 长按保存图片
canvas.addEventListener('contextmenu', function (e) {
  e.preventDefault();
  const imageUrl = canvas.toDataURL();
  const link = document.createElement('a');
  link.href = imageUrl;
  link.download = 'couple-menu.png';
  link.click();
});
