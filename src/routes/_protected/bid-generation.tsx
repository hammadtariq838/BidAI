import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/bid-generation')({
  component: () => <div>Hello /_protected/bid-generation!</div>
})