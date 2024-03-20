import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_protected/bid-comparison')({
  component: () => <div>Hello /_protected/bid-comparison!</div>
})