import { Either, left, right } from './either'

function doSomething(shouldSuccess: boolean): Either<string, number> {
  if (shouldSuccess) {
    return right(3)
  } else {
    return left('error')
  }
}

describe('Either', () => {
  test('success result', () => {
    const success = doSomething(true)

    if (success.isLeft()) {
      return success.value
    }

    expect(success.isLeft()).toEqual(false)
    expect(success.isRight()).toEqual(true)
  })

  test('error result', () => {
    const error = doSomething(false)

    expect(error.isLeft()).toEqual(true)
    expect(error.isRight()).toEqual(false)
  })
})
