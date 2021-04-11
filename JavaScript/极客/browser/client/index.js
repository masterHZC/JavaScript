const net = require('net')

class Response {

}

class Request {
  constructor (options) {
    this.method = options.method || 'GET'
    this.host = options.host
    this.port = options.port || 80
    this.path = options.path || '/'
    this.body = options.body || {}
    this.headers = options.headers || {}
    if (!this.headers['Content-Type']) {
      this.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    }
    if (this.headers['Content-Type'] === 'application/json')
      this.bodyText = JSON.stringify(this.body)
    else if (this.headers['Content-Type'] === 'application/x-www-form-urlencoded')
      this.bodyText = Object.keys(this.body).map(key => `${key}=${encodeURIComponent(this.body[key])}`).join('&')

    this.headers['Content-Length'] = this.bodyText.length
  }

  send (connection) {
    return new Promise((resolve, reject) => {
      if (connection) {
        connection.write(this.toString())
      }
      else {
        connection = net.createConnection({
          host: this.host,
          port: this.port
        }, () => {
          connection.write(this.toString())
        })
      }

      connection.on('data', data => {
        resolve(data.toString())
        connection.end()
      })

      connection.on('error', err => {
        reject(err.toString())
        connection.end()
      })
        
    })
  }

  toString () {
    return `${this.method} ${this.path} HTTP/1.1\r
${Object.keys(this.headers).map(key => `${key}: ${this.headers[key]}`).join('\r\n')}
\r
${this.bodyText}\r\n`
  }
}

void async function () {
  const request = new Request({
    method: 'POST',
    host: '127.0.0.1',
    port: 3302,
    path: '/',
    body: {
      name: 'mark'
    },
    headers: {
      'X-Foo2': 'customed'
    }
  })
  
  let response = await request.send()
  console.log(response)
}()


// const client = net.createConnection({ host: '127.0.0.1', port: 3302 }, () => {


//   const request = new Request({
//     method: 'POST',
//     host: '127.0.0.1',
//     port: 3302,
//     path: '/',
//     body: {
//       name: 'mark'
//     }
//   })

//   console.log(request.toString())

//   client.write(request.toString())

//   const body = 'filed=aaa&code=123!'
//   // // 'connect' 监听器
//   // console.log('已连接到服务器')
//   // client.write(`POST / HTTP/1.1\r
//   // Host: 127.0.0.1\r
//   // Content-Type: appication/x-www-form-urlencoded\r
//   // Content-Length: ${body.length}\r
//   // \r
//   // ${body}\r`)
// })
// client.on('data', (data) => {
//   console.log(data.toString())
//   client.end()
// })
// client.on('end', () => {
//   console.log('已从服务器断开')
// })