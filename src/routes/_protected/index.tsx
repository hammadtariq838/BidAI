import Navbar from "@/components/Navbar"
import { createFileRoute } from "@tanstack/react-router"

const Screen = () => {
  return (
    <Navbar />
  )
}

export const Route = createFileRoute('/_protected/')({
  component: Screen
})