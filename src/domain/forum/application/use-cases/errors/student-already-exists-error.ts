import { UseCaseError } from '@/core/errors/use-case-error'

export class StudentAlreadyExistsError extends Error implements UseCaseError {
  constructor(suplier: string) {
    super(`Student ${suplier} already exists`)
  }
}
