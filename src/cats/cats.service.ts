import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { CreateCatDto } from './dto/create-cat.dto';
import { UpdateCatDto } from './dto/update-cat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Cat } from './entities/cat.entity';
import { Repository } from 'typeorm';
import { Breed } from 'src/breeds/entities/breed.entity';
import { ActiveUserInterface } from 'src/common/interface/active-user.interface';
import { Role } from 'src/common/enum/roles.enum';

@Injectable()
export class CatsService {

  constructor(
    @InjectRepository(Cat)
    private catsRepository: Repository<Cat>,

    @InjectRepository(Breed)
    private breedsRepository: Repository<Breed>,
  ) {}
  
  async create(createCatDto: CreateCatDto, user : ActiveUserInterface) {
    const breed = await this.validateBreed(createCatDto.breed);

    if (!breed) {
      throw new BadRequestException('Breed not found');
    }

    const cat = this.catsRepository.create({
      name: createCatDto.name,
      age: createCatDto.age,
      breed,
      userEmail : user.email,
    });
    return await this.catsRepository.save(cat);
  }

  async findAll( user : ActiveUserInterface ) {
    if (user.role === Role.ADMIN) {
      return await this.catsRepository.find();
    }
    let catsfounded  = await this.catsRepository.find({
      where : { userEmail :  user.email}
    })
    return  (catsfounded.length == 0) ? 'Sin gatos' : catsfounded; 
  }

  async findOne(id: number, user : ActiveUserInterface) {
   let cat =  await this.catsRepository.findOneBy({ id })

   if (!cat) {
    throw new BadRequestException("Gato no encontrado en base de datos");
   }
   this.validateOwnership(cat , user);
   return cat;
  }

  async update(id: number, updateCatDto: UpdateCatDto, user : ActiveUserInterface) {
    await this.findOne(id, user );
    return await this.catsRepository.update(id, {
      ...updateCatDto,
      breed: updateCatDto.breed ? await this.validateBreed(updateCatDto.breed) : undefined,
      userEmail: user.email,
    })
  }

  async remove(id: number, user : ActiveUserInterface) {
    this.findOne(id, user)
    return await this.catsRepository.softDelete(id);
  }

  private validateOwnership(cat: Cat, user: ActiveUserInterface) {
    if (user.role !== Role.ADMIN && cat.userEmail !== user.email) {
      throw new UnauthorizedException();
    }
  }

  private async validateBreed(breed: string) {
    const breedEntity = await this.breedsRepository.findOneBy({ name: breed });
  
    if (!breedEntity) {
      throw new BadRequestException('Breed not found');
    }
  
    return breedEntity;
  }
}
