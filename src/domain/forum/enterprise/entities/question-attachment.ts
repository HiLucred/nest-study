import { UniqueEntityId } from '@/core/entities/unique-entity-id'
import { Entity } from '@/core/entities/entity'

export interface QuestionAttachmentProps {
  attachmentId: UniqueEntityId
  questionId: UniqueEntityId
}

export class QuestionAttachment extends Entity<QuestionAttachmentProps> {
  get attachmentId() {
    return this.props.attachmentId
  }

  get questionId() {
    return this.props.questionId
  }

  static create(props: QuestionAttachmentProps, id?: UniqueEntityId) {
    const attachment = new QuestionAttachment(props, id)

    return attachment
  }
}
