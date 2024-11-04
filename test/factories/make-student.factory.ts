import { UniqueEntityID } from '@/core/entities/value-objects/unique-entity-id'
import {
  Student,
  StudentProps,
} from '@/domain/forum/enterprise/entities/student.entity'
import { faker } from '@faker-js/faker'

export function makeStudentFactory(
  override: Partial<StudentProps> = {},
  id?: UniqueEntityID,
) {
  const student = Student.create(
    {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password: faker.internet.password(),
      ...override,
    },
    id,
  )

  return student
}
