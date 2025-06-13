import { CustomBaseEntity } from 'src/common/base.entitiy';
import { Column, Entity } from 'typeorm';

@Entity('user')
export class User extends CustomBaseEntity {
  @Column({
    nullable: false,
  })
  name: string;

  @Column({
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    nullable: false,
    unique: true,
  })
  phone: string;

  @Column({
    nullable: false,
  })
  password: string;

  @Column({
    nullable: false,
  })
  is_active: boolean;
}
