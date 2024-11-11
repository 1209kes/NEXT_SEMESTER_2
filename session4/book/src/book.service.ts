import { BookDto } from './book.model'; // 게시글 타입 정보 임포트

export class BookService {
    books = []; // 게시글 배열 선언

    getAllPosts() { // 모든 책 가져오기
        return this.books;
    }

    createPost(bookDto: BookDto) { //책 추가
        const id = this.books.length + 1;
        this.books.push({ id: id.toString(), ...bookDto, createdDt: new Date()}); 
        // 현재 시간 자동 설정
    }
    
    getbook(id) { //책 조회
        const book = this.books.find((book) => {
            return book.id === id;
        });
        console.log(book);
        return book;
    }
    
    delete(id) { //책 삭제
        const filteredbooks = this.books.filter((book) => book.id !== id);
        this.books = [...filteredbooks];
    }
    
    updatebook(id, bookDto: BookDto) { //책 업데이트
        let updateIndex = this.books.findIndex((book) => book.id === id);
        const updatebook = { id, ...bookDto, updatedDt: new Date() };
        this.books[updateIndex] = updatebook;
        return updatebook;
    }
    //findindex를 사용해 인덱스를 찾고 해당 값을 updatePost를 통해 업데이트함
}