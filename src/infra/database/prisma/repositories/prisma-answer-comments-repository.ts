import { PaginationParams } from '@/core/repositories/pagination-params'
import { AnswerCommentsRepository } from '@/domain/forum/application/repositories/answer-comments-repository'
import { AnswerComment } from '@/domain/forum/enterprise/entities/answer-comment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaAnswerCommentMapper } from '../mapppers/prisma-answer-comment-mapper'

@Injectable()
export class PrismaAnswerCommentsRepository
  implements AnswerCommentsRepository
{
  constructor(private prisma: PrismaService) {}

  async create(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.create({
      data,
    })
  }

  async delete(answerComment: AnswerComment): Promise<void> {
    const data = PrismaAnswerCommentMapper.toPrisma(answerComment)

    await this.prisma.comment.delete({
      where: {
        id: data.id,
      },
    })
  }

  async findById(answerCommentId: string): Promise<AnswerComment | null> {
    const answerComment = await this.prisma.comment.findUnique({
      where: {
        id: answerCommentId,
      },
    })

    if (!answerComment) {
      return null
    }

    return PrismaAnswerCommentMapper.toDomain(answerComment)
  }

  async findManyByAnswerId(
    answerId: string,
    { page }: PaginationParams,
  ): Promise<AnswerComment[]> {
    const answerComments = await this.prisma.comment.findMany({
      where: {
        id: answerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 20,
      skip: (page - 1) * 20,
    })

    return answerComments.map((questionComment) =>
      PrismaAnswerCommentMapper.toDomain(questionComment),
    )
  }
}
