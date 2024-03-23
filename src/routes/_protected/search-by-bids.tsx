import { Link, createFileRoute, useNavigate } from '@tanstack/react-router'
import Navbar from '@/components/Navbar';
import { Separator } from '@/components/ui/separator';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { LayoutGrid, List } from 'lucide-react';
import { useGetCountiesQuery, useGetTendersQuery, useGetBiddersQuery, useGetTenderTypesQuery } from '@/services/tender/tenderApiSlice';
import { Fragment } from 'react';
import { Tender } from '@/types/primitive.type';
import { z } from 'zod';
import { Slider } from '@/components/Slider';

const Screen = () => {
  const {
    bidder,
    county,
    tender_type,
    budget_min,
    budget_max,
  } = Route.useSearch();
  const { data: tendersData } = useGetTendersQuery({
    county,
    tender_type,
    bidder,
    budget_min,
    budget_max,
  });
  const tenders = tendersData?.tenders || [];



  return (
    <div className="flex flex-col mx-auto min-h-screen bg-[F9F9FB]">
      <Navbar />
      <div className="h-10 bg-white mx-[53px]" />
      <div className='flex bg-[#F2DCA6] grow pt-2 pr-2 mx-[53px]'>
        <FilterSection key={Math.random()} />
        <div className='flex flex-col bg-white grow rounded-t-lg px-10 py-3 gap-11 pb-10'>
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
                  <Link to={'/$id'} params={{ id: tender._id }}>
                    <TenderItem tender={tender} />
                  </Link>
                </Fragment>
              ))
            }
          </div>
        </div>
      </div >
    </div >
  );
};

function FilterSection() {
  const navigate = useNavigate({ from: Route.fullPath })
  const {
    bidder,
    county,
    tender_type,
    budget_min,
    budget_max,
  } = Route.useSearch();
  const { data: countiesData } = useGetCountiesQuery();
  const counties = countiesData?.counties || [];
  const { data: biddersData } = useGetBiddersQuery();
  const bidders = biddersData?.bidders || [];
  const { data: tenderTypesData } = useGetTenderTypesQuery();
  const tenderTypes = tenderTypesData?.tenderTypes || [];

  const handleReset = () => {
    navigate(
      {
        to: Route.fullPath,
        search: undefined
      }
    )
  }
  return (
    <div className='flex flex-col grow px-[12px] gap-4 min-w-80 max-w-80'>
      <div>
        <h3
          className='font-semibold leading-7 text-base'
        >Select bid paramters</h3>
        <Separator className='bg-[#023047] mt-2' />
      </div>
      <div className="flex flex-col gap-1">
        <Label>Project type</Label>
        <Select defaultValue={tender_type} onValueChange={(value) => {
          navigate({
            to: Route.fullPath,
            search: (previous) => ({
              ...previous,
              tender_type: value
            })
          })
        }
        }>
          <SelectTrigger>
            <SelectValue placeholder="-All" />
          </SelectTrigger>
          <SelectContent>
            {
              tenderTypes.map((type) => (
                <SelectItem key={type} value={type}>{type}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-1">
        <Label>Contractor</Label>
        <Select defaultValue={bidder} onValueChange={(value) => {
          navigate({
            to: Route.fullPath,
            search: (previous) => ({
              ...previous,
              bidder: value
            })
          })
        }
        }>
          <SelectTrigger>
            <SelectValue placeholder="-All" />
          </SelectTrigger>
          <SelectContent>
            {
              bidders.map((bidder) => (
                <SelectItem key={bidder.name} value={bidder.name}>{bidder.name}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Location (County / State)</Label>
        <Select defaultValue={county} onValueChange={(value) => {
          navigate({
            to: Route.fullPath,
            search: (previous) => ({
              ...previous,
              county: value
            })
          })
        }
        }>
          <SelectTrigger>
            <SelectValue placeholder="-All" />
          </SelectTrigger>
          <SelectContent>
            {
              counties.map((county) => (
                <SelectItem key={county} value={county}>{county}</SelectItem>
              ))
            }
          </SelectContent>
        </Select>
      </div>

      {/* price range (in dollars) {from and to two input fields} */}
      <div className="flex flex-col gap-3">
        <Label>Price range (in dollars)</Label>
        <Slider
          max={10000000}
          min={0}
          step={100000}
          value={[Number(budget_min) || 0, Number(budget_max) || 10000000]}
          onValueChange={(value) => {
            navigate({
              to: Route.fullPath,
              search: (previous) => ({
                ...previous,
                budget_min: value[0],
                budget_max: value[1]
              })
            })
          }}
          className="w-full"
        />
      </div>

      <Button
        variant='outline'
        type='reset'
        className='bg-transparent w-max self-end font-medium border-[#023047] mt-6'
        onClick={handleReset}
      >
        Reset Filters
      </Button>

    </div>
  )
}


function TenderItem(
  { tender }: {
    tender: Tender;
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


const filterSchema = z.object({
  county: z.string().optional(),
  tender_type: z.string().optional(),
  bidder: z.string().optional(),
  budget_min: z.number().optional(),
  budget_max: z.number().optional()
})

export const Route = createFileRoute('/_protected/search-by-bids')({
  component: Screen,
  validateSearch: filterSchema
})