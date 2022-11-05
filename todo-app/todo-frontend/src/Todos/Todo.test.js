import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import Todo from './Todo'

describe('Single <Todo/> component', () => {
  test('it should render todo items', () => {
    const todo = {
      text: 'Write code',
      done: true,
    }

    const todoComponent = render(
      <Todo todo={todo} onClickComplete={() => {}} onClickDelete={() => {}} />
    )
    expect(screen.getByText('Write code')).toBeDefined()
    expect(todoComponent.container).not.toContain('learn about containers')
  })
})
