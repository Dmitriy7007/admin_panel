import { Injectable, NotFoundException } from '@nestjs/common';
import { hash } from 'argon2';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto, UpdateUserDto } from './dto/create-user.dto';
import { isHasMorePagination } from 'src/base/pagination/is-has-more';
import { PaginationArgsWithSearchTerm } from 'src/base/pagination/pagination.args';
import { UserResponse } from './user.response';
import { Prisma } from '@prisma/client';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async findById(id: number) {
    const user = this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findByEmail(email: string) {
    const user = this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findAll(args?: PaginationArgsWithSearchTerm): Promise<UserResponse> {
    const searchTermQuery = args?.searchTerm
      ? this.getSearchTermFilter(args?.searchTerm)
      : {};

    const users = await this.prisma.user.findMany({
      where: searchTermQuery,
      skip: +args?.skip,
      take: +args?.take,
    });

    const totalCount = await this.prisma.user.count({
      where: searchTermQuery,
    });

    const isHasMore = isHasMorePagination(totalCount, +args?.skip, +args?.take);
    return {
      items: users,
      isHasMore,
    };
  }

  // async findAll() {
  //   const users = await this.prisma.user.findMany();

  //   return {
  //     items: users,
  //   };
  // }

  async create({ password, ...dto }: CreateUserDto) {
    const user = {
      ...dto,
      password: await hash(password),
    };

    return this.prisma.user.create({ data: user });
  }

  async update(id: number, { password, ...dto }: UpdateUserDto) {
    await this.findById(id);
    const hashedPassword = password ? { password: await hash(password) } : {};

    return this.prisma.user.update({
      where: { id },
      data: {
        ...dto,
        ...hashedPassword,
      },
    });
  }

  async delete(id: number) {
    await this.findById(id);
    return this.prisma.user.delete({ where: { id } });
  }

  private getSearchTermFilter(searchTerm: string): Prisma.UserWhereInput {
    return {
      OR: [
        { email: { contains: searchTerm, mode: 'insensitive' } },
        { name: { contains: searchTerm, mode: 'insensitive' } },
        {
          country: { contains: searchTerm, mode: 'insensitive' },
        },
      ],
    };
  }
}
