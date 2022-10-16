const ws = require("nodejs-websocket");
const PORT = 8080;
const clientList = [];
function generateUUID() {
  var d = new Date().getTime();
  var uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (
    c
  ) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c == "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
  return uuid;
}

module.exports = {
  start() {
    //创建server,每次只要有用户连接，回调执行就会给用户创建一个connect对象
    const server = ws.createServer((connect) => {
      console.log("用户连接成功");
      connect.sendText(
        JSON.stringify({
          sendTo: "panel",
          data: clientList
        })
      );
      //用户传来数据，触发text事件
      connect.on("text", (jsonData) => {
        const data = JSON.parse(jsonData);
        console.log(`接受到用户的数据:${jsonData}`);
        //接受到数据后给用户响应数据
        connect.sendText(JSON.stringify({ sendTo: "all", data: jsonData }));
        if (data.type === "panel") {
        } else if (data.type === "oms") {
          clientList.push({
            uuid: generateUUID(),
            name: data.name || generateUUID() + `_${new Date().getTime()}`
          });
        }
        connect.sendText(
          JSON.stringify({
            sendTo: "panel",
            data: clientList
          })
        );
      });
      //连接关闭触发close事件
      connect.on("close", () => {
        console.log("连接断开");
      });

      //注册error事件,用户端口后就会触发该异常
      connect.on("error", () => {
        console.log("用户连接异常");
      });
    });

    server.listen(PORT, () => {
      console.log("监听", PORT);
    });
  }
};
