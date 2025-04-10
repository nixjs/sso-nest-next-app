import axios from 'axios';

export const login = () => {
  window.location.href = 'http://localhost:3000/auth/login?client_id=localhost_3002&client_secret=08e3947a869b9cffb1f558b575726720f3821b2e21ed444ce23dc6ef503337e7&redirect_uri=http://localhost:3002/callback';
};

export const register = async (email: string, username: string, password: string, name: string) => {
  try {
    const res = await axios.post('/api/user/register?client_id=localhost_3002', { email, username, password, name });
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

// export const refreshToken = async () => {
//   try {
//     const res = await axios.post('/api/auth/refresh', {});
//     const { access_token } = res.data;
//     localStorage.setItem('access_token', access_token);
//     return { access_token };
//   } catch (error) {
//     localStorage.clear();
//     throw error;
//   }
// };

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

export const checkSession = async (sessionId?: string, tempToken?: string) => {
  try {
    if (tempToken) {
      const res = await axios.post('/api/auth/check-session', {
        client_id: 'localhost_3002',
        client_secret: '08e3947a869b9cffb1f558b575726720f3821b2e21ed444ce23dc6ef503337e7',
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
      client_id: 'localhost_3002',
      client_secret: '08e3947a869b9cffb1f558b575726720f3821b2e21ed444ce23dc6ef503337e7',
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

// export const checkSession = async (sessionId?: string, tempToken?: string) => {
//   try {
//     if (tempToken) {
//       // Nếu có temp_token, sử dụng nó để lấy session_id
//       const res = await axios.post('/api/auth/check-session', {
//         client_id: 'localhost_3002',
//         client_secret: '08e3947a869b9cffb1f558b575726720f3821b2e21ed444ce23dc6ef503337e7',
//         session_id: tempToken,
//       });
//       const { access_token, session_id: newSessionId } = res.data;
//       localStorage.setItem('access_token', access_token);
//       localStorage.setItem('session_id', newSessionId);
//       return { access_token };
//     }

//     const sessionIdToUse = sessionId || localStorage.getItem('session_id');
//     if (!sessionIdToUse) {
//       // Nếu không có session_id, chuyển hướng đến Authentication Server
//       window.location.href = `http://localhost:3000/auth/check-session-with-cookie?client_id=localhost_3002&client_secret=08e3947a869b9cffb1f558b575726720f3821b2e21ed444ce23dc6ef503337e7&redirect_uri=http://localhost:3002/callback`;
//       return;
//     }

//     const res = await axios.post('/api/auth/check-session', {
//       client_id: 'localhost_3002',
//       client_secret: '08e3947a869b9cffb1f558b575726720f3821b2e21ed444ce23dc6ef503337e7',
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