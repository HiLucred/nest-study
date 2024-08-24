import { QuestionAttachmentsRepository } from '@/domain/forum/application/repositories/question-attachments-repository'
import { QuestionAttachment } from '@/domain/forum/enterprise/entities/question-attachment'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { PrismaQuestionAttachmentMapper } from '../mapppers/prisma-question-attachment-mapper'

@Injectable()
export class PrismaQuestionAttachmentsRepository
  implements QuestionAttachmentsRepository
{
  constructor(private prisma: PrismaService) {}

  async createMany(questionAttachment: QuestionAttachment[]): Promise<void> {
    if (questionAttachment.length === 0) return

    const data =
      PrismaQuestionAttachmentMapper.toPrismaUpdateMany(questionAttachment)

    await this.prisma.attachment.updateMany(data)
  }

  async deleteMany(questionAttachment: QuestionAttachment[]): Promise<void> {
    if (questionAttachment.length === 0) return

    const data =
      PrismaQuestionAttachmentMapper.toPrismaDeleteMany(questionAttachment)

    await this.prisma.attachment.deleteMany(data)
  }

  async deleteManyByQuestionId(questionId: string): Promise<void> {
    await this.prisma.attachment.deleteMany({
      where: {
        id: questionId,
      },
    })
  }

  async findManyByQuestionId(
    questionId: string,
  ): Promise<QuestionAttachment[]> {
    const answerAttachments = await this.prisma.attachment.findMany({
      where: {
        questionId,
      },
    })

    return answerAttachments.map((answerAttachment) =>
      PrismaQuestionAttachmentMapper.toDomain(answerAttachment),
    )
  }
}
