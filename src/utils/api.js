const API_BASE_URL = "http://localhost:5000";

// 과목 API
export const subjectsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/subjects`);
    return response.json();
  },
  create: async (name) => {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name }),
    });
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/subjects/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// 세션 API
export const sessionsAPI = {
  getAll: async (params = {}) => {
    const query = new URLSearchParams(params).toString();
    const response = await fetch(`${API_BASE_URL}/sessions?${query}`);
    return response.json();
  },
  create: async (subjectId, duration) => {
    const response = await fetch(`${API_BASE_URL}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject_id: subjectId, duration }),
    });
    return response.json();
  },
  delete: async (id) => {
    const response = await fetch(`${API_BASE_URL}/sessions/${id}`, {
      method: "DELETE",
    });
    return response.json();
  },
};

// 통계 API
export const statsAPI = {
  getStats: async () => {
    const response = await fetch(`${API_BASE_URL}/stats`);
    return response.json();
  },
};
