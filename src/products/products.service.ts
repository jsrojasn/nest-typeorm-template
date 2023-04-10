import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/auth/entities/user.entity';
import { Repository } from 'typeorm';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) { }

  async create(createProductDto: CreateProductDto, user: User) {
    const product = this.productRepository.create({ ...createProductDto, user })
    await this.productRepository.save(product)
    return { ...product };
  }

  async findAll(user: User) {
    const products = await this.productRepository.find({ relations: { user: true }, where: { user: { id: user.id } } });
    return products
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({ id });
    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.productRepository.findOne({
      where: { id }
    });

    return this.productRepository.save({
      ...product,
      ...updateProductDto
    });
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.remove(product);
  }
}
