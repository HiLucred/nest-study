import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { QuestionComment } from '../../enterprise/entities/question-comment'
import { QuestionCommentsRepository } from '../repositories/question-comments-repository'
import { Either, right } from '@/core/either'

interface CommentOnQuestionUseCaseRequest {
  questionId: string
  authorId: string
  content: string
}

type CommentOnQuestionUseCaseResponse = Either<
  null,
  {
    questionComment: QuestionComment
  }
>

export class CommentOnQuestionUseCase {
  constructor(private questionCommentRepository: QuestionCommentsRepository) {}

  async execute({
    questionId,
    authorId,
    content,
  }: CommentOnQuestionUseCaseRequest): Promise<CommentOnQuestionUseCaseResponse> {
    const questionComment = QuestionComment.create({
      questionId: new UniqueEntityId(questionId),
      authorId: new UniqueEntityId(authorId),
      content,
    })

    await this.questionCommentRepository.create(questionComment)

    return right({ questionComment })
  }
}
