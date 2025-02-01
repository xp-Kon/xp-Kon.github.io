// 初始菜品列表
const initialDishes = [
  { name: '宫保鸡丁', image: 'images/gb.jpg' },
  { name: '麻辣火锅', image: 'images/mg.jpg' },
  { name: '小龙虾', image: 'images/lobster.jpg' },
];

// 获取页面元素
const dishListEl = document.getElementById('dish-list');
const cartItemsEl = document.getElementById('cart-items');
const generateImageBtn = document.getElementById('generate-image-btn');
const addDishBtn = document.getElementById('add-dish-btn');
const dishNameInput = document.getElementById('dish-name');
const dishImageInput = document.getElementById('dish-image');

// 购物车
let cart = [];

// 渲染菜品列表
function renderDishList() {
  dishListEl.innerHTML = '';
  initialDishes.forEach((dish) => {
    const dishItem = document.createElement('div');
    dishItem.classList.add('dish-item');
    dishItem.innerHTML = `
      <img src="${dish.image}" alt="${dish.name}">
      <p>${dish.name}</p>
    `;
    dishItem.onclick = () => addToCart(dish);
    dishListEl.appendChild(dishItem);
  });
}

// 渲染购物车
function renderCart() {
  cartItemsEl.innerHTML = '';
  cart.forEach(dish => {
    const li = document.createElement('li');
    li.textContent = dish.name;
    cartItemsEl.appendChild(li);
  });
  generateImageBtn.disabled = cart.length === 0;
}

// 添加菜品到购物车
function addToCart(dish) {
  cart.push(dish);
  renderCart();
}

// 添加自定义菜品
addDishBtn.onclick = function() {
  const dishName = dishNameInput.value;
  const dishImage = dishImageInput.files[0];

  if (dishName && dishImage) {
    const imageURL = URL.createObjectURL(dishImage);
    initialDishes.push({ name: dishName, image: imageURL });
    renderDishList();
    dishNameInput.value = '';
    dishImageInput.value = '';
  }
};

// 生成图片并唤起微信分享
generateImageBtn.onclick = async function() {
  // 生成包含菜名和图片的菜品展示图片
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const img = new Image();
  const dishNames = cart.map(dish => dish.name).join('、');
  
  // 设置 canvas 尺寸
  canvas.width = 500;
  canvas.height = 300;

  // 绘制背景
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // 绘制菜品名称
  ctx.fillStyle = '#333';
  ctx.font = '20px Arial';
  ctx.fillText('情侣点菜：' + dishNames, 10, 30);

  // 如果需要加入图片，可在 canvas 上绘制
  const image = new Image();
  image.src = cart[0].image;  // 获取购物车第一个菜品的图片作为示例

  image.onload = function() {
    ctx.drawImage(image, 10, 50, 150, 150); // 适当调整图片位置
    const base64Image = canvas.toDataURL();  // 转为 base64 图片

    // 调用微信分享接口，触发微信消息转发
    if (navigator.share) {
      navigator.share({
        title: '情侣点菜',
        text: '我和我的爱人一起点了这些菜！',
        url: base64Image  // 微信分享图片链接
      }).then(() => {
        alert('已唤起微信转发');
      }).catch((error) => {
        alert('分享失败：' + error);
      });
    } else {
      alert('当前浏览器不支持分享功能');
    }

    // 清空购物车
    cart = [];  
    renderCart();
  };
};

// 初始化页面
renderDishList();
