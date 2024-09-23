import React, { createContext, useState, useEffect } from "react";

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // 컴포넌트가 마운트된 후 로컬 스토리지에서 장바구니 데이터를 불러옴
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 로컬 스토리지에서 데이터 가져오기
      const savedCart = localStorage.getItem("cart");
      if (savedCart) {
        setCart(JSON.parse(savedCart)); // JSON 데이터를 상태로 변환
      }
    }
  }, []);

  // cart 상태가 변경될 때마다 로컬 스토리지에 저장
  useEffect(() => {
    if (typeof window !== "undefined") {
      // 로컬 스토리지에 데이터 저장
      localStorage.setItem("cart", JSON.stringify(cart));
    }
  }, [cart]);

  return (
    <CartContext.Provider value={{ cart, setCart }}>
      {children}
    </CartContext.Provider>
  );
};
