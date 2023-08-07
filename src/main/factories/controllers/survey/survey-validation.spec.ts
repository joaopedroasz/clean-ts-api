import { RequiredFieldValidation, ValidationComposite } from '@/validation/validators'
import { makeSurveyValidation } from './survey-validation'

jest.mock('@/validation/validators/validation-composite')

describe('SignUpValidation Factory', () => {
  it('should call ValidationComposite with all validations', () => {
    const result = makeSurveyValidation()

    expect(result).toBeTruthy()
    expect(ValidationComposite).toHaveBeenCalledWith([
      new RequiredFieldValidation('question'),
      new RequiredFieldValidation('answers')
    ])
  })
})
