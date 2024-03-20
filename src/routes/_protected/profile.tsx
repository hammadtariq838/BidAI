import { createFileRoute } from '@tanstack/react-router'
import { useAppSelector } from "@/app/hooks";
import Navbar from '@/components/Navbar';

const HomeScreen = () => {
  const { user } = useAppSelector((state) => state.auth);

  return (
    <div className="mx-auto w-screen min-h-screen">
      <Navbar />
      <div>
        <main>
          <h2 className="text-center">Protected Route!</h2>
          <pre>
            <code>
              {JSON.stringify(user, null, 2)}
            </code>
          </pre>
        </main>
      </div>
    </div>
  );
};

export const Route = createFileRoute('/_protected/profile')({
  component: HomeScreen
})