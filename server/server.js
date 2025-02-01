const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const { createCanvas, loadImage } = require('canvas');
const app = express();
const port = 3000;

// 配置微信公众平台 API
const WECHAT_APPID = 'YOUR_APPID';
const WECHAT_SECRET = 'YOUR_APPSECRET';
const WECHAT_TO_USER = '1374198709'; // 目标微信用户

// 中间件
app.use(bodyParser.json());
app.use(express.static('public'));

// 获取微信 access_token
async function getAccessToken() {
  const url = `https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=${WECHAT_APPID}&secret=${WECHAT_SECRET}`;
  const response = await axios.get(url);
  return response.data.access_token;
}

// 发送消息到微信
async function sendToWeChat(imageBase64, dishes) {
  const accessToken = await getAccessToken();
  const url = `https://api.weixin.qq.com/cgi-bin/message/custom/send?access_token=${accessToken}`;

  const payload = {
    touser: WECHAT_TO_USER,
    msgtype: 'text',
    text: {
      content: `情侣点菜：${dishes.join('、')}`,
    },
  };

  await axios.post(url, payload);
}

// 接收前端请求
app.post('/sendToWeChat', async (req, res) => {
  const { image, dishes } = req.body;
  try {
    await sendToWeChat(image, dishes);
    res.status(200).send('发送成功');
  } catch (error) {
    res.status(500).send('发送失败');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
