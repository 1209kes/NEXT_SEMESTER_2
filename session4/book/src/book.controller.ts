import {Controller, Param, Body, Delete, Get, Post, Put} from '@nestjs/common';
import { BookService } from './book.service'; //블로그 서비스 임포트

@Controller('book')
export class BookController {
    bookService: BookService
    constructor() {
        this.bookService = new BookService(); // 생성자(constructor)에서 블로그 서비스 생성
    }

    @Get()
    getAllPosts() { // 모든 게시글 가져오기
        console.log('모든 게시글 가져오기');
        return this.bookService.getAllPosts();
    }

    @Post()
    createPost(@Body() postDto) { //게시글 작성
        console.log('게시글 작성');
        this.bookService.createPost(postDto);
        return 'success';
    }

    @Get('/:id')
    getPost(@Param('id') id:string) { //게시글 하나 읽기
        console.log(['게시글 하나 가져오기']);
        return this.bookService.getbook(id);
    }

    @Delete('/:id')
    deletePost(@Param('id') id:string) { //게시글 삭제
        console.log('게시글 삭제');
        this.bookService.delete(id);
        return 'success';
    }

    @Put('/:id')
    updatePost(@Param('id') id: string, @Body() postDto) { //게시글 업데이트
        console.log('게시글 업데이트', id, postDto);
        return this.bookService.updatebook(id, postDto);
    }
}