import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { ValueObject } from '@/core/entities/value-object'
import { Slug } from './slug'
import { Attachment } from '../attachment'

interface QuestionDetailsProps {
  authorId: UniqueEntityId
  questionId: UniqueEntityId
  author: string
  bestAnswerId: UniqueEntityId | null
  title: string
  slug: Slug
  content: string
  attachments: Attachment[]
  createdAt: Date
  updateAt?: Date | null
}

export class QuestionDetails extends ValueObject<QuestionDetailsProps> {
  get authorId() {
    return this.props.authorId
  }

  get questionId() {
    return this.props.questionId
  }

  get author() {
    return this.props.author
  }

  get bestAnswerId() {
    return this.props.bestAnswerId
  }

  get title() {
    return this.props.title
  }

  get slug() {
    return this.props.slug
  }

  get content() {
    return this.props.content
  }

  get attachments() {
    return this.props.attachments
  }

  get createdAt() {
    return this.props.createdAt
  }

  get updateAt() {
    return this.props.updateAt
  }

  static create(props: QuestionDetailsProps) {
    return new QuestionDetails(props)
  }
}
