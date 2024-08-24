import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { CommentWithAuthor } from '@/domain/forum/enterprise/entities/value-objects/comment-with-author'
import { Comment as PrismaComment, User as PrismaUser } from '@prisma/client'

type PrismaCommentWithAuthor = PrismaComment & {
  author: PrismaUser
}

export class PrismaCommentWithAuthorMapper {
  static toDomain(prismaCommentWithAuthor: PrismaCommentWithAuthor) {
    return CommentWithAuthor.create({
      author: prismaCommentWithAuthor.author.name,
      authorId: new UniqueEntityId(prismaCommentWithAuthor.authorId),
      commentId: new UniqueEntityId(prismaCommentWithAuthor.id),
      content: prismaCommentWithAuthor.content,
      createdAt: prismaCommentWithAuthor.createdAt,
      updatedAt: prismaCommentWithAuthor.updateAt,
    })
  }
}
