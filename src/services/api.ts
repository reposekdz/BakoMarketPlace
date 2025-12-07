const API_URL = 'http://localhost:5000/api';

const getToken = () => localStorage.getItem('token');

const headers = () => ({
  'Content-Type': 'application/json',
  'Authorization': `Bearer ${getToken()}`
});

export const authAPI = {
  register: async (data: any) => {
    const res = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if (json.token) localStorage.setItem('token', json.token);
    return json;
  },
  
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (json.token) localStorage.setItem('token', json.token);
    return json;
  }
};

export const productAPI = {
  getAll: async (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/products?${query}`);
    return res.json();
  },
  
  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`);
    return res.json();
  },
  
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  update: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  delete: async (id: string) => {
    const res = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  }
};

export const orderAPI = {
  create: async (data: any) => {
    const res = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  getAll: async () => {
    const res = await fetch(`${API_URL}/orders`, { headers: headers() });
    return res.json();
  },
  
  updateStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/orders/${id}/status`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ status })
    });
    return res.json();
  }
};

export const shopAPI = {
  getById: async (id: string) => {
    const res = await fetch(`${API_URL}/shops/${id}`);
    return res.json();
  },
  
  getByUserId: async (userId: string) => {
    const res = await fetch(`${API_URL}/shops/user/${userId}`, { headers: headers() });
    return res.json();
  }
};

export const messageAPI = {
  send: async (data: any) => {
    const res = await fetch(`${API_URL}/messages`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  getConversations: async () => {
    const res = await fetch(`${API_URL}/messages/conversations`, { headers: headers() });
    return res.json();
  },
  
  getMessages: async (userId: string) => {
    const res = await fetch(`${API_URL}/messages/${userId}`, { headers: headers() });
    return res.json();
  }
};

export const expoAPI = {
  getAll: async () => {
    const res = await fetch(`${API_URL}/expos`);
    return res.json();
  },
  
  getBooths: async (expoId: string) => {
    const res = await fetch(`${API_URL}/expos/${expoId}/booths`);
    return res.json();
  }
};

export const analyticsAPI = {
  getDashboard: async () => {
    const res = await fetch(`${API_URL}/analytics/dashboard`, { headers: headers() });
    return res.json();
  }
};

export const adminAPI = {
  login: async (email: string, password: string) => {
    const res = await fetch(`${API_URL}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const json = await res.json();
    if (json.token) localStorage.setItem('token', json.token);
    return json;
  },
  
  getStats: async () => {
    const res = await fetch(`${API_URL}/admin/stats`, { headers: headers() });
    return res.json();
  },
  
  getProducts: async (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/products?${query}`, { headers: headers() });
    return res.json();
  },
  
  createProduct: async (data: any) => {
    const res = await fetch(`${API_URL}/admin/products`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  updateProduct: async (id: string, data: any) => {
    const res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  deleteProduct: async (id: string) => {
    const res = await fetch(`${API_URL}/admin/products/${id}`, {
      method: 'DELETE',
      headers: headers()
    });
    return res.json();
  },
  
  getCategories: async () => {
    const res = await fetch(`${API_URL}/admin/categories`, { headers: headers() });
    return res.json();
  },
  
  getSellers: async () => {
    const res = await fetch(`${API_URL}/admin/sellers`, { headers: headers() });
    return res.json();
  },
  
  updateSellerStatus: async (id: string, status: string) => {
    const res = await fetch(`${API_URL}/admin/sellers/${id}/status`, {
      method: 'PUT',
      headers: headers(),
      body: JSON.stringify({ status })
    });
    return res.json();
  },
  
  getTranslations: async (language: string) => {
    const res = await fetch(`${API_URL}/admin/translations?language=${language}`, { headers: headers() });
    return res.json();
  },
  
  saveTranslation: async (data: any) => {
    const res = await fetch(`${API_URL}/admin/translations`, {
      method: 'POST',
      headers: headers(),
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  getLogs: async (params: any = {}) => {
    const query = new URLSearchParams(params).toString();
    const res = await fetch(`${API_URL}/admin/logs?${query}`, { headers: headers() });
    return res.json();
  }
};
