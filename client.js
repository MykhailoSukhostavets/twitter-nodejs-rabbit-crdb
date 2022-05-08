const http = require('http');

const replics =
  'Ще не вмерла України, ні слава, ні воля,\nЩе нам, браття молодії, усміхнеться доля!\nЗгинуть наші воріженьки, як роса на сонці,\nЗапануєм і ми, браття, у своїй сторонці!\nДушу й тіло ми положим за нашу свободу\nІ — покажем, що ми, браття, козацького роду!\nДушу й тіло ми положим за нашу свободу\nІ — покажем, що ми, браття, козацького роду!\n';

const replicsArr = replics.split('\n');

let index = 0;

const interval = setInterval(async () => {
  if (index === replicsArr.length) index = 0;
  try {
    http.get(`http://localhost:3000/create?message=${replicsArr[index]}`);
  } catch {}
  index++;
}, 2000);
