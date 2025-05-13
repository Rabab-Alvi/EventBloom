import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    // Retrieve from localStorage on page reload
    const storedUser = localStorage.getItem('user');
    return storedUser ? JSON.parse(storedUser) : null;
  });

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData));
  };

  const getUserid = async(userData)=> {
    try {
      const email=userData.email;
      const password=userData.password;
      const response = await fetch(`http://localhost:8080/api/user/${email}/${password}`);
      console.log("Fetch user got status:", response.status);
  
      if (!response.ok) {
        throw new Error(`User Not Found, response: ${response.status}`);
      }
  
      const userr = await response.json();
      console.log("Fetched user:", userr); // Debug log
      return (userr.id)
  
    } catch (error) {
      console.error("Error fetching user:", error.message);
      setError('Cannot find user');
    }
  
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, getUserid,logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);