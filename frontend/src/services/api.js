const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:3000";

export async function requestJson(path, options = {}) {
  const { method = "GET", body, auth = true } = options;
  const headers = {
    "Content-Type": "application/json",
  };

  const token = localStorage.getItem("jemz_token");
  if (auth && token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

export async function fetchProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return requestJson(`/api/products${query ? `?${query}` : ""}`);
}

export async function fetchProductCategories() {
  return requestJson("/api/products/categories");
}

export async function fetchFeaturedProducts() {
  return requestJson("/api/products/featured");
}

export async function fetchProductById(id) {
  return requestJson(`/api/products/${id}`);
}

export async function createProduct(payload) {
  return requestJson("/api/products", {
    method: "POST",
    body: payload,
  });
}

export async function updateProduct(id, payload) {
  return requestJson(`/api/products/${id}`, {
    method: "PUT",
    body: payload,
  });
}

export async function deleteProduct(id) {
  return requestJson(`/api/products/${id}`, { method: "DELETE" });
}

export function saveAuthToken(token) {
  localStorage.setItem("jemz_token", token);
}

export function removeAuthToken() {
  localStorage.removeItem("jemz_token");
}
