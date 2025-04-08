// src/services/authService.js

// Session expiry time in milliseconds (10 minutes)
const SESSION_EXPIRY_TIME = 10 * 60 * 1000;

export const authService = {
  // Register new user
  registerUser: (userData) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    // Check if email already exists
    if (users.some(user => user.email === userData.email)) {
      throw new Error('Email already registered');
    }
    
    // Add new user
    const newUser = {
      id: Date.now().toString(),
      name: userData.name,
      email: userData.email,
      password: userData.password, // In a real app, encrypt this!
    };
    
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    
    return { success: true };
  },
  
  // Login user
  loginUser: (credentials) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(
      u => u.email === credentials.email && u.password === credentials.password
    );
    
    if (!user) {
      throw new Error('Invalid credentials');
    }
    
    // Create session
    const sessionExpiry = Date.now() + SESSION_EXPIRY_TIME;
    const session = {
      userId: user.id,
      expiry: sessionExpiry,
    };
    
    // Store session
    localStorage.setItem('session', JSON.stringify(session));
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return {
      user: userWithoutPassword,
      sessionExpiry
    };
  },
  
  // Check if session is valid
  checkSession: () => {
    const sessionData = localStorage.getItem('session');
    if (!sessionData) {
      return { isValid: false };
    }
    
    const session = JSON.parse(sessionData);
    if (Date.now() > session.expiry) {
      // Session expired
      localStorage.removeItem('session');
      return { isValid: false, expired: true };
    }
    
    // Session is valid - get user data
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.id === session.userId);
    
    if (!user) {
      localStorage.removeItem('session');
      return { isValid: false };
    }
    
    // Return user without password
    const { password, ...userWithoutPassword } = user;
    return {
      isValid: true,
      user: userWithoutPassword,
      sessionExpiry: session.expiry
    };
  },
  
  // Logout user
  logoutUser: () => {
    localStorage.removeItem('session');
    return { success: true };
  }
};