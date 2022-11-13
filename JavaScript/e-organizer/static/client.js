'use strict';

const transport = {};

transport.http = (url) => (structure) => {
  const api = {};
  const services = Object.keys(structure);
  for (const name of services) {
    api[name] = {};
    const service = structure[name];
    const methods = Object.keys(service);
    for (const method of methods) {
      api[name][method] = (...args) => new Promise((resolve, reject) => {
        fetch(`${url}/api/${name}/${method}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ args }),
        }).then((res) => {
          if (res.status === 200) resolve(res.json());
					else if (res.status === 204) resolve();
          else reject(new Error(`Status Code: ${res.status}`));
        });
      });
    }
  }
  return Promise.resolve(api);
};

transport.ws = (url) => (structure) => {
  const socket = new WebSocket(url);
  const api = {};
  const services = Object.keys(structure);
  for (const name of services) {
    api[name] = {};
    const service = structure[name];
    const methods = Object.keys(service);
    for (const method of methods) {
      api[name][method] = (...args) => new Promise((resolve) => {
        const packet = { name, method, args };
        socket.send(JSON.stringify(packet));
        socket.onmessage = (event) => {
          const data = JSON.parse(event.data);
          resolve(data);
        };
      });
    }
  }
  return new Promise((resolve) => {
    socket.addEventListener('open', () => resolve(api));
  });
};

const scaffold = (url) => {
  const protocol = url.startsWith('ws:') ? 'ws' : 'http';
  return transport[protocol](url);
};

(async () => {
  const api = await scaffold('http://localhost:8001')({
    auth: {
			signUp: ['email', 'password', 'firstName', 'lastName'],
      signIn: ['email', 'password'],
      signOut: [],
      restore: ['token'],
    },
		company: {
			addEmployee: ['companyId', 'email', 'firstName', 'lastName'],
			create: ['ownerId', 'name', 'domain', 'description'],
			inviteEmployee: ['companyId', 'userId'],
		},
		employee: {
			list: ['companyId', 'page', 'limit', 'sortBy'],
		},
		project: {
			create: ['name', 'description', 'companyId'],
			list: ['companyId', 'page', 'limit', 'sortBy'],
			show: ['id'],
			update: ['id', 'name', 'description', 'startDate', 'endDate'],
			addMember: ['projectId', 'employeeId'],
			removeMember: ['projectId', 'employeeId'],
		},
		user: {
			list: ['page', 'limit', 'sortBy'],
		},
  });
  const data = await api.auth.signin('marcus', 'marcus');
  console.dir({ data });
})();
