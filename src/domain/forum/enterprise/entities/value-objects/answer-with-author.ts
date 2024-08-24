import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'

interface AnswerWithAuthorProps {
  authorId: UniqueEntityId
  author: string
  questionId: UniqueEntityId
  content: string
  createdAt: Date
  updateAt?: Date | null
}

export class AnswerWithAuthor extends ValueObject<AnswerWithAuthorProps> {
  get authorId() {
    return this.props.authorId
  }

  get author() {
    return this.props.author
  }

  get questionId() {
    return this.props.questionId
  }

  get content() {
    return this.props.content
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updateAt() {
    return this.props.updateAt
  }

  static create(props: AnswerWithAuthorProps) {
    return new AnswerWithAuthor(props)
  }
}
