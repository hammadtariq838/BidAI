import { createFileRoute } from '@tanstack/react-router'
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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LayoutGrid, List } from 'lucide-react';

const Screen = () => {
  return (
    <div className="flex flex-col mx-auto min-h-screen bg-[F9F9FB]">
      <Navbar />
      <div className="h-10 bg-white mx-[53px]" />
      <div className='flex bg-[#F2DCA6] grow pt-2 pr-2 mx-[53px]'>
        <div className='flex flex-col w-28 grow px-[12px] gap-4'>
          <div>
            <h3
              className='font-semibold leading-7 text-base'
            >Select bid paramters</h3>
            <Separator className='bg-[#023047] mt-2' />
          </div>
          <div className="flex flex-col gap-1">
            <Label>Project type</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="-All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-1">
            <Label>Contractor</Label>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="-All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex flex-col gap-2">
            <Label>Location</Label>
            <RadioGroup defaultValue="county" className='flex gap-4'>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="county" id="county" className='bg-white' />
                <Label htmlFor="county">County</Label>
              </div>
              <div className="flex items-center gap-2">
                <RadioGroupItem value="state" id="state" className='bg-white' />
                <Label htmlFor="state">State</Label>
              </div>
            </RadioGroup>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder="-All" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="apple">Apple</SelectItem>
                <SelectItem value="banana">Banana</SelectItem>
                <SelectItem value="blueberry">Blueberry</SelectItem>
                <SelectItem value="grapes">Grapes</SelectItem>
                <SelectItem value="pineapple">Pineapple</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* price range (in dollars) {from and to two input fields} */}
          <div className="flex flex-col gap-1">
            <Label>Price range (in dollars)</Label>
            <div className="flex items-center gap-2">
              <Label className='w-20'>From</Label>
              <Input type="number" placeholder="" />
            </div>
            <div className="flex items-center gap-2">
              <Label className='w-20'>To</Label>
              <Input type="number" placeholder="" />
            </div>
          </div>

          <Button
            variant='outline'
            type='reset'
            className='bg-transparent w-max self-end font-medium border-[#023047]'
          >
            Reset Filters
          </Button>

        </div>
        <div className='flex flex-col bg-white grow rounded-t-lg px-10 py-3 gap-11 pb-10'>
          <div className="flex items-center justify-between">
            <span>117 results returned</span>
            <div className="flex gap-4">
              <LayoutGrid size={24} className='cursor-pointer' />
              <List size={24} className='cursor-pointer' />
            </div>
          </div>
          <div className="flex flex-col gap-6">
            <TenderItem />
            <TenderItem />
            <TenderItem />
            <TenderItem />
          </div>
        </div>
      </div>
    </div>
  );
};


function TenderItem() {
  return (
    <div className='flex flex-col h-[155px] w-[815px] border rounded divide-y-1 shadow'>
      <div className=' grow flex items-center divide-x-1'>
        <div className='flex items-center w-2/5 h-full px-4'>
          <h3 className='font-semibold text-2xl'>
            TENDER ID - 100134301
          </h3>
        </div>
        <div className="flex items-center w-3/5 h-full px-4">
          <p>
            <span className='font-semibold'>Contractor:</span>
            {' '}
            Hill brothers construction company, inc.
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
            <span>Bridge</span>
          </div>
          <div className='flex items-center w-3/5 h-full px-4'>
            <span>Transportation</span>
          </div>
          <div className='flex items-center w-3/5 h-full px-4'>
            <span>$1,000,000</span>
          </div>
          <div className='flex items-center w-2/5 h-full px-4'>
            <span>Hennepin</span>
          </div>
          <div className='flex items-center w-2/5 h-full px-4'>
            <span>100134301</span>
          </div>
        </div>
      </div>
    </div>
  )
}

export const Route = createFileRoute('/_protected/search-by-bids')({
  component: Screen
})