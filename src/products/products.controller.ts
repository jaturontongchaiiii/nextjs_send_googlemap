import { Controller, Get } from '@nestjs/common';
import { ProductDTO } from 'src/dto/product.dto';

@Controller('products')
export class ProductsController {

    @Get()
    getProductAll(): ProductDTO[] {
        return [
            { name: 'Mango', id: 1, price: 250},
            { name: 'Apple', id: 2, price: 250},
            { name: 'Banana', id: 3, price: 250},
        ]
    }
}
