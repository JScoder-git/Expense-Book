const SESSION_EXPIRY_TIME = 10 * 60 * 1000; // 10 minutes

export const authService = {
  registerUser: (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already registered');
    }
    
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password,
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true };
  },
  
  loginUser: (credentials) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    const sessionExpiry = Date.now() + SESSION_EXPIRY_TIME;
    const session = {
      userId: user.id,
      expiry: sessionExpiry,
    };
    
    localStorage.setItem('session', JSON.stringify(session));
    
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      sessionExpiry
    };
  },
  
  checkSession: () => {
    const sessionData = localStorage.getItem('session');
    if (!sessionData) {
      return { isValid: false };
    }
    
    const session = JSON.parse(sessionData);
    if (Date.now() > session.expiry) {
      localStorage.removeItem('session');
      return { isValid: false, expired: true };
    }
    
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === session.userId);
    
    if (!user) {
      localStorage.removeItem('session');
      return { isValid: false };
    }
    
    const { password, ...userWithoutPassword } = user;
    return {
      isValid: true,
      user: userWithoutPassword,
      sessionExpiry: session.expiry
    };
  },
  
  logoutUser: () => {
    localStorage.removeItem('session');
    return { success: true };
  }
};