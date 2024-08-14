import { Outlet, createFileRoute, useNavigate } from '@tanstack/react-router'
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
import { useGetCountiesQuery, useGetBiddersQuery, useGetTenderTypesQuery } from '@/services/tender/tenderApiSlice';
import { z } from 'zod';
// import { Slider } from '@/components/Slider';

const Screen = () => {
  return (
    <>
      <FilterSection key={Math.random()} />
      <Outlet />
    </>
  );
};

function FilterSection() {
  const navigate = useNavigate({ from: Route.fullPath })
  const {
    bidder,
    county,
    tender_type,
    // budget_min,
    // budget_max,
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
        <div className="flex items-center gap-2">
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
          <Button
            variant='outline'
            type='reset'
            className='bg-transparent w-max self-end font-medium border-[#023047]'
            onClick={() => {
              navigate({
                to: Route.fullPath,
                search: (previous) => ({
                  ...previous,
                  tender_type: undefined
                })
              })
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-1">
        <Label>Contractor</Label>
        <div className="flex items-center gap-2">
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
          <Button
            variant='outline'
            type='reset'
            className='bg-transparent w-max self-end font-medium border-[#023047]'
            onClick={() => {
              navigate({
                to: Route.fullPath,
                search: (previous) => ({
                  ...previous,
                  bidder: undefined
                })
              })
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <Label>Location (County / State)</Label>
        <div className="flex items-center gap-2">
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
          <Button
            variant='outline'
            type='reset'
            className='bg-transparent w-max self-end font-medium border-[#023047]'
            onClick={() => {
              navigate({
                to: Route.fullPath,
                search: (previous) => ({
                  ...previous,
                  county: undefined
                })
              })
            }}
          >
            Reset
          </Button>
        </div>
      </div>
      <Button
        variant='outline'
        type='reset'
        className='bg-transparent w-max self-end font-medium border-[#023047] mt-6'
        onClick={handleReset}
      >
        Reset all Filters
      </Button>

    </div>
  )
}

const filterSchema = z.object({
  county: z.string().optional(),
  tender_type: z.string().optional(),
  bidder: z.string().optional(),
  // budget_min: z.number().optional(),
  // budget_max: z.number().optional()
})

export const Route = createFileRoute('/_protected/bids')({
  component: Screen,
  validateSearch: filterSchema
})