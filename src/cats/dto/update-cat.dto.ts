import { PartialType } from '@nestjs/mapped-types';
import { CreateCatDto } from './create-cat.dto';

export class UpdateCatDto extends PartialType(CreateCatDto) {}
//el partial es como una instanciacion de la clase referencia en este caso coloca todos los atributos del dto create como opcionales en el dto updte