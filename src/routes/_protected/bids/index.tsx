import { Link, createFileRoute } from '@tanstack/react-router'
import { LayoutGrid, List } from 'lucide-react';
import { useGetTendersQuery } from '@/services/tender/tenderApiSlice';
import { Fragment } from 'react';
import { Tender } from '@/types/primitive.type';
import Loader from '@/components/Loader';

const Screen = () => {
  const {
    bidder,
    county,
    tender_type,
    budget_min,
    budget_max,
  } = Route.useSearch();
  const { data: tendersData, isLoading } = useGetTendersQuery({
    county,
    tender_type,
    bidder,
    budget_min: budget_min?.toString(),
    budget_max: budget_max?.toString(),
  });
  const tenders = tendersData?.tenders || [];
  return (
    <main className='bg-white grow rounded-t-lg px-10 py-3 pb-10'>
      {
        isLoading ? (
          <div className='min-h-screen flex items-center justify-center'>
            <Loader className='w-10 h-10' />
          </div>
        )
          : (
            <div className='flex flex-col gap-11'>
              <div className="flex items-center justify-between">
                <span>
                  {tenders.length}
                  {' '}
                  results returned</span>
                <div className="flex gap-4">
                  <LayoutGrid size={24} className='cursor-pointer' />
                  <List size={24} className='cursor-pointer' />
                </div>
              </div>
              <div className="flex flex-col gap-6">
                {
                  tenders.map((tender) => (
                    <Fragment key={tender.tender_id}>
                      <Link to={'./$id'} params={{ id: tender._id }}>
                        <TenderItem tender={tender} />
                      </Link>
                    </Fragment>
                  ))
                }
              </div>
            </div>
          )
      }
    </main>

  )
}


function TenderItem(
  { tender }: {
    tender: Omit<Tender, 'items'>;
  }
) {
  return (
    <div className='flex flex-col h-[155px] w-[815px] border rounded divide-y-1 shadow'>
      <div className=' grow flex items-center divide-x-1'>
        <div className='flex items-center w-2/5 h-full px-4'>
          <h3 className='font-semibold text-2xl'>
            TENDER ID - {tender.tender_id}
          </h3>
        </div>
        <div className="flex items-center w-3/5 h-full px-4">
          <p>
            {/* the first bidder name in the list */}
            <span className='font-semibold'>Contractor:</span>
            {' '}
            {tender.bidders[0].name}
          </p>
        </div>
      </div>
      <div className="flex flex-col h-[97px] divide-y-1">
        <div className='h-[38px] flex items-center bg-[#F9FAFB] font-medium'>
          <span className="w-2/12 px-4">Project Type</span>
          <span className="w-3/12 px-4">Department</span>
          <span className="w-3/12 px-4">Budget</span>
          <span className="w-2/12 px-4">County</span>
          <span className="w-2/12 px-4">Project ID</span>
        </div>
        <div className='grow flex items-center divide-x-1'>
          <div className='flex items-center w-2/5 h-full px-4'>
            <span className='line-clamp-2'>
              {tender.project_type.join(', ')}
            </span>
          </div>
          <div className='flex items-center w-3/5 h-full px-4'>
            <span>
              {tender.department}
            </span>
          </div>
          <div className='flex items-center w-3/5 h-full px-4'>
            <span>
              {tender.budget}
            </span>
          </div>
          <div className='flex items-center w-2/5 h-full px-4'>
            <span>
              {tender.county.join(', ')}
            </span>
          </div>
          <div className='flex items-center w-2/5 h-full px-4'>
            <span>
              {tender.tender_id}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_protected/bids/')({
  component: Screen
})