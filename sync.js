const net = require('net')
const fs = require('fs')
const path = require('path')

const checkPort = (port) => {
    return new Promise(((resolve) => {
        const server = net.createServer(function(socket) {
            socket.write('Echo server\r\n');
            socket.pipe(socket);
        });
        server.listen(port, '127.0.0.1');
        server.on('error', function (e) {
            resolve(true);
        });
        server.on('listening', function (e) {
            server.close();
            resolve(false);
        });
    }))
}

const getName = (header) => {
    const i = header.indexOf('@name');
    const j = header.indexOf('\n',i + 1)
    return header.substring(i + 5,j).trim()
}

const findUuid = (name) => {
    //遍历同步目录 dist/Tampermonkey/sync/*.meta.json，找到name = 当前name的
    const files = fs.readdirSync(path.resolve(__dirname,'dist/Tampermonkey/sync'))
    for(let file of files){
        const c = fs.readFileSync(path.resolve(__dirname,'dist/Tampermonkey/sync/' + file),'utf-8')
        try{
            const json = JSON.parse(c)
            if(json.name === name){
                return json.uuid
            }
        }catch (e) {

        }
    }
}

module.exports = async (header) => {
    //检查7000端口是否打开
    if(!await checkPort(7000)){
        throw '7000端口未打开！请先执行npm run start:server'
    }
    const name = getName(header)
    const uuid = findUuid(name)

    if(!uuid){
        throw `没有找到名称为 ${name}的脚本，请确认在脚本中是否正确配置！`
    }

    const result =  {
        filename: uuid + '.user.js',
        path: path.resolve(__dirname, 'dist/Tampermonkey/sync')
    }

    console.log(`当前为WebDav同步编译模式，编译到的目录为${result.path}，文件名：${result.filename}`)

    return result
}
