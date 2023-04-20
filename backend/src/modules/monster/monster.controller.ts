import { Body, Controller, Delete, Get, NotFoundException, Patch, Post } from '@nestjs/common';
import { MonsterService } from './monster.service';
import { MonsterEntity } from './entity/monster.entity';
import { Roles } from '../common/decoratos/roles.decorator';
import { Role } from '../common/decoratos/role.enum';
import { CreateMonsterDto, UpdateMonsterDTO } from './dto';

@Controller('monster')
export class MonsterController {
  constructor(private monsterService: MonsterService) {}

  @Roles(Role.Admin, Role.User)
  @Get()
  findAll(): Promise<MonsterEntity[]> {
    return this.monsterService.findAll();
  }

  @Roles(Role.Admin)
  @Post()
  create(@Body() createMonsterDto: CreateMonsterDto): Promise<MonsterEntity> {
    const monster = MonsterEntity.fromCreateMonsterDTO(createMonsterDto);

    return this.monsterService.create(monster);
  }

  @Roles(Role.Admin)
  @Patch()
  async update(@Body() updateMonsterDto: UpdateMonsterDTO): Promise<MonsterEntity> {
    const monster = MonsterEntity.fromUpdateMonsterDTO(updateMonsterDto);
    const updatedMonster = await this.monsterService.update(monster);

    if (updatedMonster === null) {
      throw new NotFoundException('Monster doesnt exist, review the monster id.');
    }

    return updatedMonster;
  }

  @Roles(Role.Admin)
  @Delete()
  delete(@Body() monsterId: string): Promise<MonsterEntity> {
    return this.monsterService.remove(monsterId);
  }
}
