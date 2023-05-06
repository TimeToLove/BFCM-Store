import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
} from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from '@superstore/libs';
import { ProductDto } from '@superstore/libs';

@Controller('product')
export class ProductController {
    constructor(private readonly productService: ProductService) {
    }

    @Post()
    create(@Body() createProductDto: CreateProductDto) {
        return this.productService.create(createProductDto);
    }

    @Get()
    findAll(
        @Query('page') page = '1',
        @Query('limit') limit = '10',
    ) {
        const pagination = {
            page: parseInt(page, 10),
            limit: parseInt(limit, 10),
        };

        return this.productService.findAll(pagination);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.productService.findOne(+id);
    }

    @Get('slug/:id')
    findBySlug(@Param('id') slug: string) {
        return this.productService.findBySlug(slug);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProductDto: ProductDto) {
        return this.productService.update(+id, updateProductDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.productService.remove(+id);
    }
}
