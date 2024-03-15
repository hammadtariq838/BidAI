import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from "@/app/hooks";
import Navbar from '@/components/Navbar';
import { Card } from '@/components/ui/card';

const HomeScreen = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="flex flex-col mx-auto w-screen min-h-screen px-40">
      <Navbar />
      <Card className='flex grow w-full'>
        {
          user?.account.isAdmin ? (
            <embed src='https://eu.umami.is/share/aCix7F05Y6i36FEc/bidai.hammad-tariq.me' className='w-full' />
          ) : null
        }
      </Card>
    </div>
  );
};

export const Route = createFileRoute('/_protected/')({
  component: HomeScreen
})