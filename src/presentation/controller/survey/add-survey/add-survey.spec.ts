import { type Validation, type HttpRequest } from './protocols'
import { AddSurveyController } from './add-survey'

const makeFakeRequest = (override?: Partial<HttpRequest>): HttpRequest => ({
  body: {
    question: 'any_question',
    answers: [{
      image: 'any_image',
      answer: 'any_answer'
    }],
    ...override?.body
  }
})

describe('AdSurvey Controller', () => {
  it('should call Validation with correct values', async () => {
    class ValidationStub implements Validation {
      validate (input: Record<string, unknown>): Error | undefined {
        return undefined
      }
    }
    const validationStub = new ValidationStub()
    const sut = new AddSurveyController(validationStub)
    const validateSpy = jest.spyOn(validationStub, 'validate')

    const httpRequest = makeFakeRequest()

    await sut.handle(httpRequest)

    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })
})
