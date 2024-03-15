import { createFileRoute } from '@tanstack/react-router'
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';

const HomeScreen = () => {

  return (
    <div className="flex flex-col mx-auto w-screen min-h-screen px-40">
      <Navbar />
      <Card className='flex grow w-full'>
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/_protected/')({
  component: HomeScreen
})