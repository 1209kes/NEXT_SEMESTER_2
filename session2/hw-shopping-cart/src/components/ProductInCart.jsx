import React, { useContext } from "react";
import styled from "@emotion/styled";
import { Button } from "./Button";
import { useRouter } from "next/router"; // useRouter로 대체
import { PAGE } from "../constants/common";
import { Box } from "../styles/StyleComponent";
import { CartContext } from "../context/CartContext"; // CartContext에서 전역 상태 가져오기

export const ProductInCart = ({ product, ...rest }) => {
  const router = useRouter();
  const { cart, setCart } = useContext(CartContext); // useContext로 전역 상태 가져오기

  const handleRemove = (product) => {
    const newCart = cart.filter((item) => item.id !== product.id);
    setCart(newCart); // 전역 상태 업데이트
  };

  const handleViewProduct = () => {
    router.push(`${PAGE.PRODUCT}/${product.id}`); // navigate 대신 router.push 사용
  };

  return (
    <Item {...rest}>
      <Box gap={6}>
        <Name
          dangerouslySetInnerHTML={{
            __html: product.name.replace(/\\n/g, "<br/>"),
          }}
        />
        <Description>{product.description}</Description>
      </Box>
      <Box gap={4} style={{ width: "fit-content" }}>
        <Button onClick={handleViewProduct}>제품 설명 보기</Button>
        <Button onClick={() => handleRemove(product)}>제거하기</Button>
      </Box>
    </Item>
  );
};

const Item = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: flex-start;
  align-items: center;
  gap: 20px;
  scroll-snap-align: start;
  box-shadow: 0px 0px 16px 0px rgba(0, 0, 0, 0.12);
  border-radius: 6px;
  overflow: hidden;
  padding: 16px;
  cursor: pointer;
`;

const Name = styled.div`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 20px;
  font-weight: 550;
  line-height: 135%;
  color: black;
  text-align: start;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
  background: linear-gradient(to bottom, pink 70%, transparent 60%);
  background-size: 100% 40%;
  background-repeat: no-repeat;
  background-position: 0 100%; /* Bottom alignment */
`;

const Description = styled.div`
  font-family: "Pretendard Variable", sans-serif;
  font-size: 15px;
  font-weight: 500;
  line-height: 160%;
  color: gray;
  text-align: start;
  word-break: break-all;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;