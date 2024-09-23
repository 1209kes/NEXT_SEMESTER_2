// pages/_app.js

import '../styles/reset.css'; // CSS 리셋 파일
import '../styles/fonts.css'; // 폰트 설정 파일
import '../styles/index.css'; // 메인 스타일 파일
import '../../src/styles/StyleComponent'; // 스타일 컴포넌트 임포트
import { CartProvider } from '../context/CartContext'; // CartContext 적용

function MyApp({ Component, pageProps }) {
    return (
        <CartProvider>
            <Component {...pageProps} />
        </CartProvider>
    );
}

export default MyApp;
