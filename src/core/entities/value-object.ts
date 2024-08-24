export class ValueObject<Props> {
  protected props: Props

  protected constructor(props: Props) {
    this.props = props
  }

  equals(vo: ValueObject<unknown>) {
    if (vo === undefined || vo === null) return false

    if (vo.props === undefined) return false

    return JSON.stringify(this.props) === JSON.stringify(vo.props)
  }
}
