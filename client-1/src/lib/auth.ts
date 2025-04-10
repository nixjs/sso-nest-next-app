import axios from 'axios';

export const login = () => {
  window.location.href = 'http://localhost:3000/auth/login?client_id=localhost_3001&client_secret=62bff1d304e523fee53f27b3790508fbe88522ea8ab82d6b12f18c0c986e7457&redirect_uri=http://localhost:3001/callback';
};

export const register = async (email: string, username: string, password: string, name: string) => {
  try {
    const res = await axios.post('/api/user/register?client_id=localhost_3001', { email, username, password, name });
    return res.data;
  } catch (error) {
    console.log({ message: 'Lỗi khi đăng ký' })
  }
};

export const fetchUserInfo = async (token: string) => {
  try {
    const res = await axios.get('/api/auth/userinfo', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const refreshToken = async () => {
  try {
    const sessionId = localStorage.getItem('session_id');
    if (!sessionId) throw new Error('Không tìm thấy session ID');

    const res = await axios.post('/api/auth/refresh', { session_id: sessionId });
    const { access_token, session_id: newSessionId } = res.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('session_id', newSessionId);
    return { access_token };
  } catch (error) {
    localStorage.clear();
    throw error;
  }
};
// export const checkSession = async (sessionId?: string) => {
//   try {
//     const sessionIdToUse = sessionId || localStorage.getItem('session_id');
//     if (!sessionIdToUse) throw new Error('Không tìm thấy session ID');

//     const res = await axios.post('/api/auth/check-session', {
//       client_id: 'client_b',
//       client_secret: 'secret_b',
//       session_id: sessionIdToUse,
//     });
//     const { access_token, session_id: newSessionId } = res.data;
//     localStorage.setItem('access_token', access_token);
//     localStorage.setItem('session_id', newSessionId);
//     return { access_token };
//   } catch (error) {
//     console.log({ message: 'Phiên không hợp lệ' })
//   }
// };

export const checkSession = async (sessionId?: string, tempToken?: string) => {
  try {
    if (tempToken) {
      const res = await axios.post('/api/auth/check-session', {
        client_id: 'localhost_3001',
        client_secret: '62bff1d304e523fee53f27b3790508fbe88522ea8ab82d6b12f18c0c986e7457',
        session_id: tempToken,
      });
      const { access_token, session_id: newSessionId } = res.data;
      localStorage.setItem('access_token', access_token);
      localStorage.setItem('session_id', newSessionId);
      return { access_token };
    }

    const sessionIdToUse = sessionId || localStorage.getItem('session_id');
    if (!sessionIdToUse) {
      throw new Error('Không tìm thấy session ID');
    }

    const res = await axios.post('/api/auth/check-session', {
      client_id: 'localhost_3001',
      client_secret: '62bff1d304e523fee53f27b3790508fbe88522ea8ab82d6b12f18c0c986e7457',
      session_id: sessionIdToUse,
    });
    const { access_token, session_id: newSessionId } = res.data;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('session_id', newSessionId);
    return { access_token };
  } catch (error) {
    console.log({ message: 'Phiên không hợp lệ' });
  }
};


export const logout = async () => {
  try {
    const sessionId = localStorage.getItem('session_id');
    if (sessionId) {
      await axios.post('/api/auth/logout', { session_id: sessionId });
    }
    localStorage.removeItem('access_token');
    localStorage.removeItem('session_id');
  } catch (error) {
    console.error('Lỗi khi đăng xuất:', error);
    throw error;
  }
};