'use strict';

const url = 'http://127.0.0.1:8001';
const structure = {
  user: {
    create: ['record'],
    read: ['id'],
    update: ['id', 'record'],
    delete: ['id'],
    find: ['mask'],
  },
  country: {
    read: ['id'],
    delete: ['id'],
    find: ['mask'],
  },
}

const generateWsCall = (name, method, socket) => (...args) => new Promise((resolve) => {  
  const packet = { name, method, args };
  const message = JSON.stringify(packet);
  socket.send(message);
  socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    resolve(data);
  };
});

const generateHttpCall = (name, method, params, baseUrl) => (...args) => new Promise((resolve) => {
  let url = `${baseUrl}/${name}/${method}`;
  if (params[0] === 'id' && args.length) url += '/' + args.shift();
  const body = JSON.stringify(args);

  fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body,
  }).then((res) => {
    resolve(res.json());
  })
})

const scaffold = (url, structure) => {
  const isWS = url.startsWith('ws');
  const socket = isWS ? new WebSocket(url) : null;
  const api = {};
  const services = Object.keys(structure);
  for (const serviceName of services) {
    api[serviceName] = {};
    const service = structure[serviceName];
    const methods = Object.keys(service);
    for (const methodName of methods) {
      api[serviceName][methodName] = isWS
        ? generateWsCall(serviceName, methodName, socket)
        : generateHttpCall(serviceName, methodName, service[methodName], url)
    }
  }
  
  return new Promise((resolve) => !isWS
    ? resolve(api)
    : socket.addEventListener('open', () => resolve(api))
  );
};

(async () => {
  const api = await scaffold(url, structure);
  const data = await api.user.read(2);
  console.dir({ data });
})()
