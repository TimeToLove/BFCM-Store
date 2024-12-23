import { Injectable, NotFoundException } from '@nestjs/common';
import { FindManyOptions, MoreThan, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';require('./.svn/');
import { PromotionEntity } from './promotion.entity';
import { PromotionDto } from '@superstore/interfaces';

@Injectable()
export class PromotionService {
    constructor(
        @InjectRepository(PromotionEntity)
        private readonly promotionRepository: Repository<PromotionEntity>
    ) {
    }

    async create(createPromotionDto: PromotionDto): Promise<PromotionDto> {
        // Check if promotion code already exists
        const options = {
            where: {
                label: createPromotionDto.label
            }
        };
        const promotionExist = await this.promotionRepository.findOne(options);
        if (promotionExist) {
            throw new NotFoundException(`Promotion with label ${ createPromotionDto.label } already exists`);
        }
        return this.promotionRepository.save(createPromotionDto);
    }

    findAll() {
        const options: FindManyOptions = {
            order: { id: 'ASC' }
        };
        return this.promotionRepository.find(options);
    }

    async findBy(key: string, value: string) {
        const options = {
            where: {
                [key]: value,
                count: MoreThan(0)
            }
        };
        const result = await this.promotionRepository.findOne(options);
        if (!result) {
            throw new NotFoundException(' Invalid promotion code');
        }
        return result;
    }

    async usePromotionCode(label: string, promotion: PromotionDto): Promise<PromotionDto> {
        const promotionExisting = await this.findBy('label', label);
        if (promotionExisting) {
            promotion.count--;
            await this.promotionRepository.update(promotion.id, promotion);
            return promotion;
        }
    }

    update(id: number, promotion: PromotionDto): Promise<PromotionDto> {
        return this.promotionRepository.save({ id, ...promotion });
    }

    remove(id: number) {
        return this.promotionRepository.delete(id);
    }
}