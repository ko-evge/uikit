/**
 * API Helper - Modern fetch wrapper
 * Handles communication with backend
 */

const API = {
  baseURL: 'server.php',

  /**
   * Send action-based request (legacy)
   */
  call: async (action, params = {}) => {
    try {
      const response = await fetch(API.baseURL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          action: action,
          ...params
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  /**
   * Send RESTful request
   */
  fetch: async (method, endpoint, body = null) => {
    try {
      const options = {
        method: method,
        headers: {
          'Content-Type': 'application/json'
        }
      };

      if (body) {
        options.body = JSON.stringify(body);
      }

      const response = await fetch('/api/' + endpoint, options);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      return data.data;
    } catch (error) {
      console.error('API Error:', error);
      throw error;
    }
  },

  // ============================================
  // DOCUMENT OPERATIONS
  // ============================================
  docs: {
    getAll: async (kdus) => {
      return API.call('get_alldoc', { kdus });
    },

    get: async (id) => {
      return API.call('get_doc', { id });
    },

    add: async (data) => {
      return API.call('add_doc', data);
    },

    update: async (id, data) => {
      return API.call('update_doc', { id, ...data });
    },

    delete: async (id) => {
      return API.call('delete_doc', { id });
    }
  },

  // ============================================
  // REFERENCE OPERATIONS (REST endpoints)
  // ============================================
  refs: {
    search: async (table, search) => {
      return API.call('seek_spr', { dir: table, seek: search });
    },

    get: async (table, id) => {
      return API.fetch('GET', `ref/${table}/${id}`);
    },

    add: async (table, data) => {
      return API.fetch('POST', `ref/${table}`, data);
    },

    update: async (table, id, data) => {
      return API.fetch('PUT', `ref/${table}/${id}`, data);
    },

    delete: async (table, id) => {
      return API.fetch('DELETE', `ref/${table}/${id}`);
    }
  },

  // ============================================
  // AUTH
  // ============================================
  auth: {
    login: async (user, pass) => {
      console.log('Login attempt:', { user, pass });
      return API.call('get_us', { user, pass });
    }
  },

  // ============================================
  // WAREHOUSE (placeholder)
  // ============================================
  warehouse: {
    search: async (nm_sk, imtb, nmzpo) => {
      return API.call('seek_war', { nm_sk, imtb, nmzpo });
    }
  }
};

// Export as module and global
window.API = API;
export default API;
