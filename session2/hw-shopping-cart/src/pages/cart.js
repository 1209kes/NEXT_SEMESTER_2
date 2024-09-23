import React, { useContext, useEffect, useState } from "react";
import styled from "@emotion/styled";
import { GNB } from "../components/GNB";
import { GNB_TYPE } from "../constants/common";
import { ProductInCart } from "../components/ProductInCart";
import { Box } from "../styles/StyleComponent"; // Box 컴포넌트가 정의된 경로
import { CartContext } from "../context/CartContext";

function CartPage() {
  const { cart } = useContext(CartContext);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      setIsMounted(true);
    }
  }, []);

  useEffect(() => {
    // Box 요소와 cart 데이터가 제대로 불러와졌는지 확인
    console.log('Box 컴포넌트:', Box);
    console.log('장바구니 데이터:', cart);
  }, [cart]);

  if (!isMounted) {
    return <div>로딩 중...</div>;
  }

  return (
    <Base>
      <GNB type={GNB_TYPE.MAIN} />
      <Inner>
        <Box gap={30}>
          {cart.length === 0 ? (
            <p>장바구니가 비어 있습니다.</p>
          ) : (
            cart.map((product, id) => (
              <ProductInCart key={id} product={product} />
            ))
          )}
        </Box>
      </Inner>
    </Base>
  );
}

export default CartPage;

const Base = styled.div`
  width: 100%;
`;
const Inner = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 72px 20px 69px;
`;
const Text = styled.div`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 20px;
  font-weight: 550;
  line-height: 135%;
  text-align: center;
  color: #717171;

  width: 100%;
  margin-top: 60px;
`;

