import { Body, Controller, Get, Param, Post, ParseIntPipe } from '@nestjs/common';
import { CreateCatDto } from './dto';
import { CatsService } from './cats.service';
import { Cat } from './interfaces/cat.interface';


@Controller('cats')
export class CatsController {
    constructor(private catsService: CatsService) {}

    @Post()
    async create(@Body() createCatDto: CreateCatDto) {
        this.catsService.create(createCatDto);
    }

    @Get()
    async findAll(): Promise<Cat[]> {
        return this.catsService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id', new ParseIntPipe())
            id: number,
    ) {
        // get by ID logic
    }
}
