import { Controller, DefaultValuePipe, Get, ParseIntPipe, Query } from "@nestjs/common";
import { BooksService } from "./books.service";

@Controller("books/search")
export class BookSearchAndFilterController {

    constructor(private readonly booksService: BooksService) { }

    // Search books by title, author, or category
    // Filter books by price range 
    @Get()
    search(
        @Query('title') title: string,
        @Query('author') author: string,
        @Query('categories') categories: string[],
        @Query('skip', new DefaultValuePipe(0), ParseIntPipe) skip: number,
        @Query('take', new DefaultValuePipe(10), ParseIntPipe) take: number,
        @Query('minPrice', new DefaultValuePipe(0), ParseIntPipe) minPrice: number,
        @Query('maxPrice', new DefaultValuePipe(0), ParseIntPipe) maxPrice: number,
    ) {
        if (typeof categories === 'string') {
            categories = [categories]
        }
        return this.booksService.search(skip, take, title, author, categories, minPrice, maxPrice)

    }

}