import { AttachmentsRepository } from '@/domain/forum/application/repositories/attachments-repository'
import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma.service'
import { Attachment } from '@/domain/forum/enterprise/entities/attachment'
import { PrismaAttachmentMapper } from '../mapppers/prisma-attachment-mapper'

@Injectable()
export class PrismaAttachmentsRepository implements AttachmentsRepository {
  constructor(private prisma: PrismaService) {}

  async create(attachment: Attachment): Promise<void> {
    await this.prisma.attachment.create({
      data: PrismaAttachmentMapper.toPrisma(attachment),
    })
  }
}
