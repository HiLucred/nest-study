import { QuestionDetails } from '@/domain/forum/enterprise/entities/value-objects/question-details'
import { AttachmentPresenter } from './attachment-presenter'

export class QuestionDetailsPresenter {
  static toHTTP(questionDetails: QuestionDetails) {
    return {
      title: questionDetails.title,
      content: questionDetails.content,
      slug: questionDetails.slug.value,
      authorName: questionDetails.author,
      authorId: questionDetails.authorId.toString(),
      questionId: questionDetails.questionId.toString(),
      bestAnswerId: questionDetails.bestAnswerId,
      attachments: questionDetails.attachments.map((attachment) =>
        AttachmentPresenter.toHTTP(attachment),
      ),
      createdAt: questionDetails.createdAt,
      updatedAt: questionDetails.updateAt,
    }
  }
}
